# pylint: skip-file
""" Migrations """

from django.db import migrations, models


class Migration(migrations.Migration):
    """ Classe de migration """
    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Carrinho',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('subtotal', models.FloatField()),
            ],
            options={
                'db_table': 'Carrinho',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Cor',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('nome', models.TextField()),
                ('rgb', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Cor',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Personalizacao',
            fields=[
                ('pk', models.CompositePrimaryKey('id_produto', 'id_cor',
                blank=True, editable=False, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'Personalizacao',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Produto',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('preco', models.FloatField()),
                ('quantidade', models.BigIntegerField()),
                ('categoria', models.TextField()),
                ('material', models.TextField()),
                ('cor_padrao', models.TextField()),
            ],
            options={
                'db_table': 'Produto',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='ProdutoCarrinho',
            fields=[
                ('pk', models.CompositePrimaryKey('id_produto', 'id_carrinho',
                blank=True, editable=False, primary_key=True, serialize=False)),
            ],
            options={
                'db_table': 'Produto_Carrinho',
                'managed': False,
            },
        ),
    ]
