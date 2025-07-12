"""Views do aplicativo para lidar com produtos e integração com Supabase."""

import logging
from django.http import JsonResponse, HttpResponse
from django.db import DatabaseError
from rest_framework import generics, filters, status #permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .utils.supabase_utils import fetch_from_supabase, insert_to_supabase
from . import serializers, models
from .serializers import ProdutoImagemSerializer

def fetch_data_view(request):   # pylint: disable=unused-argument
    """
    View para buscar dados da Supabase e retornar como JSON.
    """
    data = fetch_from_supabase('')
    return JsonResponse(data, safe=False)


def insert_data_view(request):  # pylint: disable=unused-argument
    """
    View para inserir dados na Supabase via POST.
    """
    if request.method == 'POST':
        data = request.POST.dict()
        response = insert_to_supabase('', data)
        return JsonResponse(response, safe=False)
    return HttpResponse(status=405)  # Método não permitido


def home(request):  # pylint: disable=unused-argument
    """
    View simples de página inicial.
    """
    return HttpResponse("Bem-vindo(a) à página inicial!")


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

logger = logging.getLogger(__name__)

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
