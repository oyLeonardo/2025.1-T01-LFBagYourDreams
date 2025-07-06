"""Configuração do aplicativo Django 'app'."""

from django.apps import AppConfig


class PollsConfig(AppConfig):
    """Classe de configuração para o aplicativo 'app'."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'
