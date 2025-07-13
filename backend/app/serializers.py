"""Serializers para o app"""

from rest_framework import serializers
from . import models
from .models import Carrinho, Cor, Personalizacao, Produto, ProdutoCarrinho, Pedido
from .utils.supabase_utils import upload_file_object_to_supabase
import re

class CarrinhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Carrinho
        fields = '__all__'

class CorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cor
        fields = '__all__'

class PersonalizacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Personalizacao
        fields = '__all__'

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = '__all__'

class ProdutoCarrinhoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProdutoCarrinho
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    """Serializer para o modelo Pedido."""

    class Meta:
        """Metadados do OrderSerializer."""

        model = Pedido
        fields = [
            'id', 'email_usuario', 'codigo_carrinho', 'cep', 'bairro',
            'estado', 'cidade', 'numero', 'metodo_pagamento', 'frete',
            'valor_total', 'status'
        ]

        read_only_fields = ['id']

    def validate_cep(self, value):
        """O cep tem exatamente 8 dígitos e 1 hífen"""
        if not re.fullmatch(r'^\d{5}-\d{3}$', value):
            raise serializers.ValidationError("O CEP deve estar no formato XXXXX-XXX.")
        return value

    def validate_email_usuario(self, value):
        """Valida o email do usuário"""
        if "@" not in value or "." not in value.split("@")[-1]:
            raise serializers.ValidationError("O email deve ser válido.")
        return value

    def validate_codigo_carrinho(self, value):
        """Valida que o código do carrinho não seja nulo"""
        if value is None:
            raise serializers.ValidationError("O código do carrinho não pode ser nulo.")
        return value

    def validate_bairro(self, value):
        """Valida que o bairro não seja vazio"""
        if not isinstance(value, str):
            raise serializers.ValidationError("O bairro precisa ser texto.")

        if not value.strip():
            raise serializers.ValidationError("O bairro não pode ser vazio.")
        return value

    def validate_estado(self, value):
        """Valida que o estado não seja vazio"""
        if not isinstance(value, str):
            raise serializers.ValidationError("O estado precisa ser texto.")

        if not value.strip():
            raise serializers.ValidationError("O estado não pode ser vazio.")
        return value

    def validate_cidade(self, value):
        """Valida que a cidade não seja vazia"""
        if not isinstance(value, str):
            raise serializers.ValidationError("A cidade precisa ser texto.")

        if not value.strip():
            raise serializers.ValidationError("A cidade não pode ser vazia.")
        return value

    def validade_numero(self, value):
        """Valida que o número não seja vazio"""
        if not isinstance(value, str):
            raise serializers.ValidationError("O número precisa ser texto.")

        if not value.strip():
            raise serializers.ValidationError("O número não pode ser vazio.")
        return value

    def validate_metodo_pagamento(self, value):
        """Valida que método de pagamento não seja vazio."""
        if not isinstance(value, str):
            raise serializers.ValidationError("O método de pagamento precisa ser texto.")

        if not value.strip():
            raise serializers.ValidationError("O método de pagamento não pode ser vazio.")
        return value

    def validate_frete(self, value):
        """Valida que o frete seja um valor positivo ou zero."""

        if not isinstance(value, float):
            raise serializers.ValidationError("O frete deve ser um número.")

        if value < 0:
            raise serializers.ValidationError("O frete não pode ser negativo.")
        return value

    def validate_valor_total(self, value):
        """Valida que o valor total seja um valor positivo ou zero."""

        if not isinstance(value, float):
            raise serializers.ValidationError("O valor total deve ser um número.")

        if value < 0:
            raise serializers.ValidationError("O valor total não pode ser negativo.")
        return value


"""Serializers para o app de produtos."""

