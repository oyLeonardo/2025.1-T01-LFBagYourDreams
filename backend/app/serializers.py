"""Serializers para o app de produtos."""

from rest_framework import serializers
from . import models


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para listar produtos."""

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProductListSerializer."""
        model = models.Produto
        fields = [
            'id', 'titulo', 'categoria', 'descricao', 'preco',
            'material', 'cor_padrao', 'altura', 'comprimento',
            'largura', 'quantidade'
        ]
        depth = 1


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhes de um produto."""

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProductDetailSerializer."""
        model = models.Produto
        fields = [
            'id', 'titulo', 'categoria', 'descricao', 'preco',
            'material', 'cor_padrao', 'altura', 'comprimento',
            'largura', 'quantidade'
        ]
        depth = 1
