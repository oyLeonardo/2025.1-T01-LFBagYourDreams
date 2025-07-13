import pytest
from django.urls import reverse
from app.serializers import OrderSerializer
from app.models import Pedido

@pytest.mark.django_db
def test_order_list_get_with_non_authenticated_client(client, orders):
    """Testa a rota que entrega a lista de pedidos."""

    url = reverse("lista_pedidos")
    response = client.get(url)

    assert response.status_code == 401


@pytest.mark.django_db
def test_order_list_get_with_common_client(common_client, orders):
    """Testa a rota que entrega a lista de pedidos."""

    url = reverse("lista_pedidos")
    response = common_client.get(url)

    serializer = OrderSerializer(orders, many=True)
    expected = serializer.data

    # Garantindo a ordem nas listas
    response_data_sorted = sorted(response.json(), key=lambda x: x['id'])
    expected_sorted = sorted(expected, key=lambda x: x['id'])

    assert response.status_code == 200
    assert response_data_sorted == expected_sorted


@pytest.mark.django_db
def test_order_list_get_with_staff_client(staff_client, orders):
    """Testa a rota que entrega a lista de pedidos."""

    url = reverse("lista_pedidos")
    response = staff_client.get(url)

    serializer = OrderSerializer(orders, many=True)
    expected = serializer.data

    # Garantindo a ordem nas listas
    response_data_sorted = sorted(response.json(), key=lambda x: x['id'])
    expected_sorted = sorted(expected, key=lambda x: x['id'])

    assert response.status_code == 200
    assert response_data_sorted == expected_sorted


@pytest.mark.django_db
def test_order_detail_get_with_non_authenticated_client(client, orders):
    """Testa a rota que entrega um único pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])
    response = client.get(url)

    assert response.status_code == 401


@pytest.mark.django_db
def test_order_detail_get_with_common_client(common_client, orders):
    """Testa a rota que entrega um único pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])
    response = common_client.get(url)

    serializer = OrderSerializer(order)
    expected = serializer.data

    assert response.status_code == 200
    assert response.json() == expected


@pytest.mark.django_db
def test_order_detail_get_with_staff_client(staff_client, orders):
    """Testa a rota que entrega um único pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])
    response = staff_client.get(url)

    serializer = OrderSerializer(order)
    expected = serializer.data

    assert response.status_code == 200
    assert response.json() == expected


@pytest.mark.django_db
def test_order_detail_update_with_non_authenticated_client(client, orders):
    """Testa a rota para editar dados de um único pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])

    data_update = {
        "cep": "10104-506",
        "bairro": "Setor Central",
    }

    response = client.patch(url, data=data_update, format='json')

    assert response.status_code == 401


@pytest.mark.django_db
def test_order_detail_update_with_common_client(common_client, orders):
    """Testa a rota para editar dados de um único pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])

    data_update = {
        "cep": "10104-506",
        "bairro": "Setor Central",
    }

    response = common_client.patch(url, data=data_update, format='json')
    order.refresh_from_db()

    assert response.status_code == 200
    assert order.cep == data_update["cep"]


@pytest.mark.django_db
def test_order_detail_update_with_staff_client(staff_client, orders):
    """Testa a rota para editar dados de um único pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])

    data_update = {
        "cep": "10104-506",
        "bairro": "Setor Central",
    }

    response = staff_client.patch(url, data=data_update, format='json')
    order.refresh_from_db()

    assert response.status_code == 200
    assert order.cep == data_update["cep"]


@pytest.mark.django_db
def test_product_detail_delete_with_non_authenticated_client(client, orders):
    """Testa a rota para remover um item de pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])

    response = client.delete(url)

    assert response.status_code == 401


@pytest.mark.django_db
def test_product_detail_delete_with_common_client(common_client, orders):
    """Testa a rota para remover um item de pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])

    response = common_client.delete(url)

    assert response.status_code == 204

    with pytest.raises(Pedido.DoesNotExist):
        Pedido.objects.get(id=order.id)


@pytest.mark.django_db
def test_product_detail_delete_with_staff_client(staff_client, orders):
    """Testa a rota para remover um item de pedido."""

    order = orders[0]
    url = reverse("detalhes_pedido", args=[order.id])

    response = staff_client.delete(url)

    assert response.status_code == 204

    with pytest.raises(Pedido.DoesNotExist):
        Pedido.objects.get(id=order.id)