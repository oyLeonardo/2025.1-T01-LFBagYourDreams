"""Configuração do aplicativo Django 'app'."""

from django.apps import AppConfig


class MyappConfig(AppConfig):
    """Configuração do aplicativo 'app'."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
