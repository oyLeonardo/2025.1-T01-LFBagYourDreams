"""Arquivo de configuração do pytest para o ambiente Django."""

import pytest
from django.apps import apps
from faker import Faker
from app.models import Carrinho, Cor, Pedido, Produto

@pytest.fixture(autouse=True, scope="session")
def django_test_environment(django_test_environment): # pylint: disable=unused-argument, redefined-outer-name
    """Fixture que ativa o modo de gerenciamento de modelos para testes."""

    for m in [m for m in apps.get_models() if not m._meta.managed]: # pylint: disable=protected-access
        m._meta.managed = True # pylint: disable=protected-access


@pytest.fixture(autouse=True, scope="session")
def faker():
    """Fixture que fornece uma instância do Faker para geração de dados falsos."""

    yield Faker('pt_BR')


@pytest.fixture
def products(db):
    yield [
        Produto.objects.create(
            preco=149.90,
            quantidade=10,
            categoria="Camisetas",
            material="Algodão",
            cor_padrao="Preto",
            titulo="Camiseta Básica Preta",
            descricao="Camiseta de algodão confortável, ideal para o dia a dia.",
            altura=2.0,
            comprimento=70.0,
            largura=50.0
        ),
        Produto.objects.create(
            preco=349.90,
            quantidade=5,
            categoria="Calçados",
            material="Couro sintético",
            cor_padrao="Branco",
            titulo="Tênis Esportivo Branco",
            descricao="Tênis leve e resistente, ideal para corrida.",
            altura=12.0,
            comprimento=30.0,
            largura=10.0
        ),
        Produto.objects.create(
            preco=89.90,
            quantidade=20,
            categoria="Acessórios",
            material="Poliéster",
            cor_padrao="Azul",
            titulo="Boné Azul Marinho",
            descricao="Boné casual com regulagem traseira.",
            altura=10.0,
            comprimento=20.0,
            largura=18.0
        ),
    ]


@pytest.fixture
def colors(db):
    yield [
        Cor.objects.create(
            nome='SlateBlue',
            rgb='#6A5ACD',
        ),
        Cor.objects.create(
            nome='DodgerBlue',
            rgb='#1E90FF',
        ),
        Cor.objects.create(
            nome='LightGreen',
            rgb='#90EE90',
        ),
    ]


@pytest.fixture
def carts(db):
    yield [
        Carrinho.objects.create(subtotal=149.90),
        Carrinho.objects.create(subtotal=349.90),
        Carrinho.objects.create(subtotal=89.90),
    ]


@pytest.fixture
def orders(db):

    yield [
        Pedido.objects.create(
            email_usuario="cliente1@example.com",
            codigo_carrinho='1',
            cep="01310-200",
            bairro="Bela Vista",
            complemento="Apto 101",
            estado="SP",
            cidade="São Paulo",
            numero="123",
            quadra="Q1",
            metodo_pagamento="Pix",
            mercadopago_payment_id="mp-001",
            status="approved",
            frete=12.50,
            valor_total=199.90,
            external_reference="REF001"
        ),
        Pedido.objects.create(
            email_usuario="cliente2@example.com",
            codigo_carrinho='1',
            cep="30140-000",
            bairro="Savassi",
            complemento="Sala 12",
            estado="MG",
            cidade="Belo Horizonte",
            numero="456",
            quadra="Q3",
            metodo_pagamento="Cartão de crédito",
            mercadopago_payment_id="mp-002",
            status="pending",
            frete=18.90,
            valor_total=329.90,
            external_reference="REF002"
        ),
        Pedido.objects.create(
            email_usuario="cliente3@example.com",
            codigo_carrinho='1',
            cep="70070-350",
            bairro="Asa Norte",
            complemento="Bloco B",
            estado="DF",
            cidade="Brasília",
            numero="789",
            quadra="Q5",
            metodo_pagamento="Dinheiro",
            mercadopago_payment_id="mp-003",
            status="rejected",
            frete=0.00,
            valor_total=89.90,
            external_reference="REF003"
        )
    ]