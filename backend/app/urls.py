"""documento com as urls das apis"""

from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.ProductList.as_view()),
    path('product/<int:pk>/', views.ProductDetail.as_view()),
    path('image/', views.ImageUploadView.as_view(), name='upload_image'),
    path('pagamento/processar/', views.process_payment, name='criar_pagamento'),
    path('pagamento/webhook/', views.mercadopago_webhook, name='mercadopago_webhook'),
    path('public-key/', views.get_public_key, name='get_public_key')
]
