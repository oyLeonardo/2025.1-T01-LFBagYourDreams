import pytest
from django.db import IntegrityError
from app.models import Produto, Carrinho, ProdutoCarrinho


@pytest.mark.django_db
def test_product_cart_creation():
    """Testa a criação de um link entre um produto e carrinho existentes.
    Deve existir no banco de dados após a criação.
    """

    produto = Produto.objects.create(
        preco=25.0,
        quantidade=2,
        categoria="Geral",
        material="Madeira",
        cor_padrao="Marrom",
        titulo="Banco Pequeno",
        descricao="Banco rústico de madeira",
        altura=45.0,
        comprimento=30.0,
        largura=30.0
    )

    carrinho = Carrinho.objects.create(subtotal=0.0)

    link = ProdutoCarrinho.objects.create(
        id_produto=produto,
        id_carrinho=carrinho
    )

    assert link.id_produto == produto
    assert link.id_carrinho == carrinho

    assert ProdutoCarrinho.objects.filter(
        id_produto=produto,
        id_carrinho=carrinho
    ).exists()


@pytest.mark.django_db
def test_product_cart_creation_without_linking_existent_objs():
    """Testa a criação de um link entre produto e carrinho inexistentes.
    Deve retornar um erro de integridade.
    """

    with pytest.raises(IntegrityError):
        ProdutoCarrinho.objects.create(
            id_produto=None,
            id_carrinho=None
        )