import pytest
from django.apps import apps
from faker import Faker

@pytest.fixture(autouse=True, scope="session")
def django_test_environment(django_test_environment):
    """Fixture que ativa o modo de gerenciamento de modelos para testes."""

    for m in [m for m in apps.get_models() if not m._meta.managed]:
        m._meta.managed = True


@pytest.fixture(autouse=True, scope="session")
def faker():
    """Fixture que fornece uma instância do Faker para geração de dados falsos."""

    yield Faker('pt_BR')