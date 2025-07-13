"""Arquivo de definição das rotas da API"""

import logging
import json
from datetime import datetime
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db import transaction, DatabaseError
from rest_framework import generics, filters, status, permissions

from rest_framework.views import APIView, View
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.conf import settings
from .utils.supabase_utils import fetch_from_supabase, insert_to_supabase
from .services.mercadopago_service import MercadoPagoService
from . import models, serializers
from .models import Pedido
from .serializers import OrderSerializer
from .serializers import ProdutoImagemSerializer

# from rest_framework.parsers import MultiPartParser, FormParser
# from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer

# Imports de bibliotecas externas
from botocore.exceptions import ClientError
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated

def home_view(request):
    """Homepage de teste."""
    return HttpResponse("Bem-vindo à página inicial do backend!")


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personalizado para incluir informações adicionais no token JWT."""
    @classmethod
    def get_token(cls, user):
        """Retorna o token JWT com claims customizadas para o usuário."""
        token = super().get_token(user)

        # Add custom claims
        token['is_staff'] = user.is_staff
        token['is_superuser'] = user.is_superuser

        return token

class MyTokenObtainPairView(TokenObtainPairView):
    """View personalizada para o token JWT."""
    serializer_class = MyTokenObtainPairSerializer

def fetch_data_view(request):
    """Retorna dados do banco de dados."""

    data = fetch_from_supabase('')
    return JsonResponse(data, safe=False)


def insert_data_view(request):
    """Rota para inserir dados na Supabase via POST."""

    if request.method == 'POST':
        data = request.POST.dict()
        response = insert_to_supabase('', data)
        return JsonResponse(response, safe=False)

    return HttpResponse(status=405)


class ProductList(generics.ListCreateAPIView):
    """
    API view para listar e criar produtos.
    """
    queryset = models.Produto.objects.all()
    serializer_class = serializers.ProductListSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Permite leitura para não autenticados
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['categoria', 'material', 'cor_padrao']
    search_fields = ['titulo', 'descricao', 'material']
    ordering_fields = ['preco', 'quantidade']
    ordering = ['preco']


class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    API view para recuperar, atualizar ou deletar um produto específico.
    """
    queryset = models.Produto.objects.all()
    serializer_class = serializers.ProductDetailSerializer
    # permission_classes = [IsAuthenticated]
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]  # Permite leitura para não autenticados

logger = logging.getLogger(__name__)

class OrderList(generics.ListAPIView):
    """Classe que retorna uma lista de pedidos através do GET."""

    queryset = models.Pedido.objects.all()
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    filterset_fields = {
        'created_at': ['date', 'lt', 'gt'],
        'updated_at': ['date'],
        'metodo_pagamento': ['exact'],
        'status': ['exact']
    }

    ordering_fields = ['valor_total', 'created_at', 'updated_at']
    ordering = ['valor_total']


