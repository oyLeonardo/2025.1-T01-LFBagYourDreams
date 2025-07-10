"""Views do aplicativo para lidar com produtos e integração com Supabase."""

from django.http import JsonResponse, HttpResponse
from rest_framework import generics, permissions, filters
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from django_filters.rest_framework import DjangoFilterBackend
from .utils.supabase_utils import fetch_from_supabase, insert_to_supabase
from . import serializers
from . import models
from rest_framework.response import Response  # <<< O QUE FALTOU AGORA
from rest_framework import status

# Imports de bibliotecas externas
from botocore.exceptions import ClientError

# Imports locais do seu projeto
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
   # permission_classes = [permissions.IsAuthenticated]

class ImageUploadView(APIView):
    """
    Versão de depuração da view de upload para capturar erros silenciosos.
    """
    serializer_class = ProdutoImagemSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            # Se os dados iniciais forem inválidos (ex: produto não existe), retorna o erro padrão.
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        print(">>> serializer.is_valid() passou. Tentando salvar...")

        try:
            # A linha serializer.save() é onde a mágica (e o erro silencioso) acontece.
            # Ela cria o objeto no banco E faz o upload do arquivo para o Supabase.
            serializer.save()

            # Se chegarmos aqui, significa que nenhuma exceção foi levantada.
            print(">>> SUCESSO APARENTE: serializer.save() foi concluído sem exceções.")
            return Response(serializer.data, status=status.HTTP_201_CREATED)

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
