import pytest
from app.models import Cor


@pytest.mark.django_db
def test_valid_color_creation():
    """
    Testa a criação de uma cor com dados válidos.
    Deve existir no banco de dados após a criação.
    """

    color = Cor.objects.create(
        nome="Azul",
        rgb="0, 0, 255"
    )

    assert color.id is not None
    assert Cor.objects.filter(id=color.id).exists()


@pytest.mark.django_db
def test_color_str():
    """
    Testa o método __str__ do modelo Cor.
    Deve retornar o nome da cor.
    """

    color = Cor.objects.create(
        nome="Azul",
        rgb="0, 0, 255"
    )

    assert str(color) == "Azul"