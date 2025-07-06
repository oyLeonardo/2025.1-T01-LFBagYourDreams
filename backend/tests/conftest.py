import pytest
from app.serializers import ProductDetailSerializer, ProductListSerializer
from app.models import Produto


@pytest.fixture
def product():
  yield Produto.objects.create(
    titulo="Produto Teste",
    descricao="Durável e confiável",
    preco=99.99,
    quantidade=10,
    categoria="Masculino",
    material="Couro",
    cor_padrao="Preto",
    altura=30.0,
    comprimento=40.0,
    largura=20.0
  )