class OrderDetail(generics.RetrieveUpdateDestroyAPIView):
    """Classe que permite o GET/POST/DELETE de pedidos individualmente."""

    queryset = models.Pedido.objects.all()
    serializer_class = serializers.OrderSerializer
    # permission_classes = [IsAuthenticated])

    def update(self, request, *args, **kwargs):
        """Atualiza o status de um pedido e envia um e-mail informando o usuário."""

        instance = self.get_object()
        old_status = instance.status

        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        new_status = serializer.instance.status
        if old_status != new_status:
            email = serializer.instance.email_usuario
            subject = f"Atualização do Pedido {instance.id}"
            message = f"Seu pedido foi atualizado para o status: {new_status}."

            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [email])


        return Response(serializer.data)


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

            return Response(
                {'detail': f'Ocorreu um erro inesperado no servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        except Exception as e: # broad-exception-caught
            # Pega qualquer outro erro inesperado que possa ter acontecido.
            print("--------------------------------------------------")
            print(">>> ERRO GENÉRICO DETECTADO! <<<")
            print(f"Tipo do Erro: {type(e)}")
            print(f"Mensagem: {e}")
            print("--------------------------------------------------")
            return Response(
                {'detail': f'Ocorreu um erro inesperado no servidor: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

logger = logging.getLogger(__name__)

class ImagemProdutoDeleteView(generics.DestroyAPIView):
    """
    View para deletar uma imagem de produto específica.
    """
    queryset = models.ProdutoImagem.objects.all()
    serializer_class = ProdutoImagemSerializer # Precisa de um serializer, mesmo para deletar
    permission_classes = [IsAuthenticated] # Apenas admins podem deletar imagens

class CreatePedidoView(generics.CreateAPIView):
    """Classe que permite a criação de pedidos (POST)."""

    queryset = Pedido.objects.all()
    serializer_class = OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        amount = serializer.validated_data.get('valor_total')
        # Imagine que 'items' viria do seu request, ou seria predefinido
        items = [{
            "title": "Produto/Serviço Teste",
            "quantity": 1,
            "unit_price": float(amount),
        }]

        # Crie uma referência externa única para o seu pedido
        external_reference = f"Pedido_{datetime.now().strftime('%Y%m%d%H%M%S%f')}"
        serializer.validated_data['external_reference'] = external_reference

        # Salve o pedido no banco de dados primeiro com status pendente
        pedido_obj = serializer.save(status='pending')

        mercadopago_service = MercadoPagoService()

        # URLs de retorno após o pagamento no Mercado Pago
        back_urls = {
            "success": f"{settings.SITE_URL}{reverse('pagamento_sucesso')}",
            "pending": f"{settings.SITE_URL}{reverse('pagamento_pendente')}",
            "failure": f"{settings.SITE_URL}{reverse('pagamento_falha')}",
        }

        preference = mercadopago_service.create_payment_preference(
            items=items,
            back_urls=back_urls,
            external_reference=external_reference,
            # payer_info={'email': 'test_user@example.com'} # Opcional: dados do comprador
        )

        if preference and preference.get('status') == 201 \
            and 'init_point' in preference.get('response', {}):

            # Obtém o dicionário de resposta real do MP
            mp_response_data = preference['response']

            pedido_obj.mercadopago_preference_id = mp_response_data.get('id')
            pedido_obj.save()

            return Response(
                {'init_point': mp_response_data['init_point']},
                status=status.HTTP_201_CREATED
            )

        else:
            # Sua mensagem de log atual já é boa para depuração
            logger.error(
                f"Falha ao criar preferência ou 'init_point' ausente. Resposta MP: {preference}"
            )

            pedido_obj.status = 'failed_mp_creation'
            pedido_obj.save()

            return Response(
                {"detail": "Link de pagamento ausente ou erro na preferência."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PaymentSuccessView(View):
    def get(self, request):
        # O Mercado Pago retorna parametros na URL apos o pagamento
        payment_id = request.GET.get('payment_id')
        status = request.GET.get('status')
        external_reference = request.GET.get('external_reference')

        # Pode-se utilizar o payment_id para buscar detalhes completos do pagamento
        # mercadopago_service = MercadoPagoService()
        # payment_details = mercadopago_service.buscar_pagamento(payment_id)

        return render(request, 'templates/payment_success.html', {
            'payment_id': payment_id,
            'status': status,
            'external_reference': external_reference
        })

class PendingPaymentView(View):
    def get(self, request):
        return render(request, 'templates/pending_payment.html')

class PaymentFailureView(View):
    def get(self, request):
        return render(request, 'templates/payment_failure.html')

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

                            return JsonResponse(
                                {"status": "success"},
                                status=200
                            )

                        except Pedido.DoesNotExist:
                            logger.warning(
                                f"Webhook para external_reference \
                                {external_reference} não encontrado."
                            )

                            return JsonResponse(
                                {"status": "error", "message": "Pedido not found"},
                                status=404
                            )
                else:
                    return JsonResponse(
                        {"status": "error", "message": "Failed to fetch payment details"},
                        status=400
                    )
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
