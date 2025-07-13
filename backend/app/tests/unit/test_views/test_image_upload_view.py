import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_valid_image_upload_with_non_authenticated_client(client, products, img):

    product = products[0]

    data = {
        "produto": product.id,
        "imagem": img
    }

    url = reverse('upload_image')
    response = client.post(url, data, format='multipart')

    assert response.status_code == 401


@pytest.mark.django_db
def test_invalid_image_upload_with_non_authenticated_client(client, products):

    product = products[0]

    data = {
        "produto": product.id,
        "imagem": 123
    }

    url = reverse('upload_image')
    response = client.post(url, data, format='multipart')

    assert response.status_code == 401


@pytest.mark.django_db
def test_valid_image_upload_with_common_client(common_client, products, img):

    product = products[0]

    data = {
        "produto": product.id,
        "imagem": img
    }

    url = reverse('upload_image')
    response = common_client.post(url, data, format='multipart')

    assert response.status_code == 401


@pytest.mark.django_db
def test_invalid_image_upload_with_common_client(common_client, products):

    product = products[0]

    data = {
        "produto": product.id,
        "imagem": 123
    }

    url = reverse('upload_image')
    response = common_client.post(url, data, format='multipart')

    assert response.status_code == 401


@pytest.mark.django_db
def test_valid_image_upload_with_staff_client(staff_client, products, img):

    product = products[0]

    data = {
        "produto": product.id,
        "imagem": img
    }

    url = reverse('upload_image')
    response = staff_client.post(url, data, format='multipart')

    assert response.status_code == 201


@pytest.mark.django_db
def test_invalid_image_upload_with_staff_client(staff_client, products):

    product = products[0]

    data = {
        "produto": product.id,
        "imagem": 123
    }

    url = reverse('upload_image')
    response = staff_client.post(url, data, format='multipart')

    assert response.status_code == 400