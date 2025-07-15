from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.urls import reverse
from django.conf import settings
from django.db import transaction, DatabaseError
from django_filters.rest_framework import DjangoFilterBackend
from .utils.supabase_utils import fetch_from_supabase, insert_to_supabase
from .services.mercadopago_service import MercadoPagoService
from . import models, serializers
from .models import Carrinho, Cor, Personalizacao, Produto, ProdutoCarrinho, Pedido
from .serializers import CarrinhoSerializer, CorSerializer, PersonalizacaoSerializer, ProdutoSerializer, ProdutoCarrinhoSerializer, PedidoSerializer, ProdutoImagemSerializer
from datetime import datetime
from rest_framework import generics, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from botocore.exceptions import ClientError
import mercadopago
import json
import logging
import uuid

logger = logging.getLogger(__name__)

def home_view(request):
    return HttpResponse("Bem-vindo à página inicial do backend!")

def fetch_data_view(request):   # pylint: disable=unused-argument
    
    #View para buscar dados da Supabase e retornar como JSON.
    
    data = fetch_from_supabase('')
    return JsonResponse(data, safe=False)


def insert_data_view(request):  # pylint: disable=unused-argument
    
    #View para inserir dados na Supabase via POST.
    
    if request.method == 'POST':
        data = request.POST.dict()
        response = insert_to_supabase('', data)
        return JsonResponse(response, safe=False)

    return HttpResponse(status=405)  # Método não permitido

