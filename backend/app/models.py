"""Modelos do banco de dados usados pelo aplicativo Django."""

from types import CellType
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
        return f'{self.id}'


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


class ProdutoImagem(models.Model):
    """Classe que guarda a url das imagnes dos produtos"""

    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name='imagens'
    )
    # TROCAMOS URLField POR ImageField
    # O 'upload_to' define a subpasta dentro do AWS_LOCATION ('media/')
    url = models.URLField(default='https://tixunpfronrbfeswufuv.supabase.co/storage/v1/object/public/imagens-produtos/media/produtos/0a5dc12e-0203-4c98-bf56-3f0671e14902.jpg?')
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'produto_imagem'
        managed = True # Correto, pois queremos que o Django gerencie esta tabela

    def __str__(self):
        return f"Imagem do produto {self.produto.titulo}" # pylint: disable=no-member

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
    """Representa um pedido realizado por um usuário."""

    email_usuario = models.TextField(max_length=255, blank=True, null=True)

    codigo_carrinho = models.ForeignKey(
        Carrinho,
        models.DO_NOTHING,
        db_column='codigo_carrinho_id'
    )

    cep = models.TextField(max_length=255, blank=True, null=True)
    bairro = models.TextField(max_length=255, blank=True, null=True)  # Corrigido de 'bairor'
    complemento = models.TextField(max_length=255, blank=True, null=True)
    estado = models.TextField(max_length=255, blank=True, null=True)
    cidade = models.TextField(max_length=255, blank=True, null=True)
    numero = models.TextField(max_length=255, blank=True, null=True)
    quadra = models.TextField(max_length=255, blank=True, null=True)

    metodo_pagamento = models.TextField(max_length=255, blank=True, null=True)
    mercadopago_payment_id = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=50, default='pending')  # Ex: pending, approved, rejected
    frete = models.FloatField(blank=True, null=True)
    valor_total = models.FloatField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    external_reference = models.CharField(max_length=255, unique=True, null=True, blank=True)

    def __str__(self):
        return f"Pedido {self.id} - Status: {self.status}"

    class Meta:
        db_table = 'pedido'
        managed = False  # Já que a tabela existe e é controlada externamente