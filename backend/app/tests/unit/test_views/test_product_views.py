import pytest
from django.urls import reverse
from app.serializers import ProductDetailSerializer
from app.models import Produto
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_products_list_get_non_authenticated_user(client, products):
    """Testa a rota que entrega a lista de produtos."""

    url = reverse("lista_produtos")
    response = client.get(url)

    serializer = ProductDetailSerializer(products, many=True)
    expected = serializer.data

    # Garantindo a ordem nas listas
    response_data_sorted = sorted(response.json(), key=lambda x: x['id'])
    expected_sorted = sorted(expected, key=lambda x: x['id'])

    assert response.status_code == 200
    assert response_data_sorted == expected_sorted


@pytest.mark.django_db
def test_product_detail_get_with_non_authenticated_user(client, products):
    """Testa a rota que entrega um único produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])
    response = client.get(url)

    serializer = ProductDetailSerializer(product)
    expected = serializer.data

    assert response.status_code == 200
    assert response.json() == expected


@pytest.mark.django_db
def test_product_detail_update_with_non_authenticated_client(client, products):
    """Testa a rota para editar dados de um único produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    data_update = {
        "titulo": "Novo título do produto",
        "preco": product.preco + 10,
    }

    response = client.patch(url, data=data_update, format='json')
    product.refresh_from_db()

    assert response.status_code == 401


@pytest.mark.django_db
def test_product_detail_update_with_common_client(common_client, products):
    """Testa a rota para editar dados de um único produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    data_update = {
        "titulo": "Novo título do produto",
        "preco": product.preco + 10,
    }

    response = common_client.patch(url, data=data_update, format='json')
    product.refresh_from_db()

    assert response.status_code == 200
    assert product.titulo == data_update['titulo']


@pytest.mark.django_db
def test_product_detail_update_with_staff_client(staff_client, products):
    """Testa a rota para editar dados de um único produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    data_update = {
        "titulo": "Novo título do produto",
        "preco": product.preco + 10,
    }

    response = staff_client.patch(url, data=data_update, format='json')
    product.refresh_from_db()

    assert response.status_code == 200
    assert product.titulo == data_update['titulo']


@pytest.mark.django_db
def test_product_detail_delete_with_non_authenticated_client(client, products):
    """Testa a rota para remover um item de produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    response = client.delete(url)

    assert response.status_code == 401


@pytest.mark.django_db
def test_product_detail_delete_with_common_client(common_client, products):
    """Testa a rota para remover um item de produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    response = common_client.delete(url)

    assert response.status_code == 204

    with pytest.raises(Produto.DoesNotExist):
        Produto.objects.get(id=product.id)


@pytest.mark.django_db
def test_product_detail_delete_with_staff_client(staff_client, products):
    """Testa a rota para remover um item de produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    response = staff_client.delete(url)

    assert response.status_code == 204

    with pytest.raises(Produto.DoesNotExist):
        Produto.objects.get(id=product.id)