class ProductList(generics.ListCreateAPIView):
    """
    API view para listar e criar produtos.
    """
    queryset = models.Produto.objects.all() # pylint: disable=no-member
    serializer_class = serializers.ProductListSerializer
    #permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'material', 'cor_padrao']
    search_fields = ['titulo', 'descricao']
    ordering_fields = ['preco', 'quantidade']
    ordering = ['preco']  # padrão

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view para recuperar, atualizar ou deletar um produto específico.
    """
    queryset = models.Produto.objects.all() # pylint: disable=no-member
    serializer_class = serializers.ProductDetailSerializer
    #permission_classes = [permissions.IsAuthenticated]

class ImageUploadView(APIView):
    """
    View para upload de imagens de produtos.
    """
    serializer_class = ProdutoImagemSerializer

    def post(self, request):
        """
        Lida com upload de imagens de produto via POST.
        """
        serializer = self.serializer_class(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except DatabaseError:
            logger.exception("Erro ao salvar imagem no banco de dados.")
            return Response(
                {'detail': 'Erro ao salvar no banco de dados.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        except ClientError as e: # <<< MUDANÇA AQUI
             # Erro específico do Boto3 (comunicação com S3/Supabase)
             print("--------------------------------------------------")
             print(">>> ERRO BOTOCORE (S3/SUPABASE) DETECTADO! <<<")

        except Exception as e:
            # Pega qualquer outro erro inesperado que possa ter acontecido.
            print("--------------------------------------------------")
            print(">>> ERRO GENÉRICO DETECTADO! <<<")
            print(f"Tipo do Erro: {type(e)}")
            print(f"Mensagem: {e}")
            print("--------------------------------------------------")
            return Response({'detail': f'Ocorreu um erro inesperado no servidor: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def process_payment(request):
    if request.method != 'POST':
        return Response({"message": "Método não permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    try:
        data = json.loads(request.body)
        logger.info("Dados recebidos no backend: %s", data)

        # --- 1. Extração de Dados ---
        token = data.get('token')
        payment_method_id = data.get('payment_method_id')
        installments = data.get('installments')
        transaction_amount = data.get('transaction_amount')
        description = data.get('description')

        payer_data = data.get('payer', {})
        # CORREÇÃO: Lendo todos os dados do pagador a partir do objeto 'payer_data'
        payer_email = payer_data.get('email')
        payer_first_name = payer_data.get('first_name')
        payer_last_name = payer_data.get('last_name')
        
        identification_data = payer_data.get('identification', {})
        identification_type = identification_data.get('type')
        identification_number = identification_data.get('number')

        shipping_address_data = data.get('shipping_address', {})
        shipping_zip_code = shipping_address_data.get('zip_code')
        shipping_street_name = shipping_address_data.get('street_name')
        shipping_street_number = shipping_address_data.get('street_number')
        shipping_city = shipping_address_data.get('city')
        shipping_federal_unit = shipping_address_data.get('federal_unit')

        # --- Validação ---
        if not all([token, payment_method_id, installments, transaction_amount, payer_email]):
            logger.warning("Validação falhou: Dados incompletos. %s", data)
            return Response({"message": "Dados incompletos para processar o pagamento"}, status=status.HTTP_400_BAD_REQUEST)

        # --- 2. Criação do Pedido e Preparação para o MP ---
        with transaction.atomic():
            # CORREÇÃO: Lógica para criar o pedido no banco de dados
            temp_cart = Carrinho.objects.create(subtotal=float(transaction_amount))
            novo_pedido = Pedido.objects.create(
                nome_usuario=f"{payer_first_name} {payer_last_name}".strip(),
                email_usuario=payer_email,
                codigo_carrinho=temp_cart,
                cep=shipping_zip_code,
                bairro=shipping_address_data.get('neighborhood', ''),
                cidade=shipping_city,
                estado=shipping_federal_unit,
                numero=shipping_street_number,
                quadra=shipping_street_name,
                metodo_pagamento=payment_method_id,
                status='pendente',
                valor_total=float(transaction_amount)
            )
            order_id = str(novo_pedido.id)
            
            # CORREÇÃO: Criando o objeto request_options
            request_options = mercadopago.config.RequestOptions()
            request_options.custom_headers = { 'x-idempotency-key': str(uuid.uuid4()) }

            # --- 3. Envio para o Mercado Pago ---
            sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
            payment_data = {
                "token": token,
                "transaction_amount": float(transaction_amount),
                "payment_method_id": payment_method_id,
                "installments": int(installments),
                "description": description,
                "external_reference": order_id,
                "payer": {
                    "email": payer_email,
                    "first_name": payer_first_name,
                    "last_name": payer_last_name,
                    "identification": { "type": identification_type, "number": identification_number }
                }
            }

            logger.info("Enviando para Mercado Pago...")
            payment_response = sdk.payment().create(payment_data, request_options)
            logger.info("Resposta completa do Mercado Pago: %s", payment_response)

            if "response" not in payment_response or payment_response.get("status") >= 400:
                error_details = payment_response.get("response", {})
                logger.error("Erro da API do Mercado Pago para o pedido %s: %s", order_id, error_details)
                novo_pedido.status = 'falha_mp'
                novo_pedido.save()
                return Response({"message": "Gateway de pagamento retornou um erro.", "details": error_details}, status=status.HTTP_400_BAD_REQUEST)
            
            # --- 4. Atualização do Status do Pedido ---
            response_body = payment_response["response"]
            mp_status = response_body.get("status")
            mp_status_detail = response_body.get("status_detail")
            mp_payment_id = response_body.get("id")

            logger.info("MP Status: %s, Detail: %s, Payment ID: %s", mp_status, mp_status_detail, mp_payment_id)

            if mp_status == 'approved':
                novo_pedido.status = 'aprovado'
            elif mp_status == 'pending' or mp_status == 'in_process':
                novo_pedido.status = 'pendente_mp'
            else:
                novo_pedido.status = 'rejeitado'

            novo_pedido.mercadopago_payment_id = mp_payment_id
            novo_pedido.save()

            # --- 5. Resposta ao Frontend ---
            if novo_pedido.status == 'aprovado':
                return Response({"message": "Pagamento aprovado!", "payment_id": mp_payment_id, "order_id": order_id}, status=status.HTTP_201_CREATED)
            else:
                return Response({"message": "Pagamento não aprovado", "mp_status_detail": mp_status_detail}, status=status.HTTP_400_BAD_REQUEST)

    except json.JSONDecodeError:
        logger.error("Erro de decodificação JSON no corpo da requisição.")
        return Response({"message": "Corpo da requisição JSON inválido"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error("Erro inesperado em process_payment: %s", e, exc_info=True)
        return Response({"message": "Erro interno no servidor", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@csrf_exempt
@require_http_methods(["GET"])
def get_public_key(request):
    """
    Retorna a chave pública do Mercado Pago para o frontend.
    """
    return JsonResponse({"public_key": settings.MERCADOPAGO_PUBLIC_KEY})

@csrf_exempt
def mercadopago_webhook(request):
    """
    Recebe notificações de webhook do Mercado Pago para atualizar o status dos pagamentos.
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            topic = data.get('topic')
            
            logger.info(f"Webhook recebido: {data}")

            if topic == 'payment':
                payment_id = data.get('id') or data.get('data', {}).get('id')
                if not payment_id:
                    logger.warning("Webhook de pagamento sem ID recebido.")
                    return JsonResponse({"status": "error", "message": "Payment ID não encontrado no webhook"}, status=400)

                # Usando o SDK para buscar os detalhes do pagamento de forma segura
                sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)
                payment_details = sdk.payment().get(payment_id)

                if payment_details and payment_details.get("status") == 200:
                    payment_info = payment_details["response"]
                    external_reference = payment_info.get('external_reference')
                    mp_status = payment_info.get('status')
                    mp_id = payment_info.get('id')

                    if not external_reference:
                        logger.warning(f"Pagamento {mp_id} recebido via webhook sem external_reference.")
                        return JsonResponse({"status": "ignored", "message": "Sem external_reference"}, status=200)

                    # Atualiza o pedido no banco de dados
                    try:
                        with transaction.atomic():
                            pedido = Pedido.objects.get(id=external_reference)
                            pedido.mercadopago_payment_id = mp_id
                            pedido.status = mp_status # Ex: 'approved', 'rejected'
                            pedido.save()
                            logger.info(f"Pedido {pedido.id} atualizado via webhook para status: {mp_status}")
                    
                    except Pedido.DoesNotExist:
                        logger.warning(f"Webhook para pedido com ID (external_reference) {external_reference} não encontrado.")
                        return JsonResponse({"status": "error", "message": "Pedido não encontrado"}, status=404)
                
                else:
                    logger.error(f"Não foi possível buscar detalhes do pagamento {payment_id} via webhook.")
                    return JsonResponse({"status": "error", "message": "Falha ao buscar detalhes do pagamento"}, status=400)

            return JsonResponse({"status": "received"}, status=200)

        except json.JSONDecodeError:
            logger.error("Webhook: Payload JSON inválido.")
            return JsonResponse({"status": "error", "message": "JSON inválido"}, status=400)
        except Exception as e:
            logger.error(f"Erro inesperado no webhook: {e}", exc_info=True)
            return JsonResponse({"status": "error", "message": str(e)}, status=500)

    return JsonResponse({"status": "method not allowed"}, status=405)
