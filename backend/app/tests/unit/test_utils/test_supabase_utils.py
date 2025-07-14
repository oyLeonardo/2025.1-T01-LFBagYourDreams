"""Testes para as funções utilitárias do supabase"""
from unittest import mock
from app.utils.supabase_utils import fetch_from_supabase, insert_to_supabase


def test_fetch_from_supabase(mocker):
    """
    Testa o retorno da função 'test_fetch_from_supabase'.
    Retorna 'True' se a função retornar uma lista de dados.
    """

    mock_response = mocker.Mock()
    mock_response.data = [{"id": 1, "name": "Test"}]

    mock_execute = mocker.Mock(return_value=mock_response)

    mock_select = mocker.Mock()
    mock_select.execute = mock_execute

    mock_table = mocker.Mock()
    mock_table.select = mocker.Mock(return_value=mock_select)

    mocker.patch(
        "app.utils.supabase_utils.supabase.table",
        return_value = mock_table
    )

    result = fetch_from_supabase("test_table")

    assert isinstance(result, list)
    assert result == mock_response.data


def test_insert_to_supabase(mocker):
    """
    Testa o retorno da função 'test_insert_to_supabase'.
    Retorna 'True' se a função retornar uma lista de dados.
    """

    mock_response = mocker.Mock()
    mock_response.data = [{"id": 1, "name": "Test"}]

    mock_execute = mocker.Mock(return_value=mock_response)

    mock_insert = mocker.Mock()
    mock_insert.execute = mock_execute

    mock_table = mocker.Mock()
    mock_table.insert = mocker.Mock(return_value=mock_insert)

    mocker.patch(
        "app.utils.supabase_utils.supabase.table",
        return_value = mock_table
    )

    result = insert_to_supabase("test_table", {"id": 1, "name": "Test"})

    assert isinstance(result, list)
    assert result == mock_response.data