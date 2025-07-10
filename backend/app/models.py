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

class ProdutoImagem(models.Model):
    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name='imagens'
    )
    # TROCAMOS URLField POR ImageField
    # O 'upload_to' define a subpasta dentro do AWS_LOCATION ('media/')
    url = models.URLField()
    criado_em = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'produto_imagem'
        managed = True # Correto, pois queremos que o Django gerencie esta tabela

    def __str__(self):
        return f"Imagem do produto {self.produto.titulo}"


class ProdutoCarrinho(models.Model):    # pylint: disable=too-few-public-methods
    """Relaciona produtos com carrinhos de compra."""
    pk = models.CompositePrimaryKey('id_produto', 'id_carrinho')
    id_produto = models.ForeignKey(Produto, models.DO_NOTHING, db_column='id_produto')
    id_carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, db_column='id_carrinho')

    class Meta: # pylint: disable=too-few-public-methods
        """Define que este modelo é apenas leitura (sem migrations)"""
        db_table = 'produto_carrinho'
        managed = False
