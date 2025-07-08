"""Testes para o model 'Personalizacao'."""

import pytest
from django.db import IntegrityError
from app.models import Produto, Cor, Personalizacao # pylint: disable=import-error


@pytest.mark.django_db
def test_valid_customization_creation():
    """Testa a criação de uma personalização, linkando-a a uma cor e produto existentes.
    Deve existir no banco de dados após a criação."""

    product = Produto.objects.create(
        titulo="Produto Teste",
        descricao="Descrição do produto teste.",
        preco=100.0,
        quantidade=10,
        categoria="Categoria Teste",
        material="Material Teste",
        cor_padrao="Cor Padrão Teste",
        altura=20.0,
        comprimento=30.0,
        largura=40.0
    )

    color = Cor.objects.create(nome="Azul", rgb="0, 0, 255")

    customization = Personalizacao.objects.create(
        id_cor=color,
        id_produto=product
    )

    assert customization.pk is not None
    assert Personalizacao.objects.filter(pk=customization.pk).exists()


@pytest.mark.django_db
def test_customization_creation_without_linking_existent_objs():
    """Testa a criação de uma personalização sem vincular a cor e produto existentes.
    Deve retornar um erro de integridade."""

    with pytest.raises(IntegrityError):
        Personalizacao.objects.create(
            id_cor=None,
            id_produto=None
        )
