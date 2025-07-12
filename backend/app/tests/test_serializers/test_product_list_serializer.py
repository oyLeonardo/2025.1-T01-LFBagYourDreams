"""Testes para o serializador 'ProductListSerializer'."""

import pytest
from rest_framework import serializers
from app.serializers import ProductListSerializer # pylint: disable=import-error
from faker import Faker


def test_quantity_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_quantidade' do 'ProductListSerializer'.
    Deve retornar 'True' quando a quantidade é maior que zero.
    """

    for n in [faker.random_int(min=1, max=10**5) for _ in range(10)]:
        assert ProductListSerializer().validate_quantidade(n)


def test_quantity_equal_to_zero():
    """
    Valida o método 'validate_quantidade' do 'ProductListSerializer'.
    Deve retornar 'True' quando a quantidade é igual a zero.
    """

    assert ProductListSerializer().validate_quantidade(0) == 0


def test_quantity_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_quantidade' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a quantidade é menor que zero.
    """

    for n in [faker.random_int(min=-10**5, max=-1) for _ in range(10)]:
        with pytest.raises(serializers.ValidationError):
            ProductListSerializer().validate_quantidade(n)


def test_price_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_preco' do 'ProductListSerializer'.
    Deve retornar 'True' quando o preço é maior que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_preco(n)


def test_price_equal_to_zero():
    """
    Valida o método 'validate_preco' do 'ProductListSerializer'.
    Deve retornar uma exceção quando o preço é igual a zero.
    """

    with pytest.raises(serializers.ValidationError):
        ProductListSerializer().validate_preco(0)


def test_price_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_preco' do 'ProductListSerializer'.
    Deve retornar uma exceção quando o preço é menor que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=False) for _ in range(10)]:
        with pytest.raises(serializers.ValidationError):
            ProductListSerializer().validate_preco(n)


def test_height_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_altura' do 'ProductListSerializer'.
    Deve retornar 'True' quando a altura é maior que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_altura(n)


def test_height_equal_to_zero():
    """
    Valida o método 'validate_altura' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a altura é igual a zero.
    """

    with pytest.raises(serializers.ValidationError):
        ProductListSerializer().validate_altura(0)


def test_height_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_altura' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a altura é menor que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_altura(n)


def test_width_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_largura' do 'ProductListSerializer'.
    Deve retornar 'True' quando a largura é maior que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_largura(n)


def test_width_equal_to_zero():
    """
    Valida o método 'validate_largura' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a largura é igual a zero.
    """

    with pytest.raises(serializers.ValidationError):
        ProductListSerializer().validate_largura(0)


def test_width_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_largura' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a largura é menor que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_largura(n)


def test_length_greater_than_zero(faker: Faker):
    """
    Valida o método 'validate_comprimento' do 'ProductListSerializer'.
    Deve retornar 'True' quando a comprimento é maior que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_comprimento(n)


def test_length_equal_to_zero():
    """
    Valida o método 'validate_comprimento' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a comprimento é igual a zero.
    """

    with pytest.raises(serializers.ValidationError):
        ProductListSerializer().validate_comprimento(0)


def test_length_less_than_zero(faker: Faker):
    """
    Valida o método 'validate_comprimento' do 'ProductListSerializer'.
    Deve retornar uma exceção quando a comprimento é menor que zero.
    """

    for n in [faker.pyfloat(left_digits=3, right_digits=2, positive=True) for _ in range(10)]:
        assert ProductListSerializer().validate_comprimento(n)
