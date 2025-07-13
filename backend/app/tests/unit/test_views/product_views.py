import pytest
from django.urls import reverse
from app.serializers import ProductDetailSerializer
from app.models import Produto
from rest_framework.test import APIClient
from django.contrib.auth.models import User

@pytest.mark.django_db
def test_products_list_get(client, products):
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
def test_product_detail_get(client, products):
    """Testa a rota que entrega um único produto."""

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])
    response = client.get(url)

    serializer = ProductDetailSerializer(product)
    expected = serializer.data

    assert response.status_code == 200
    assert response.json() == expected


@pytest.mark.django_db
def test_product_detail_update(client, products):
    """Testa a rota para editar dados de um único produto."""

    user = User.objects.create_user(username="testuser", password="12345")
    client = APIClient()
    client.force_authenticate(user=user)

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    data_update = {
        "titulo": "Novo título do produto",
        "preco": product.preco + 10,
    }

    response = client.patch(url, data=data_update, format='json')
    product.refresh_from_db()

    assert response.status_code == 200
    assert product.titulo == data_update["titulo"]


@pytest.mark.django_db
def test_product_detail_delete(client, products):
    """Testa a rota para remover um item de produto."""

    user = User.objects.create_user(username="testuser", password="12345")
    client = APIClient()
    client.force_authenticate(user=user)

    product = products[0]
    url = reverse("detalhes_produto", args=[product.id])

    response = client.delete(url)

    assert response.status_code == 204

    with pytest.raises(Produto.DoesNotExist):
        Produto.objects.get(id=product.id)