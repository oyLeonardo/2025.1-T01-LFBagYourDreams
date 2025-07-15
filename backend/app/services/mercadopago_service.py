import mercadopago
from django.conf import settings
import logging

class MercadoPagoService:

    def __init__(self):
        self.sdk = mercadopago.SDK(settings.MERCADOPAGO_ACCESS_TOKEN)

    def create_payment_preference(self, items, back_urls, external_reference=None):

        logger = logging.getLogger(__name__) 
        
        preference_data = {
            "items": items,
            "back_urls": back_urls,
            "auto_return": "all",
        }
        if external_reference:
            preference_data["external_reference"] = external_reference

        preference_response = self.sdk.preference().create(preference_data)

        logger.debug(f"Enviando dados para MP: {preference_data}") # Adicione esta linha
        preference_response = self.sdk.preference().create(preference_data)
        logger.debug(f"Resposta bruta do MP: {preference_response}") # E esta linha

        return preference_response
    

    def search_payment(self, payment_id):
        payment_response = self.sdk.payment().get(payment_id)
        return payment_response
