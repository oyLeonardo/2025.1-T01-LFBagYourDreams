import pytest
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

@pytest.mark.django_db
def test_token_pair_with_custom_claims_with_non_authenticated_client(client):

    url = reverse("token_obtain_pair")

    data = {
        "username": "testuser",
        "password": "12345",
    }

    response = client.post(url, data, format="json")

    assert response.status_code == 401

@pytest.mark.django_db
def test_token_pair_with_custom_claims_with_common_client(common_client):

    url = reverse("token_obtain_pair")
    credentials = {"username": "testuser", "password": "12345"}


    from rest_framework.test import APIClient
    client = APIClient()
    response = client.post(url, credentials, format="json")

    assert response.status_code == 200
    access_token = response.data["access"]
    decoded = AccessToken(access_token)

    assert decoded["is_staff"] is False
    assert decoded["is_superuser"] is False


@pytest.mark.django_db
def test_token_pair_with_custom_claims_with_staff_client(staff_client):

    url = reverse("token_obtain_pair")
    credentials = {"username": "staffuser", "password": "12345"}

    client = APIClient()
    response = client.post(url, credentials, format="json")

    assert response.status_code == 200
    access_token = response.data["access"]
    decoded = AccessToken(access_token)

    assert decoded["is_staff"] is True
    assert decoded["is_superuser"] is False