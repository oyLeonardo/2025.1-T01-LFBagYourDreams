import pytest
from app.models import Produto


@pytest.mark.django_db
def test_product_valid_creation():
    """
    Testa a criação de um produto com dados válidos.
    """
    product = Produto.objects.create(
        titulo="Teste Produto",
        descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        preco=99.99,
        quantidade=100,
        categoria="Masculino",
        material="Couro",
        cor_padrao="Preto",
        altura=10.0,
        comprimento=10.0,
        largura=10.0
    )

    assert product.id is not None
    assert Produto.objects.filter(id=product.id).exists()


@pytest.mark.django_db
def test_product_str():
    """
    Testa o método __str__ do modelo Produto.
    """

    product = Produto.objects.create(
        titulo="Teste Produto",
        descricao="Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        preco=99.99,
        quantidade=100,
        categoria="Masculino",
        material="Couro",
        cor_padrao="Preto",
        altura=10.0,
        comprimento=10.0,
        largura=10.0
    )

    assert str(product) == "Teste Produto"