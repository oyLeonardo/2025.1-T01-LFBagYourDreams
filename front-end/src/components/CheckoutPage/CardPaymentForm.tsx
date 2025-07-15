import React, { useEffect, forwardRef, useImperativeHandle } from 'react';

interface CardPaymentFormProps {
  mp: any; // MercadoPago instance
  transactionAmount: number;
  cardholderName: string;
  setCardholderName: (value: string) => void;
  identificationType: string;
  setIdentificationType: (value: string) => void;
  identificationNumber: string;
  setIdentificationNumber: (value: string) => void;
  installments: string;
  setInstallments: (value: string) => void;
  errors: {
    cardholderName: string;
    identificationType: string;
    identificationNumber: string;
    installments: string;
  };
  setErrors: React.Dispatch<React.SetStateAction<any>>; // To update errors in parent
}

const CardPaymentForm = forwardRef<any, CardPaymentFormProps>(({
  mp,
  transactionAmount,
  cardholderName,
  setCardholderName,
  identificationType,
  setIdentificationType,
  identificationNumber,
  setIdentificationNumber,
  installments,
  setInstallments,
  errors,
  setErrors,
}, ref) => {

  const paymentMethodIdRef = React.useRef<HTMLInputElement>(null); // Ref to store paymentMethodId

  // Expose createMPCardToken and getPaymentMethodId to parent component via ref
  useImperativeHandle(ref, () => ({
    createMPCardToken,
    getPaymentMethodId: () => paymentMethodIdRef.current?.value || '',
  }));

  useEffect(() => {
    if (!mp) return;
    console.log("transactionAmount dentro de CardPaymentForm useEffect:", transactionAmount);

    // Clear existing elements to prevent re-mounting issues if component re-renders
    const cardNumberContainer = document.getElementById('form-checkout__cardNumber');
    if (cardNumberContainer) cardNumberContainer.innerHTML = '';
    const expirationDateContainer = document.getElementById('form-checkout__expirationDate');
    if (expirationDateContainer) expirationDateContainer.innerHTML = '';
    const securityCodeContainer = document.getElementById('form-checkout__securityCode');
    if (securityCodeContainer) securityCodeContainer.innerHTML = '';

    const cardNumberElement = mp.fields.create('cardNumber', {
      placeholder: "Número do cartão"
    }).mount('form-checkout__cardNumber');

    const expirationDateElement = mp.fields.create('expirationDate', {
      placeholder: "MM/YY",
    }).mount('form-checkout__expirationDate');

    const securityCodeElement = mp.fields.create('securityCode', {
      placeholder: "Código de segurança"
    }).mount('form-checkout__securityCode');

    const issuerElement = document.getElementById('form-checkout__issuer') as HTMLSelectElement;
    const installmentsElement = document.getElementById('form-checkout__installments') as HTMLSelectElement;
    const identificationTypeElement = document.getElementById('form-checkout__identificationType') as HTMLSelectElement;
    const paymentMethodIdElement = paymentMethodIdRef.current; // Use the ref for the hidden input

    const issuerPlaceholder = "Banco emissor";
    const installmentsPlaceholder = "Parcelas";

    let currentBin: string | undefined;

    // Helper to create select options
    const createSelectOptions = (elem: HTMLSelectElement, options: any[], labelsAndKeys = { label: "name", value: "id" }) => {
      const { label, value } = labelsAndKeys;
      elem.options.length = 0; // Clear existing options

      const tempOptions = document.createDocumentFragment();
      const defaultOption = document.createElement('option');
      defaultOption.value = "";
      defaultOption.textContent = `Selecione ${elem.id.includes('issuer') ? 'o banco' : elem.id.includes('installments') ? 'as parcelas' : 'o tipo de documento'}`;
      defaultOption.setAttribute('disabled', 'true');
      defaultOption.setAttribute('selected', 'true');
      tempOptions.appendChild(defaultOption);

      options.forEach(option => {
        const optValue = option[value];
        const optLabel = option[label];
        const opt = document.createElement('option');
        opt.value = optValue;
        opt.textContent = optLabel;
        tempOptions.appendChild(opt);
      });
      elem.appendChild(tempOptions);
    };

    const clearHTMLSelectChildrenFrom = (element: HTMLSelectElement) => {
      const currOptions = [...element.children];
      currOptions.forEach(child => child.remove());
    };

    const createSelectElementPlaceholder = (element: HTMLSelectElement, placeholder: string) => {
      const optionElement = document.createElement('option');
      optionElement.textContent = placeholder;
      optionElement.setAttribute('selected', "");
      optionElement.setAttribute('disabled', "");
      element.appendChild(optionElement);
    };

    const clearSelectsAndSetPlaceholders = () => {
      clearHTMLSelectChildrenFrom(issuerElement);
      createSelectElementPlaceholder(issuerElement, issuerPlaceholder);

      clearHTMLSelectChildrenFrom(installmentsElement);
      createSelectElementPlaceholder(installmentsElement, installmentsPlaceholder);
    };

    const updatePCIFieldsSettings = (paymentMethod: any) => {
      const { settings } = paymentMethod;

      const cardNumberSettings = settings[0].card_number;
      cardNumberElement.update({
        settings: cardNumberSettings
      });

      const securityCodeSettings = settings[0].security_code;
      securityCodeElement.update({
        settings: securityCodeSettings
      });
    };

    const getIssuers = async (paymentMethod: any, bin: string) => {
      try {
        const { id: paymentMethodId } = paymentMethod;
        return await mp.getIssuers({ paymentMethodId, bin });
      } catch (e) {
        console.error('error getting issuers: ', e);
        return [];
      }
    };

    const updateIssuer = async (paymentMethod: any, bin: string) => {
      const { additional_info_needed, issuer } = paymentMethod;
      let issuerOptions = [issuer];

      if (additional_info_needed.includes('issuer_id')) {
        issuerOptions = await getIssuers(paymentMethod, bin);
      }
      createSelectOptions(issuerElement, issuerOptions);
    };

    const updateInstallments = async (paymentMethod: any, bin: string) => {
      try {
        const formattedAmount = transactionAmount.toFixed(2).toString();
        console.log("Valor formatado para getInstallments:", formattedAmount);
        const installmentsResponse = await mp.getInstallments({
          amount: formattedAmount,
          bin,
          payment_method_id: paymentMethod.id,
        });

        let installmentOptions = installmentsResponse[0]?.payer_costs || [];

        console.log("installmentsResponse:", installmentsResponse);
        console.log("payer_costs:", installmentOptions);

        // 🔷 fallback: se não vier nada do MP (valor baixo), coloca pelo menos 1x sem juros
        if (installmentOptions.length === 0) {
          installmentOptions = [{
            installments: 1,
            recommended_message: '1x sem juros',
          }];
        }

        const installmentOptionsKeys = { label: 'recommended_message', value: 'installments' };
        createSelectOptions(installmentsElement, installmentOptions, installmentOptionsKeys);
      } catch (error) {
        console.error('error getting installments: ', error);

        // fallback em caso de erro também
        createSelectOptions(installmentsElement, [{
          installments: 1,
          recommended_message: '1x sem juros',
        }], { label: 'recommended_message', value: 'installments' });
      }
    };

    cardNumberElement.on('binChange', async (data: any) => {
      const { bin } = data;
      try {
        if (!bin && paymentMethodIdElement?.value) {
          clearSelectsAndSetPlaceholders();
          if (paymentMethodIdElement) paymentMethodIdElement.value = "";
        }

        if (bin && bin !== currentBin) {
          const { results } = await mp.getPaymentMethods({ bin });
          const paymentMethod = results[0];

          if (paymentMethodIdElement) paymentMethodIdElement.value = paymentMethod.id;
          updatePCIFieldsSettings(paymentMethod);
          updateIssuer(paymentMethod, bin);
          updateInstallments(paymentMethod, bin);
        }
        currentBin = bin;
      } catch (e) {
        console.error('error getting payment methods: ', e);
      }
    });

    // Get identification types
    (async function getIdentificationTypes() {
      try {
        const identificationTypes = await mp.getIdentificationTypes();
        createSelectOptions(identificationTypeElement, identificationTypes);
      } catch (e) {
        console.error('Error getting identificationTypes: ', e);
      }
    })();

    // Event listeners for select changes
    issuerElement.onchange = () => {
      // No specific action needed here for now, as it's handled by MP internally
    };
    installmentsElement.onchange = (e) => setInstallments((e.target as HTMLSelectElement).value);
    identificationTypeElement.onchange = (e) => setIdentificationType((e.target as HTMLSelectElement).value);

    return () => {
      // Clean up event listeners or unmount fields if necessary
      cardNumberElement.unmount();
      expirationDateElement.unmount();
      securityCodeElement.unmount();
    };
  }, [mp, transactionAmount]); // Re-run effect if mp instance or amount changes

  const createMPCardToken = async (): Promise<string | null> => {
    if (!mp) {
      console.error("Mercado Pago SDK not initialized.");
      return null;
    }
    try {
      const token = await mp.fields.createCardToken({
        cardholderName: cardholderName,
        identificationType: identificationType,
        identificationNumber: identificationNumber,
      });
      return token.id;
    } catch (e) {
      console.error('error creating card token: ', e);
      // Update parent's error state
      setErrors((prev: any) => ({
        ...prev,
        cardCvv: 'Erro na tokenização do cartão. Verifique os dados.', // Generic error for now
      }));
      return null;
    }
  };

  return (
    <div className="w-full rounded-lg border border-[#e0e8e0] bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-[#075336] mb-4">Detalhes do Cartão</h3>
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="card-name" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Nome completo (como no cartão) *</label>
          <input
            type="text"
            id="form-checkout__cardholderName"
            value={cardholderName}
            onChange={(e) => {
              setCardholderName(e.target.value);
              setErrors((prev: any) => ({ ...prev, cardholderName: '' })); // Clear error on change
            }}
            className={`w-full rounded-xl border ${errors.cardholderName ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            placeholder="Nome completo"
            required
          />
          {errors.cardholderName && <p className="mt-1 text-red-500 text-sm">{errors.cardholderName}</p>}
        </div>

        <div className="md:col-span-2">
          <label htmlFor="form-checkout__cardNumber" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Número do cartão *</label>
          <div id="form-checkout__cardNumber" className="container w-full rounded-xl border border-[#d0e8e0] bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"></div>
        </div>

        <div>
          <label htmlFor="form-checkout__expirationDate" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Validade *</label>
          <div id="form-checkout__expirationDate" className="container w-full rounded-xl border border-[#d0e8e0] bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"></div>
        </div>

        <div>
          <label htmlFor="form-checkout__securityCode" className="block mb-2 text-sm font-medium text-[#5d7a6d]">CVV *</label>
          <div id="form-checkout__securityCode" className="relative container w-full rounded-xl border border-[#d0e8e0] bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]">
          </div>
        </div>

        {/* New fields for Mercado Pago */}
        <div className="md:col-span-2">
          <label htmlFor="form-checkout__issuer" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Banco emissor *</label>
          <select 
            id="form-checkout__issuer" 
            name="issuer"
            className={`w-full rounded-xl border ${errors.installments ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            required
          >
            <option value="" disabled>Banco emissor</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="form-checkout__installments" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Parcelas *</label>
          <select 
            id="form-checkout__installments" 
            name="installments"
            value={installments}
            onChange={(e) => {
              setInstallments(e.target.value);
              setErrors((prev: any) => ({ ...prev, installments: '' })); // Clear error on change
            }}
            className={`w-full rounded-xl border ${errors.installments ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            required
          >
            <option value="" disabled>Parcelas</option>
          </select>
          {errors.installments && <p className="mt-1 text-red-500 text-sm">{errors.installments}</p>}
        </div>

        <div>
          <label htmlFor="form-checkout__identificationType" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Tipo de documento *</label>
          <select 
            id="form-checkout__identificationType" 
            name="identificationType"
            value={identificationType}
            onChange={(e) => {
              setIdentificationType(e.target.value);
              setErrors((prev: any) => ({ ...prev, identificationType: '' })); // Clear error on change
            }}
            className={`w-full rounded-xl border ${errors.identificationType ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            required
          >
            <option value="" disabled>Tipo de documento</option>
          </select>
          {errors.identificationType && <p className="mt-1 text-red-500 text-sm">{errors.identificationType}</p>}
        </div>

        <div>
          <label htmlFor="form-checkout__identificationNumber" className="block mb-2 text-sm font-medium text-[#5d7a6d]">Número do documento *</label>
          <input 
            type="text" 
            id="form-checkout__identificationNumber" 
            name="identificationNumber" 
            placeholder="Número do documento" 
            value={identificationNumber}
            onChange={(e) => {
              setIdentificationNumber(e.target.value);
              setErrors((prev: any) => ({ ...prev, identificationNumber: '' })); // Clear error on change
            }}
            className={`w-full rounded-xl border ${errors.identificationNumber ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
            required
          />
          {errors.identificationNumber && <p className="mt-1 text-red-500 text-sm">{errors.identificationNumber}</p>}
        </div>

        <input id="token" name="token" type="hidden" />
        <input ref={paymentMethodIdRef} id="paymentMethodId" name="paymentMethodId" type="hidden" />
      </div>
    </div>
  );
});

export default CardPaymentForm;