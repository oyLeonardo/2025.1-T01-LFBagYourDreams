import React from 'react';

interface CreditCardFormProps {
  cardName: string;
  setCardName: (value: string) => void;
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvv: string;
  setCardCvv: (value: string) => void;
  errors: {
    cardName: string;
    cardNumber: string;
    cardExpiry: string;
    cardCvv: string;
  };
}

const CreditCardForm: React.FC<CreditCardFormProps> = ({
  cardName,
  setCardName,
  cardNumber,
  setCardNumber,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  errors
}) => {
  // Funções de formatação
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .substring(0, 19);
  };

  const formatCardExpiry = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .substring(0, 5);
  };

  const formatCardCvv = (value: string) => {
    return value.replace(/\D/g, '').substring(0, 4);
  };

  return (
    <div className="w-full rounded-lg border border-[#e0e8e0] bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#075336] mb-4">Detalhes do Cartão</h3>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="card-name" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Nome completo (como no cartão) *</label>
          <input
            type="text"
            id="card-name"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className={`w-full rounded-xl border ${errors.cardName ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="Nome completo"
            required
          />
          {errors.cardName && <p className="mt-1 text-red-500 text-sm">{errors.cardName}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="card-number" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Número do cartão *</label>
          <input
            type="text"
            id="card-number"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            className={`w-full rounded-xl border ${errors.cardNumber ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="0000 0000 0000 0000"
            required
          />
          {errors.cardNumber && <p className="mt-1 text-red-500 text-sm">{errors.cardNumber}</p>}
        </div>

        <div>
          <label htmlFor="card-expiry" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Validade *</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-[#5d7a6d]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              id="card-expiry"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
              className={`w-full rounded-xl border ${errors.cardExpiry ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 pl-10 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
              placeholder="MM/AA"
              required
            />
            {errors.cardExpiry && <p className="mt-1 text-red-500 text-sm">{errors.cardExpiry}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="card-cvv" className="mb-2 text-sm font-medium text-[#5d7a6d] flex items-center gap-1">
            CVV *
            <button type="button" className="text-[#5d7a6d] hover:text-[#075336]" title="Os 3 dígitos no verso do cartão">
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
              </svg>
            </button>
          </label>
          <input
            type="text"
            id="card-cvv"
            value={cardCvv}
            onChange={(e) => setCardCvv(formatCardCvv(e.target.value))}
            className={`w-full rounded-xl border ${errors.cardCvv ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="000"
            required
          />
          {errors.cardCvv && <p className="mt-1 text-red-500 text-sm">{errors.cardCvv}</p>}
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 mt-6">
        <img className="h-8" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="Visa" />
        <img className="h-8" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="Mastercard" />
        <img className="h-8" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/amex.svg" alt="American Express" />
      </div>
    </div>
  );
};

export default CreditCardForm;