from django.urls import path
from . import views

urlpatterns = [
    path('pagamento/criar/', views.CreatePedidoView.as_view(), name='criar_pagamento'),
    path('pagamento/sucesso/', views.PaymentSuccessView.as_view(), name='pagamento_sucesso'),
    path('pagamento/pendente/', views.PendingPaymentView.as_view(), name='pagamento_pendente'),
    path('pagamento/falha/', views.PaymentFailureView.as_view(), name='pagamento_falha'),
    path('pagamento/webhook/', views.mercadopago_webhook, name='mercadopago_webhook'),
]
