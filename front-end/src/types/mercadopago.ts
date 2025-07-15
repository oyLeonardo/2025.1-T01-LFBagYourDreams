// src/types/mercadopago.d.ts

// --- Declaração global para a biblioteca MercadoPago (MANTER APENAS O NECESSÁRIO GLOBAL) ---
declare global {
  interface Window {
    MercadoPago: MercadoPagoSDK;
  }
}

// --- Interfaces exportadas para uso em outros módulos (componentes) ---
export interface MercadoPagoSDK {
  setPublicKey: (publicKey: string) => void;
  setLocale: (locale: string) => void;
  getIdentificationTypes: () => Promise<MercadoPagoIdentificationType[]>;
  getInstallments: (options: GetInstallmentsOptions) => Promise<MercadoPagoInstallment[]>;
  getIssuers: (options: GetIssuersOptions) => Promise<MercadoPagoIssuer[]>;
  createCardToken: (cardData: CardTokenData) => Promise<CardTokenResponse>;

  fields: {
    create: (fieldType: string, options: any) => MercadoPagoField;
    createCardToken: (data: {
      cardholderName: string;
      identificationType: string;
      identificationNumber: string;
    }) => Promise<{ id: string }>;
  };
}

export interface MercadoPagoField {
  mount: (element: string | HTMLElement) => void;
  unmount: () => void;
  update: (options: any) => void;
  on: (event: string, callback: (event: any) => void) => void;
  createCardToken: (data: any) => Promise<{ id: string }>;
}

export interface MercadoPagoIdentificationType {
  id: string;
  name: string;
  type: string;
  min_length: number;
  max_length: number;
}

export interface GetInstallmentsOptions {
  amount: number;
  bin?: string;
  issuer_id?: string;
  payment_method_id?: string;
}

export interface MercadoPagoInstallment {
  payment_method_id: string;
  payment_type_id: string;
  issuer: { id: number; name: string };
  processing_mode: string;
  payer_costs: PayerCost[];
  agreements: any[];
}

export interface PayerCost {
  installments: number;
  installment_rate: number;
  discount_rate: number;
  reimbursement_rate: number;
  labels: string[];
  installment_amount: number;
  total_amount: number;
  recommended_message: string;
  mercado_pago_payment_method_id?: string;
}

export interface GetIssuersOptions {
  bin: string;
  payment_method_id?: string;
}

export interface MercadoPagoIssuer {
  id: number;
  name: string;
  secure_thumbnail?: string;
  thumbnail?: string;
  merchant_account_id?: string | null;
  processing_mode?: string;
  payment_method_id: string; // Adicionado, importante para o checkout
}

export interface CardTokenData {
  cardNumber: string;
  cardExpirationMonth: string;
  cardExpirationYear: string;
  securityCode: string;
  cardholderName: string;
  identificationType: string;
  identificationNumber: string;
  cardBin?: string;
  cardLastFourDigits?: string;
}

export interface CardTokenResponse {
  id: string; // Este é o token que você envia para o backend
  public_key: string;
  card_id?: string;
  luhn_validation?: boolean;
  status: string;
  date_created: string;
  date_updated: string;
  expiration_month: number;
  expiration_year: number;
  first_six_digits: string;
  last_four_digits: string;
  security_code_length: number;
  card_number_length: number;
}

// Interface para o payload enviado ao seu backend
export interface PaymentPayload {
  token?: string; // Opcional para Pix/Boleto
  installments?: number; // Opcional para Pix/Boleto
  payment_method_id: string; // Obrigatório: 'pix', 'bolbradesco', 'visa', etc.
  issuer_id?: number; // Opcional para Pix/Boleto, necessário para cartão
  email: string;
  transaction_amount: number;
  description: string;
  docType: string;
  docNumber: string;
  order_id: string;
  payer: {
    first_name: string;
    last_name: string;
    email: string;
    identification: {
      type: string;
      number: string;
    };
    address: {
      zip_code: string;
      street_name: string;
      street_number: string;
      neighborhood?: string; // Opcional: ViaCEP geralmente não retorna
      city: string;
      federal_unit: string;
    };
  };
}

// Interface para a resposta do seu backend
export interface BackendResponse {
  status: string; // "approved", "in_process", "rejected", "pending"
  message?: string;
  id?: string; // ID do pagamento no Mercado Pago
  pedido_id?: string; // ID do pedido no seu sistema
  cause?: any[]; // Detalhes do erro em caso de falha
  qr_code?: string; // Para Pix (código copia e cola)
  qr_code_base64?: string; // Para Pix (imagem base64)
  external_resource_url?: string; // Para Boleto (URL do PDF)
  barcode?: string; // Para Boleto
}

// Interface para o estado completo do formulário (adaptada do seu CheckoutPage.tsx)
export interface FullFormData {
    nome: string;
    email: string;
    docType: string; // Adicionado para o MP, será mapeado do CPF
    docNumber: string; // Adicionado para o MP, será mapeado do CPF
    telefone: string;
    cep: string;
    endereco: string;
    numero: string;
    complemento: string;
    cidade: string;
    estado: string;
    cardName: string;
    cardNumber: string;
    cardExpirationMonth: string; // MM
    cardExpirationYear: string;  // AA (ou AAAA)
    securityCode: string;        // CVV
    installments: string;       // Parcelas
    issuer: string;             // Bandeira
    payment_method_id?: string; // Adicionado para armazenar o payment_method_id da bandeira selecionada
    orderId: string;            // ID do pedido
}

// Interface para os erros de validação
export interface FormErrors {
  nome: string;
  email: string;
  docType: string;
  docNumber: string; // Mudei de cpf para docNumber
  telefone: string;
  cep: string;
  endereco: string;
  numero: string;
  cidade: string;
  estado: string;
  cardName?: string; // Opcional, só para cartão
  cardNumber?: string; // Opcional, só para cartão
  cardExpirationMonth?: string; // Opcional, só para cartão
  securityCode?: string; // Opcional, só para cartão
  installments?: string; // Opcional, só para cartão
  issuer?: string; // Opcional, só para cartão
}