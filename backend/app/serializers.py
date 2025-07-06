"""Serializers para o app de produtos."""

from rest_framework import serializers
from . import models


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para listar produtos."""

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProductListSerializer."""
        model = models.Produto
        fields = [
            'id', 'titulo', 'descricao', 'categoria', 'preco',
            'quantidade', 'material', 'cor_padrao', 'altura',
            'comprimento', 'largura'
        ]
        depth = 1
    def validate_quantidade(self, value):
        """Valida que a quantidade não seja negativa."""
        if value  < 0:
            raise serializers.ValidationError("A quantidade não pode ser negativa.")
        return value

    def validate_preco(self, value):
        """Valida que o preço seja maior que zero."""
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_altura(self, value):
        """Valida que a altura não seja negativa."""
        if value <= 0:
            raise serializers.ValidationError("A altura não pode ser negativa.")
        return value

    def validate_largura(self, value):
        """Valida que a largura não seja negativa."""
        if value <= 0:
            raise serializers.ValidationError("A largura não pode ser negativa.")
        return value

    def validate_comprimento(self, value):
        """Valida que o comprimento não seja negativo."""
        if value <= 0:
            raise serializers.ValidationError("O comprimento não pode ser negativo.")
        return value


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhes de um produto."""

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProductDetailSerializer."""
        model = models.Produto
        fields = [
            'id', 'titulo', 'descricao', 'categoria', 'preco',
            'quantidade', 'material', 'cor_padrao', 'altura',
            'comprimento', 'largura'
        ]
        depth = 1
    def validate_quantidade(self, value):
        """Valida que a quantidade não seja negativa."""
        if value < 0:
            raise serializers.ValidationError("A quantidade não pode ser negativa.")
        return value

    def validate_preco(self, value):
        """Valida que o preço seja maior que zero."""
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_altura(self, value):
        """Valida que a altura não seja negativa."""
        if value <= 0:
            raise serializers.ValidationError("A altura não pode ser negativa.")
        return value

    def validate_largura(self, value):
        """Valida que a largura não seja negativa."""
        if value <= 0:
            raise serializers.ValidationError("A largura não pode ser negativa.")
        return value

    def validate_comprimento(self, value):
        """Valida que o comprimento não seja negativo."""
        if value <= 0:
            raise serializers.ValidationError("O comprimento não pode ser negativo.")
        return value
