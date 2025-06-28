from django.db import models

class Carrinho(models.Model):
    id = models.BigAutoField(primary_key=True)
    subtotal = models.FloatField()

    class Meta:
        managed = False
        db_table = 'Carrinho'


class Cor(models.Model):
    id = models.BigAutoField(primary_key=True)
    nome = models.TextField()
    rgb = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Cor'


class Personalizacao(models.Model):
    pk = models.CompositePrimaryKey('id_produto', 'id_cor')
    id_produto = models.ForeignKey('Produto', models.DO_NOTHING, db_column='id_produto')
    id_cor = models.ForeignKey(Cor, models.DO_NOTHING, db_column='id_cor')

    class Meta:
        managed = False
        db_table = 'Personalizacao'


class Produto(models.Model):
    id = models.BigAutoField(primary_key=True)
    preco = models.FloatField()
    quantidade = models.BigIntegerField()
    categoria = models.TextField()
    material = models.TextField()
    cor_padrao = models.TextField()

    class Meta:
        managed = False
        db_table = 'Produto'


class ProdutoCarrinho(models.Model):
    pk = models.CompositePrimaryKey('id_produto', 'id_carrinho')
    id_produto = models.ForeignKey(Produto, models.DO_NOTHING, db_column='id_produto')
    id_carrinho = models.ForeignKey(Carrinho, models.DO_NOTHING, db_column='id_carrinho')

    class Meta:
        managed = False
        db_table = 'Produto_Carrinho'
