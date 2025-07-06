import pytest
from app.models import Carrinho


@pytest.mark.django_db
def test_valid_cart_creation():
    """
    Testa a criação de um carrinho com dados válidos.
    Deve existir no banco de dados após a criação.
    """

    cart = Carrinho.objects.create(subtotal=0.0)

    assert cart.id is not None
    assert Carrinho.objects.filter(id=cart.id).exists()


@pytest.mark.django_db
def test_cart_str():
    """
    Testa o método __str__ do modelo Carrinho.
    Deve retornar uma representação do carrinho.
    """

    cart = Carrinho.objects.create(subtotal=0.0)
    assert str(cart) == f'Subtotal: {cart.subtotal}'