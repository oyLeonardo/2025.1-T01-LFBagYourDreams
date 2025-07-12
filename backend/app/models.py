"""Modelos do banco de dados usados pelo aplicativo Django."""

from django.db import models

class Carrinho(models.Model):   # pylint: disable=too-few-public-methods
    """Representa o carrinho de compras de um usuário."""
    id = models.BigAutoField(primary_key=True)
    subtotal = models.FloatField()

    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'carrinho'
        managed = False


    def __str__(self):
        return f'Subtotal: {self.subtotal}'


class Cor(models.Model):    # pylint: disable=too-few-public-methods
    """Representa uma cor disponível para personalização de produtos."""
    id = models.BigAutoField(primary_key=True)
    nome = models.TextField()
    rgb = models.TextField(blank=True, null=True)

    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'cor'
        managed = False


    def __str__(self):
        return str(self.nome)


class Personalizacao(models.Model): # pylint: disable=too-few-public-methods
    """Relaciona produtos com cores personalizadas."""
    pk = models.CompositePrimaryKey('id_produto', 'id_cor')
    id_produto = models.ForeignKey('Produto', models.DO_NOTHING, db_column='id_produto')
    id_cor = models.ForeignKey(Cor, models.DO_NOTHING, db_column='id_cor')

    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'personalizacao'
        managed = False


class Produto(models.Model):    # pylint: disable=too-few-public-methods
    """Representa um produto disponível na loja."""

    id = models.BigAutoField(primary_key=True)
    preco = models.FloatField()
    quantidade = models.BigIntegerField()
    categoria = models.TextField()
    material = models.TextField()
    cor_padrao = models.TextField()
    titulo = models.TextField(blank=True, null=True)
    descricao = models.TextField(blank=True, null=True)
    altura = models.FloatField(blank=True, null=True)
    comprimento = models.FloatField(blank=True, null=True)
    largura = models.FloatField(blank=True, null=True)

    def __str__(self):
        return str(self.titulo or '')
    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'produto'
        managed = False


class ProdutoCarrinho(models.Model):    # pylint: disable=too-few-public-methods
    """Relaciona produtos com carrinhos de compra."""
    pk = models.CompositePrimaryKey('id_produto', 'id_carrinho')
    id_produto = models.ForeignKey(Produto, models.DO_NOTHING, db_column='id_produto')
    id_carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, db_column='id_carrinho')

    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'produto_carrinho'
        managed = False

class Pedido(models.Model):
    mercadopago_preference_id = models.CharField(max_length=255, blank=True, null=True)
    mercadopago_payment_id = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=50, default='pending') # Ex: pending, approved, rejected
    frete = models.FloatField(blank=True, null=True)
    valor_total = models.FloatField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    external_reference = models.CharField(max_length=255, unique=True, null=True, blank=True)

    def __str__(self):
        return f"Pedido {self.id} - Status: {self.status}"