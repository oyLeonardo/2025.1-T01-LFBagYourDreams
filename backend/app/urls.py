"""documento com as urls das apis"""

from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductList.as_view()),
    path('product/<int:pk>/', views.ProductDetail.as_view()),
    path('image/', views.ImageUploadView.as_view(), name='upload_image'),
    path('pagamento/criar/', views.CreatePedidoView.as_view(), name='criar_pagamento'),
    path('pagamento/sucesso/', views.PaymentSuccessView.as_view(), name='pagamento_sucesso'),
    path('pagamento/pendente/', views.PendingPaymentView.as_view(), name='pagamento_pendente'),
    path('pagamento/falha/', views.PaymentFailureView.as_view(), name='pagamento_falha'),
    path('pagamento/webhook/', views.mercadopago_webhook, name='mercadopago_webhook'),
    path('orders/', views.OrderList.as_view(), name='lista_pedidos'),
    path('order/<int:pk>/', views.OrderDetail.as_view()),
]
