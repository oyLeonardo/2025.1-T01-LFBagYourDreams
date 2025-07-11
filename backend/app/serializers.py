from rest_framework import serializers
from .models import Carrinho, Cor, Personalizacao, Produto, ProdutoCarrinho, Pedido

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