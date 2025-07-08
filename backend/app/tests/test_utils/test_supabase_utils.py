"""Testes para as funções utilitárias do supabase"""
from app.utils.supabase_utils import fetch_from_supabase, insert_to_supabase # pylint: disable=import-error


def test_fetch_from_supabase(mocker):
    """
    Testa o retorno da função 'test_fetch_from_supabase'.
    Retorna 'True' se a função retornar um dicionário de dados.
    """

    # Construindo  o mock de resposta
    res = mocker.Mock()
    res.status_code = 200
    res.json.return_value = {"data": [{"id": 1, "name": "Test"}]}

    # Mockando requests.get
    mocker.patch("app.utils.supabase_utils.requests.get", return_value=res)

    # Testando o comportamento esperado da função
    result = fetch_from_supabase("test_endpoint")

    assert "data" in result
    assert isinstance(result, dict)


def test_insert_to_supabase(mocker):
    """
    Testa o retorno da função 'test_insert_to_supabase'.
    Retorna 'True' se a função retornar um dicionário de dados.
    """

    # Construindo  o mock de resposta
    res = mocker.Mock()
    res.status_code = 201
    res.json.return_value = {"id": 1, "name": "Test"}

    # Mockando requests.post
    mocker.patch("app.utils.supabase_utils.requests.post", return_value=res)

    # Testando o comportamento esperado da função
    result = insert_to_supabase("test_endpoint", {"name": "Test"})

    assert "id" in result
    assert isinstance(result, dict)
