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

@api_view(['POST']) # Aceita apenas requisições POST
@permission_classes([AllowAny]) # Ajuste as permissões conforme sua necessidade (ex: IsAuthenticated)
@csrf_exempt # Use apenas se necessário, o Django REST Framework tem sua própria forma de lidar com CSRF
def process_payment(request):
    if request.method == 'POST':
        try:
            # Receber os dados do frontend
            data = json.loads(request.body)
            print("Dados recebidos no backend:", data) # Para depuração
            
            token = data.get('token')
            payment_method_id = data.get('payment_method_id')
            installments = data.get('installments')
            transaction_amount = data.get('transaction_amount')
            description = data.get('description')

            payer_data = data.get('payer', {})
            payer_email = payer_data.get('email')
            payer_first_name = payer_data.get('first_name')
            payer_last_name = payer_data.get('last_name')

            identification_data = payer_data.get('identification', {})
            identification_type = identification_data.get('type')
            identification_number = identification_data.get('number')

            shipping_address_data = data.get('shipping_address', {})
            shipping_city = shipping_address_data.get('city')
            shipping_federal_unit = shipping_address_data.get('federal_unit')
            shipping_neighborhood = shipping_address_data.get('neighborhood')
            shipping_street_name = shipping_address_data.get('street_name')
            shipping_street_number = shipping_address_data.get('street_number')
            shipping_zip_code = shipping_address_data.get('zip_code')

            print("DEBUG: Antes da validação 'all()'.")
            print(f"DEBUG_VALORES: token='{token}', payment_method_id='{payment_method_id}', installments={installments}, transaction_amount={transaction_amount}, payer_email='{payer_email}'")
            print(f"DEBUG_TIPOS: token_type={type(token)}, payment_method_id_type={type(payment_method_id)}, installments_type={type(installments)}, transaction_amount_type={type(transaction_amount)}, payer_email_type={type(payer_email)}")

            # Exemplo de validação básica (adicione mais validações)
            if not all([token, payment_method_id, installments, transaction_amount, payer_email]):
                print("Validação falhou: Dados incompletos.")
                print(f"Token: {token}, PaymentMethodId: {payment_method_id}, Installments: {installments}, TransactionAmount: {transaction_amount}, PayerEmail: {payer_email}")
                return Response({"message": "Dados incompletos para processar o pagamento"}, status=status.HTTP_400_BAD_REQUEST)

            try:
                with transaction.atomic():
                    # 1. Criar o Pedido no seu banco de dados
                    teste_carrinho = Carrinho.objects.create(
                        subtotal=float(transaction_amount)
                    )

                    novo_pedido = Pedido.objects.create(
                        nome_usuario=f"{payer_first_name} {payer_last_name}".strip(),
                        email_usuario=payer_email,
                        codigo_carrinho=teste_carrinho,
                        cep=shipping_zip_code,
                        bairro=shipping_street_name,
                        complemento=shipping_street_number,
                        estado=shipping_federal_unit,
                        cidade=shipping_city,
                        numero=shipping_street_number,
                        quadra=shipping_street_name,
                        metodo_pagamento=payment_method_id,
                        status='pendente', # Status inicial,
                        frete=0.00,
                        valor_total=float(transaction_amount)
                        # ... outros campos relevantes do modelo Pedido (ex: itens do carrinho, data, etc.)
                    )
                    # O ID do Pedido é gerado automaticamente após o create
                    order_id = str(novo_pedido.id) # Use o ID do Pedido como external_reference

                    # Adicionar a chave de idempotência
                    request_options = mercadopago.config.RequestOptions()
                    # Use um valor único, por exemplo, o ID do Pedido ou um UUID gerado.
                    # Se você já tem um order_id, ele pode servir como base.
                    # Se você quer idempotência por *tentativa* de pagamento, gere um UUID aqui.
    
                    idempotency_key = str(uuid.uuid4()) # Gera um UUID único para cada tentativa

                    request_options.custom_headers = {
                        'x-idempotency-key': idempotency_key
                    }

                    # 2. Preparar os dados para o Mercado Pago
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
                            "identification": {
                                "type": identification_type,
                                "number": identification_number,
                            }
                        },
                        "additional_info": { # Informações adicionais para o Mercado Pago
                            "items": [
                                # Aqui você deve popular com os itens do carrinho que vieram do frontend
                                # Exemplo: {"id": "1", "title": "Bolsa Couro", "description": "Bolsa de couro genuíno", "quantity": 1, "unit_price": 3552.00}
                            ],
                            "payer": {
                                "first_name": payer_first_name,
                                "last_name": payer_last_name,
                                "phone": { "area_code": "", "number": "" },
                                "address": {
                                    "zip_code": shipping_zip_code,
                                    "street_name": shipping_street_name,
                                    "street_number": shipping_street_number,
                                    "neighborhood": shipping_neighborhood,
                                    "city": shipping_city,
                                    "federal_unit": shipping_federal_unit
                                }
                            },
                            "shipments": {
                                "receiver_address": {
                                    "zip_code": shipping_zip_code,
                                    "street_name": shipping_street_name,
                                    "street_number": shipping_street_number,
                                    "city": shipping_city,
                                    "federal_unit": shipping_federal_unit
                                }
                            }
                        }
                    }

                    # 3. Chamar o SDK do Mercado Pago para criar o pagamento
                    payment_response = sdk.payment().create(payment_data, request_options)

                    # Verificar se a resposta tem a estrutura esperada
                    if "response" not in payment_response:
                        raise ValueError(f"Resposta inesperada do Mercado Pago: {payment_response}")

                    mp_status = payment_response["response"].get("status")
                    mp_status_detail = payment_response["response"].get("status_detail")
                    mp_payment_id = payment_response["response"].get("id") # ID do pagamento no MP

                    # 4. Atualize o status do seu Pedido com base na resposta do Mercado Pago
                    if mp_status == 'approved':
                        novo_pedido.status = 'aprovado'
                        logger.info(f"Pagamento aprovado para Pedido {order_id} (MP ID: {mp_payment_id}).")
                        # TODO: Lógica para enviar confirmação de pedido, etc.
                    elif mp_status == 'pending':
                        novo_pedido.status = 'pendente_mp' # Para diferenciar de "pendente" inicial
                        logger.warning(f"Pagamento pendente para Pedido {order_id} (MP ID: {mp_payment_id}). Detalhes: {mp_status_detail}")
                    else: # rejected, cancelled, etc.
                        novo_pedido.status = 'rejeitado'
                        # logger.error(f"Pagamento rejeitado para Pedido {order_id} (MP ID: {mp_payment_id}). Status: {mp_status}, Detalhes: {mp_status_detail}")
                        # TODO: Lógica para lidar com pagamentos rejeitados
                    
                    novo_pedido.mercadopago_payment_id = mp_payment_id # Salvar o ID do pagamento do MP
                    novo_pedido.external_reference = order_id
                    novo_pedido.save() # Salva a atualização de status

                    # 5. Retorne a resposta ao frontend
                    if mp_status == 'approved':
                        return Response({"message": "Pagamento processado com sucesso!", "payment_id": mp_payment_id, "order_id": order_id}, status=status.HTTP_200_OK)
                    else:
                        return Response({"message": f"Pagamento não aprovado: {mp_status_detail}", "payment_status": mp_status, "payment_id": mp_payment_id, "order_id": order_id}, status=status.HTTP_400_BAD_REQUEST)

            except DatabaseError as db_error:
                # Tratar erros do banco de dados (ex: falha ao criar Pedido)
                logger.error(f"Erro no banco de dados ao processar pagamento: {db_error}", exc_info=True)
                return Response({"message": "Erro no servidor ao salvar pedido.", "details": str(db_error)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            except Exception as e:
                # Capturar outros erros da lógica de pagamento
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Erro inesperado ao processar pagamento: {e}", exc_info=True)
                return Response({"message": "Erro interno ao processar o pagamento", "details": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except json.JSONDecodeError:
            return Response({"message": "Invalid JSON in request body"}, status=status.HTTP_400_BAD_REQUEST)
        
    return Response({"message": "Método não permitido"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@csrf_exempt
def mercadopago_webhook(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            topic = data.get('topic')
            resource_id = data.get('id')

            logger.info(f"Webhook recebido: Topic={topic}, ID={resource_id}")

            if topic == 'payment':
                mercadopago_service = MercadoPagoService()
                payment_details = mercadopago_service.get_payment_details(resource_id)

                if payment_details:
                    with transaction.atomic():
                        external_reference = payment_details.get('external_reference')
                        mp_status = payment_details.get('status')
                        mp_id = payment_details.get('id')

                        try:
                            Pedido = Pedido.objects.get(external_reference=external_reference)
                            Pedido.mp_payment_id = mp_id
                            Pedido.status = mp_status # Atualiza o status do seu pedido
                            Pedido.save()
                            logger.info(f"Pedido {Pedido.id} atualizado para status: {mp_status}")
                            return JsonResponse({"status": "success"}, status=200)
                        except Pedido.DoesNotExist:
                            logger.warning(f"Webhook para external_reference {external_reference} não encontrado.")
                            return JsonResponse({"status": "error", "message": "Pedido not found"}, status=404)
                else:
                    return JsonResponse({"status": "error", "message": "Failed to fetch payment details"}, status=400)
            else:
                logger.info(f"Webhook de tópico ignorado: {topic}")
                return JsonResponse({"status": "ignored"}, status=200)

        except json.JSONDecodeError:
            logger.error("Webhook: Invalid JSON payload.")
            return JsonResponse({"status": "error", "message": "Invalid JSON"}, status=400)
        except Exception as e:
            logger.error(f"Erro inesperado no webhook: {e}", exc_info=True)
            return JsonResponse({"status": "error", "message": str(e)}, status=500)
    return JsonResponse({"status": "method not allowed"}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
def get_public_key(request):
    """
    Retorna a chave pública do Mercado Pago para o frontend.
    """
    return JsonResponse({"public_key": settings.MERCADOPAGO_PUBLIC_KEY})