class ProdutoImagemSerializer(serializers.ModelSerializer):
    """Serializer para imagem"""
    imagem = serializers.ImageField(write_only=True)
    url = serializers.URLField(read_only=True)

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProdutoImagemSerializer."""
        model = models.ProdutoImagem
        fields = ['id', 'produto', 'imagem', 'url', 'criado_em']
        read_only_fields = ['id', 'url', 'criado_em']

    def create(self, validated_data):
        imagem_file = validated_data.pop("imagem")
        url = upload_file_object_to_supabase(imagem_file, imagem_file.content_type)
        if not url:
            raise serializers.ValidationError("Erro ao fazer upload da imagem para o Supabase.")
        return models.ProdutoImagem.objects.create(url=url, **validated_data)

class ProductListSerializer(serializers.ModelSerializer):
    """Serializer para listar e criar produtos (com imagens)."""
    imagens = ProdutoImagemSerializer(many=True, required=False)
    # required=False para não ser obrigatório na criação

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProductListSerializer."""
        model = models.Produto
        fields = [
            'id', 'titulo', 'descricao', 'categoria', 'preco',
            'quantidade', 'material', 'cor_padrao', 'altura',
            'comprimento', 'largura', 'imagens' # Inclua 'imagens' aqui
        ]

    def create(self, validated_data):
        imagens_data = validated_data.pop('imagens', [])
        produto = models.Produto.objects.create(**validated_data)
        for imagem in imagens_data:
            models.ProdutoImagem.objects.create(produto=produto, **imagem)
        return produto

    def update(self, instance, validated_data):
        imagens_data = validated_data.pop('imagens', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if imagens_data is not None:
            # Remove imagens que não estão mais na lista (se tiver id)
            current_image_ids = [img.id for img in instance.imagens.all()]
            incoming_image_ids = [img.get('id') for img in imagens_data if img.get('id')
                                  is not None]

            # Deleta as imagens antigas que não foram enviadas na requisição de atualização
            models.ProdutoImagem.objects.filter(
                produto=instance,
                id__in=[id for id in current_image_ids if id not in incoming_image_ids]
            ).delete()

            for img_data in imagens_data:
                img_id = img_data.get('id')
                if img_id is not None:
                    # Tenta atualizar uma imagem existente
                    try:
                        img = models.ProdutoImagem.objects.get(id=img_id, produto=instance)
                        img.url = img_data.get('url', img.url) # Atualiza URL se fornecida
                        img.save()
                    except models.ProdutoImagem.DoesNotExist:
                        # Se o ID for fornecido mas a imagem não existir para este produto
                        # cria uma nova
                        models.ProdutoImagem.objects.create(produto=instance, **img_data)
                else:
                    # Cria uma nova imagem se não tiver ID
                    models.ProdutoImagem.objects.create(produto=instance, **img_data)
        return instance

    def validate_categoria(self, value):
        """Valida que a categoria esteja entre as possíveis do front-end"""
        categorias_validas = ['infantil', 'masculino', 'feminino', 'termicas']

        if value not in categorias_validas:
            raise serializers.ValidationError(
                "A categoria deve ser: feminino, masculino, infantil, termicas")
        return value

    def validate_quantidade(self, value):
        """Valida que a quantidade seja um inteiro positivo."""
        if not isinstance(value, int):
            raise serializers.ValidationError("A quantidade deve ser um número inteiro.")

        if value < 0:
            raise serializers.ValidationError("A quantidade não pode ser negativa.")

        return value

    def validate_preco(self, value):
        """Valida que o preço seja um número maior que 0."""
        if not isinstance(value, float):
            raise serializers.ValidationError("O preço deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que 0.")

        return value

    def validate_altura(self, value):
        """Valida que a altura seja um número maior que 0."""

        if not isinstance(value, float):
            raise serializers.ValidationError("A altura deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("A altura deve ser maior que 0.")

        return value

    def validate_largura(self, value):
        """Valida que a largura seja um número maior que 0."""

        if not isinstance(value, float):
            raise serializers.ValidationError("A altura deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("A largura deve ser maior que 0.")

        return value

    def validate_comprimento(self, value):
        """Valida que o comprimento seja um número maior que 0."""

        if not isinstance(value, float):
            raise serializers.ValidationError("O comprimento deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("O comprimento deve ser maior que 0.")

        return value


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer para detalhes de um produto (com imagens)."""
    imagens = ProdutoImagemSerializer(many=True, required=False)

    class Meta: # pylint: disable=too-few-public-methods
        """Metainformações do ProductDetailSerializer."""
        model = models.Produto
        fields = [
            'id', 'titulo', 'descricao', 'categoria', 'preco',
            'quantidade', 'material', 'cor_padrao', 'altura',
            'comprimento', 'largura', 'imagens'
        ]

    def create(self, validated_data):
        imagens_data = validated_data.pop('imagens', [])
        produto = models.Produto.objects.create(**validated_data)
        for imagem in imagens_data:
            models.ProdutoImagem.objects.create(produto=produto, **imagem)
        return produto

    def update(self, instance, validated_data):
        imagens_data = validated_data.pop('imagens', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if imagens_data is not None:
            current_image_ids = [img.id for img in instance.imagens.all()]
            incoming_image_ids = [img.get('id') for img in imagens_data if img.get('id')
                                  is not None]

            models.ProdutoImagem.objects.filter(
                produto=instance,
                id__in=[id for id in current_image_ids if id not in incoming_image_ids]
            ).delete()

            for img_data in imagens_data:
                img_id = img_data.get('id')
                if img_id is not None:
                    try:
                        img = models.ProdutoImagem.objects.get(id=img_id, produto=instance)
                        img.url = img_data.get('url', img.url)
                        img.save()
                    except models.ProdutoImagem.DoesNotExist:
                        models.ProdutoImagem.objects.create(produto=instance, **img_data)
                else:
                    models.ProdutoImagem.objects.create(produto=instance, **img_data)
        return instance

    def validate_categoria(self, value):
        """Valida que a categoria esteja entre as possíveis do front-end"""

        categorias_validas = ['infantil', 'masculino', 'feminino', 'termicas']

        if value not in categorias_validas:
            raise serializers.ValidationError(
                "A categoria deve ser: feminino, masculino, infantil, termicas")
        return value

    def validate_quantidade(self, value):
        """Valida que a quantidade seja um inteiro positivo."""
        if not isinstance(value, int):
            raise serializers.ValidationError("A quantidade deve ser um número inteiro.")

        if value < 0:
            raise serializers.ValidationError("A quantidade não pode ser negativa.")

        return value

    def validate_preco(self, value):
        """Valida que o preço seja um número maior que 0."""
        if not isinstance(value, float):
            raise serializers.ValidationError("O preço deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que 0.")

        return value

    def validate_altura(self, value):
        """Valida que a altura seja um número maior que 0."""

        if not isinstance(value, float):
            raise serializers.ValidationError("A altura deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("A altura deve ser maior que 0.")

        return value

    def validate_largura(self, value):
        """Valida que a largura seja um número maior que 0."""

        if not isinstance(value, float):
            raise serializers.ValidationError("A altura deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("A largura deve ser maior que 0.")

        return value

    def validate_comprimento(self, value):
        """Valida que o comprimento seja um número maior que 0."""

        if not isinstance(value, float):
            raise serializers.ValidationError("O comprimento deve ser um número.")

        if value <= 0:
            raise serializers.ValidationError("O comprimento deve ser maior que 0.")

        return value