"""Testes para o serializador 'OrderSerializer'."""

import pytest
from rest_framework import serializers
from app.serializers import OrderSerializer
from app.models import Carrinho
from faker import Faker
import random


def generate_random_cep(hyphen: bool = True) -> str:
    """
    Gera um CEP aleatório no formato brasileiro 'nnnnn-nnn'.

    Returns:
        str: Um CEP válido com hífen (ex: '01310-200')
    """
    cep_prefix = random.randint(10000, 99999)
    cep_suffix = random.randint(100, 999)

    if hyphen:
        return f"{cep_prefix:05d}-{cep_suffix:03d}"
    return f"{cep_prefix:05d}{cep_suffix:03d}"

def test_valid_cep():
    """
    Valida o método 'validate_cep' do 'OrderSerializer'.
    Deve retornar 'True' quando o cep estiver no formato 'nnnnn-nnn'.
    """

    for _ in range(10):
        cep = generate_random_cep()
        assert OrderSerializer().validate_cep(cep)


def test_cep_without_hyphen():
    """
    Valida o método 'validate_cep' do 'OrderSerializer'.
    Deve retornar 'False' quando o cep estiver no formato 'nnnnnnnn'.
    """

    for _ in range(10):
        cep = generate_random_cep(hyphen=False)
        with pytest.raises(serializers.ValidationError):
            assert OrderSerializer().validate_cep(cep)


def test_valid_user_mail(faker: Faker):
    """
    Valida o método 'validate_email_usuario' do 'OrderSerializer'.
    Deve retornar 'True' quando o email tiver "@" e "."
    """

    for _ in range(10):
        assert OrderSerializer().validate_email_usuario(faker.email())


@pytest.mark.parametrize("value", [
    "invalid_mail",
    "mail",
    "test.com",
    "gmail.com",
    "@",
    " test.@gmail.com "
])
def test_invalid_user_mail(value):
    """
    Valida o método 'validate_email_usuario' do 'OrderSerializer'.
    Deve retornar 'False' quando o email não tiver um '.'
    """

    for _ in range(10):
        with pytest.raises(serializers.ValidationError):
            assert OrderSerializer().validate_email_usuario(value)


@pytest.mark.django_db
def test_existing_cart_code():
    """
    Valida o método 'validate_codigo_carrinho' do 'OrderSerializer'.
    Deve retornar 'True' quando o código do carrinho existir.
    """

    cart = Carrinho.objects.create(subtotal=0.0)
    assert OrderSerializer().validate_codigo_carrinho(cart.id)


@pytest.mark.django_db
def test_cart_code_without_existing_code():
    """
    Valida o método 'validate_codigo_carrinho' do 'OrderSerializer'.
    Deve retornar 'False' quando o código do carrinho não existir.
    """

    with pytest.raises(serializers.ValidationError):
        assert OrderSerializer().validate_codigo_carrinho(1)


def test_non_empty_neighborhood(faker: Faker):
    """
    Valida o método 'validate_bairro' do 'OrderSerializer'.
    Deve retornar 'True' quando o bairro tiver algum valor.
    """

    for _ in range(10):
        neighborhood = faker.bairro()
        assert OrderSerializer().validate_bairro(neighborhood)


def test_empty_neighborhood():
    """
    Valida o método 'validate_bairro' do 'OrderSerializer'.
    Deve retornar 'True' quando o bairro tiver algum valor.
    """

    with pytest.raises(serializers.ValidationError):
        assert OrderSerializer().validate_bairro("")
        assert OrderSerializer().validate_bairro("  ")


def test_shipping_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_frete' do 'OrderSerializer'.
    Deve retornar 'True' quando o frete é maior que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert OrderSerializer().validate_frete(n)


def test_shipping_equal_to_zero():
    """
    Valida o método 'validate_frete' do 'OrderSerializer'.
    Deve retornar 'True' quando o frete é zero.
    """

    OrderSerializer().validate_frete(0)


def test_shipping_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_frete' do 'OrderSerializer'.
    Deve retornar uma exceção quando o frete é menor que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=False) for _ in range(10)]:
        with pytest.raises(serializers.ValidationError):
            OrderSerializer().validate_frete(n)


def test_total_value_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_valor_total' do 'OrderSerializer'.
    Deve retornar 'True' quando o valor total é maior que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert OrderSerializer().validate_valor_total(n)


def test_total_value_equal_to_zero():
    """
    Valida o método 'validate_valor_total' do 'OrderSerializer'.
    Deve retornar uma exceção quando o valor total é zero.
    """

    with pytest.raises(serializers.ValidationError):
        OrderSerializer().validate_valor_total(0)


def test_total_value_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_valor_total' do 'OrderSerializer'.
    Deve retornar uma exceção quando o valor total é menor que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=False) for _ in range(10)]:
        with pytest.raises(serializers.ValidationError):
            OrderSerializer().validate_valor_total(n)


def test_empty_city():
    """
    Valida o método 'validate_cidade' do 'OrderSerializer'.
    Deve retornar uma exceção quando cidade for vazia.
    """

    with pytest.raises(serializers.ValidationError):
        assert OrderSerializer().validate_cidade("")
        assert OrderSerializer().validate_cidade("  ")


def test_non_empty_city(faker: Faker):
    """
    Valida o método 'validate_cidade' do 'OrderSerializer'.
    Deve retornar 'True' quando a cidade tiver algum valor.
    """

    for _ in range(10):
        city = faker.city()
        assert OrderSerializer().validate_cidade(city)


def test_empty_state():
    """
    Valida o método 'validate_estado' do 'OrderSerializer'.
    Deve retornar uma exceção quando o estado estiver vazio.
    """

    with pytest.raises(serializers.ValidationError):
        assert OrderSerializer().validate_estado("")
        assert OrderSerializer().validate_estado("  ")


def test_non_empty_payment_method(faker: Faker):
    """
    Valida o método 'validate_metodo_pagamento' do 'OrderSerializer'.
    Deve retornar 'True' quando o estado tiver algum valor.
    """

    for _ in range(10):
        word = faker.word()
        assert OrderSerializer().validate_metodo_pagamento(word)


def test_empty_payment_method():
    """
    Valida o método 'validate_metodo_pagamento' do 'OrderSerializer'.
    Deve retornar 'True' quando o bairro tiver algum valor.
    """

    with pytest.raises(serializers.ValidationError):
        assert OrderSerializer().validate_metodo_pagamento("")
        assert OrderSerializer().validate_metodo_pagamento("  ")