from rest_framework import serializers
from . import models
from .models import Carrinho, Cor, Personalizacao, Produto, ProdutoCarrinho, Pedido
from .utils.supabase_utils import upload_file_object_to_supabase

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

class PedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pedido
        fields = '__all__'

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
        # Ajustado para as categorias no front-end
            raise serializers.ValidationError(
                "A categoria deve ser: feminino, masculino, infantil, termicas")
        return value

    def validate_quantidade(self, value):
        """Valida que a quantidade não seja negativa."""
        if value < 0: # Ajustado para '< 0' para permitir 0
            raise serializers.ValidationError("A quantidade não pode ser negativa.")
        return value

    def validate_preco(self, value):
        """Valida que o preço seja maior que zero."""
        if value <= 0:
            raise serializers.ValidationError("O preço deve ser maior que zero.")
        return value

    def validate_altura(self, value):
        """Valida que a altura não seja negativa."""
        if value is None or value <= 0: # Ajustado para '< 0' e considerar None
            raise serializers.ValidationError("A altura não pode ser negativa.")
        return value

    def validate_largura(self, value):
        """Valida que a largura não seja negativa."""
        if value is None or value <= 0: # Ajustado para '< 0' e considerar None
            raise serializers.ValidationError("A largura não pode ser negativa.")
        return value

    def validate_comprimento(self, value):
        """Valida que o comprimento não seja negativo."""
        if value is None or value <= 0: # Ajustado para '< 0' e considerar None
            raise serializers.ValidationError("O comprimento não pode ser negativo.")
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
        # Ajustado para as categorias no front-end
            raise serializers.ValidationError(
                "A categoria deve ser: feminino, masculino, infantil, termicas")
        return value

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
        if value is not None and value < 0:
            raise serializers.ValidationError("A altura não pode ser negativa.")
        return value

    def validate_largura(self, value):
        """Valida que a largura não seja negativa."""
        if value is not None and value < 0:
            raise serializers.ValidationError("A largura não pode ser negativa.")
        return value

    def validate_comprimento(self, value):
        """Valida que o comprimento não seja negativo."""
        if value is not None and value < 0:
            raise serializers.ValidationError("O comprimento não pode ser negativo.")
        return value
