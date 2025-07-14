import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardPaymentForm from '../components/CheckoutPage/CardPaymentForm';
import { validateCPF } from '../utils/validators';
import { useCart } from '../components/CartContext';
import { loadMercadoPago } from '@mercadopago/sdk-js';

interface ModalProps {
  type: 'success' | 'error';
  message: string;
  details: string;
}

interface MPCardToken {
  id: string;
  // Add other relevant properties if needed
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate(); // Hook for navigation

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [cardholderName, setCardholderName] = useState(''); // New state for cardholder name
  const [identificationType, setIdentificationType] = useState(''); // New state
  const [identificationNumber, setIdentificationNumber] = useState(''); // New state
  const [installments, setInstallments] = useState(''); // New state for selected installments

  // Mercado Pago states
  const [mp, setMp] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string>('');
  const [cardToken, setCardToken] = useState<string>(''); // To store the Mercado Pago token ID

  const CardPaymentFormRef = useRef<any>(null); // Ref to access methods in CardPaymentForm

  const [errors, setErrors] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    cep: '',
    endereco: '',
    numero: '',
    cidade: '',
    estado: '',
    cardholderName: '', // New error state
    identificationType: '', // New error state
    identificationNumber: '', // New error state
    installments: '', // New error state
    // Card number, expiry, cvv errors will be handled by MP fields directly
  });

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorData, setModalErrorData] = useState<ModalProps>({
    type: 'error',
    message: '',
    details: ''
  });

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const whatsappNumber = "5511999999999";
  const whatsappMessage = "Olá, gostaria de tirar dúvidas sobre minha compra no site!";

  const subtotal = cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const totalAmount = subtotal + (deliveryMethod === 'express' ? 20 : 0);

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatTelefone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 11) return value.substring(0, 15);
    
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    
    let formatted = '';
    if (match[1]) formatted += `(${match[1]}`;
    if (match[2]) formatted += `) ${match[2]}`;
    if (match[3]) formatted += `-${match[3]}`;
    
    return formatted;
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const validateTelefone = (telefone: string): boolean => {
    const cleaned = telefone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  };

  const validateEmail = (email: string): boolean => {
    if (!email) return true;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const buscarEnderecoPorCEP = async (cep: string) => {
    try {
      const cepNumerico = cep.replace(/\D/g, '');
      if (cepNumerico.length !== 8) return;
      
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setEndereco(data.logradouro || '');
        setCidade(data.localidade || '');
        setEstado(data.uf || '');
        setErrors(prev => ({ ...prev, cep: '' }));
      } else {
        setErrors(prev => ({ ...prev, cep: 'CEP não encontrado' }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      setErrors(prev => ({ ...prev, cep: 'Erro ao buscar CEP' }));
    }
  };

  useEffect(() => {
    if (cep.replace(/\D/g, '').length === 8) {
      buscarEnderecoPorCEP(cep);
    }
  }, [cep]);

  // Fetch Public Key and Load Mercado Pago SDK
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/public-key/'); // Django endpoint
        const data = await response.json();
        if (data.public_key) {
          setPublicKey(data.public_key);
          await loadMercadoPago();
          const mpInstance = new (window as any).MercadoPago(data.public_key);
          setMp(mpInstance);
        } else {
          console.error('Public key not found in response');
        }
      } catch (error) {
        console.error('Error fetching Mercado Pago public key:', error);
      }
    };

    fetchPublicKey();
  }, []);

  const validateForm = () => {
    const newErrors = { 
      nome: '', 
      email: '', 
      cpf: '', 
      telefone: '',
      cep: '', 
      endereco: '', 
      numero: '',
      cidade: '', 
      estado: '',
      cardholderName: '',
      identificationType: '',
      identificationNumber: '',
      installments: '',
    };
    let isValid = true;

    if (!nome) { newErrors.nome = 'Nome é obrigatório'; isValid = false; }
    if (email && !validateEmail(email)) { newErrors.email = 'Email inválido'; isValid = false; }
    if (!cpf) { newErrors.cpf = 'CPF é obrigatório'; isValid = false; } 
    else if (!validateCPF(cpf.replace(/\D/g, ''))) { newErrors.cpf = 'CPF inválido'; isValid = false; }
    if (!telefone) { newErrors.telefone = 'Telefone é obrigatório'; isValid = false; } 
    else if (!validateTelefone(telefone)) { newErrors.telefone = 'Telefone inválido'; isValid = false; }
    if (!cep) { newErrors.cep = 'CEP é obrigatório'; isValid = false; } 
    else if (cep.replace(/\D/g, '').length !== 8) { newErrors.cep = 'CEP inválido'; isValid = false; }
    if (!endereco) { newErrors.endereco = 'Endereço é obrigatório'; isValid = false; }
    if (!numero) { newErrors.numero = 'Número é obrigatório'; isValid = false; }
    if (!cidade) { newErrors.cidade = 'Cidade é obrigatória'; isValid = false; }
    if (!estado) { newErrors.estado = 'Estado é obrigatório'; isValid = false; }

    if (paymentMethod === 'credit-card') {
      if (!cardholderName) { newErrors.cardholderName = 'Nome no cartão é obrigatório'; isValid = false; }
      if (!identificationType) { newErrors.identificationType = 'Tipo de documento é obrigatório'; isValid = false; }
      if (!identificationNumber) { newErrors.identificationNumber = 'Número do documento é obrigatório'; isValid = false; }
      if (!installments) { newErrors.installments = 'Parcelas são obrigatórias'; isValid = false; }
      // Mercado Pago fields will handle their own internal validation
    }

    setErrors(newErrors);
    return isValid;
  };

  const resetForm = () => {
    setNome('');
    setEmail('');
    setCpf('');
    setTelefone('');
    setCep('');
    setEndereco('');
    setNumero('');
    setComplemento('');
    setCidade('');
    setEstado('');
    setCardholderName('');
    setIdentificationType('');
    setIdentificationNumber('');
    setInstallments('');
    setCardToken('');
    setPaymentMethod('credit-card');
    setDeliveryMethod('standard');
    // Consider re-initializing MP fields if necessary, or let CardPaymentForm handle its own reset
  };

  const handlePaymentSubmission = async () => {
    // This function will be called after tokenization
    try {
      const paymentData = {
        transaction_amount: totalAmount,
        token: cardToken,
        description: `Compra na Loja - Pedido de ${nome}`, // Example description
        installments: parseInt(installments, 10),
        payment_method_id: (CardPaymentFormRef.current?.getPaymentMethodId() || ''), // Get payment method ID from CardPaymentForm
        payer: {
          email: email,
          identification: {
            type: identificationType,
            number: identificationNumber,
          },
          first_name: nome.split(' ')[0],
          last_name: nome.split(' ').slice(1).join(' ') || '',
        },
        shipping_address: {
          zip_code: cep.replace(/\D/g, ''),
          street_name: endereco,
          street_number: numero,
          neighborhood: '', // This might need to be fetched via CEP or added as a field
          city: cidade,
          federal_unit: estado,
        },
      };

      console.log("Dados de pagamento enviados ao backend:", paymentData);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) { // Adiciona o cabeçalho apenas se o token existir e não for vazio
        (headers as Record<string, string>)['X-CSRFToken'] = csrfToken;
      }
      
      const response = await fetch('http://127.0.0.1:8000/api/pagamento/processar/', {
          method: 'POST',
          headers: headers, // Use o objeto headers preparado
          body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setShowSuccessPopup(true);
        clearCart();
        resetForm();
      } else {
        setModalErrorData({
          type: 'error',
          message: 'Erro no Pagamento',
          details: result.message || 'Ocorreu um erro ao processar seu pagamento. Tente novamente.'
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
      setModalErrorData({
        type: 'error',
        message: 'Erro Inesperado',
        details: 'Ocorreu um erro inesperado ao tentar processar o pagamento. Tente novamente.'
      });
      setShowErrorModal(true);
    }
  };

  // Helper function to get CSRF token
  const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorFields = Object.entries(errors)
        .filter(([, value]) => value !== '')
        .map(([key]) => key)
        .join(', ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase();
      
      setModalErrorData({
        type: 'error',
        message: 'Erro ao finalizar compra',
        details: `Verifique os campos: ${errorFields}`
      });
      setShowErrorModal(true);
      return;
    }
    
    if (paymentMethod === 'credit-card' && CardPaymentFormRef.current) {
      try {
        const token = await CardPaymentFormRef.current.createMPCardToken();
        if (token) {
          setCardToken(token); // Set the token and let useEffect trigger handlePaymentSubmission
        } else {
          setModalErrorData({
            type: 'error',
            message: 'Erro na Tokenização do Cartão',
            details: 'Não foi possível gerar o token do cartão. Verifique os dados do cartão.'
          });
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Erro ao tokenizar cartão:', error);
        setModalErrorData({
          type: 'error',
          message: 'Erro na Tokenização do Cartão',
          details: 'Ocorreu um erro ao tokenizar o cartão. Tente novamente.'
        });
        setShowErrorModal(true);
      }
    } else {
      // Handle other payment methods or direct submission if credit card is not selected
      handlePaymentSubmission();
    }
  };

  // Trigger payment submission when cardToken is set
  useEffect(() => {
    if (cardToken) {
      handlePaymentSubmission();
    }
  }, [cardToken]);

  const Modal = ({ type, message, details }: ModalProps) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
          {type === 'success' ? (
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          ) : (
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          )}
          <h3 className="text-xl font-bold mb-2 text-[#075336]">
            {message}
          </h3>
          <p className="text-[#5d7a6d] mb-4">
            {details}
          </p>
          <button
            onClick={() => setShowErrorModal(false)}
            className="bg-[#8A2BE2] text-white py-2 px-4 rounded-xl font-bold hover:bg-[#9a3bf0] transition-colors"
          >
            Ok
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f8f5] to-[#e4f0ea] relative">
      <div className="absolute top-20 right-0 opacity-15">
        <div className="w-28 h-28 rounded-full bg-[#8A2BE2] blur-xl"></div>
      </div>
      <div className="absolute bottom-10 left-10 opacity-15">
        <div className="w-20 h-20 rounded-full bg-[#9370DB] blur-xl"></div>
      </div>
      
      <Navbar />

      <div className="flex-grow py-8 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#075336] mb-4">
            Finalize sua <span className="text-[#8A2BE2]">Compra</span>
          </h1>
          <p className="text-[#5d7a6d] max-w-2xl mx-auto">
            Revise seus itens e preencha as informações para concluir seu pedido
          </p>
        </div>

        <form className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e0e8e0]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="border-b border-[#e0e8e0] pb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">1</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#075336]">
                    Dados de Entrega
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className={`w-full rounded-xl border ${errors.nome ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="Seu nome completo"
                      required
                    />
                    {errors.nome && <p className="mt-1 text-red-500 text-sm">{errors.nome}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => {
                        if (email && !validateEmail(email)) {
                          setErrors(prev => ({ ...prev, email: 'Email inválido' }));
                        } else {
                          setErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="seu.email@exemplo.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    <p className="mt-1 text-xs text-[#5d7a6d]">Opcional: para receber atualizações do pedido</p>
                  </div>

                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      CPF *
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(formatCPF(e.target.value))}
                      onBlur={() => {
                        if (cpf && !validateCPF(cpf.replace(/\D/g, ''))) {
                          setErrors(prev => ({ ...prev, cpf: 'CPF inválido' }));
                        } else {
                          setErrors(prev => ({ ...prev, cpf: '' }));
                        }
                      }}
                      className={`w-full rounded-xl border ${errors.cpf ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="000.000.000-00"
                      required
                    />
                    {errors.cpf && <p className="mt-1 text-red-500 text-sm">{errors.cpf}</p>}
                  </div>

                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Telefone *
                    </label>
                    <input
                      type="text"
                      id="telefone"
                      value={telefone}
                      onChange={(e) => setTelefone(formatTelefone(e.target.value))}
                      onBlur={() => {
                        if (telefone && !validateTelefone(telefone)) {
                          setErrors(prev => ({ ...prev, telefone: 'Telefone inválido' }));
                        } else {
                          setErrors(prev => ({ ...prev, telefone: '' }));
                        }
                      }}
                      className={`w-full rounded-xl border ${errors.telefone ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="(00) 00000-0000"
                      required
                    />
                    {errors.telefone && <p className="mt-1 text-red-500 text-sm">{errors.telefone}</p>}
                  </div>

                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      CEP *
                    </label>
                    <input
                      type="text"
                      id="cep"
                      value={cep}
                      onChange={(e) => setCep(formatCEP(e.target.value))}
                      className={`w-full rounded-xl border ${errors.cep ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="00000-000"
                      required
                    />
                    {errors.cep && <p className="mt-1 text-red-500 text-sm">{errors.cep}</p>}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="endereco" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Endereço *
                    </label>
                    <input
                      type="text"
                      id="endereco"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      className={`w-full rounded-xl border ${errors.endereco ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="Nome da Rua, Avenida, etc."
                      required
                    />
                    {errors.endereco && <p className="mt-1 text-red-500 text-sm">{errors.endereco}</p>}
                  </div>

                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Número *
                    </label>
                    <input
                      type="text"
                      id="numero"
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      className={`w-full rounded-xl border ${errors.numero ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="123"
                      required
                    />
                    {errors.numero && <p className="mt-1 text-red-500 text-sm">{errors.numero}</p>}
                  </div>

                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Complemento
                    </label>
                    <input
                      type="text"
                      id="complemento"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      className="w-full rounded-xl border border-[#d0e8e0] bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]"
                      placeholder="Apto 101, Bloco B"
                    />
                  </div>

                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      id="cidade"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className={`w-full rounded-xl border ${errors.cidade ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="Sua cidade"
                      required
                    />
                    {errors.cidade && <p className="mt-1 text-red-500 text-sm">{errors.cidade}</p>}
                  </div>

                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-[#5d7a6d] mb-2">
                      Estado *
                    </label>
                    <input
                      type="text"
                      id="estado"
                      value={estado}
                      onChange={(e) => setEstado(e.target.value)}
                      className={`w-full rounded-xl border ${errors.estado ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`}
                      placeholder="Seu estado (ex: SP)"
                      required
                    />
                    {errors.estado && <p className="mt-1 text-red-500 text-sm">{errors.estado}</p>}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-[#075336] mb-4 mt-8">Tipo de Entrega</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="form-radio text-[#8A2BE2]"
                    />
                    <span className="ml-2 text-[#5d7a6d]">Padrão (Grátis)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="form-radio text-[#8A2BE2]"
                    />
                    <span className="ml-2 text-[#5d7a6d]">Expressa (R$ 20,00)</span>
                  </label>
                </div>
              </div>

              {/* Seção de Pagamento */}
              <div className="pb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#075336]">
                    Dados de Pagamento
                  </h2>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#075336] mb-4">Método de Pagamento</h3>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={() => setPaymentMethod('credit-card')}
                        className="form-radio text-[#8A2BE2]"
                      />
                      <span className="ml-2 text-[#5d7a6d]">Cartão de Crédito</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pix"
                        checked={paymentMethod === 'pix'}
                        onChange={() => setPaymentMethod('pix')}
                        className="form-radio text-[#8A2BE2]"
                      />
                      <span className="ml-2 text-[#5d7a6d]">Pix (em breve)</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="boleto"
                        checked={paymentMethod === 'boleto'}
                        onChange={() => setPaymentMethod('boleto')}
                        className="form-radio text-[#8A2BE2]"
                      />
                      <span className="ml-2 text-[#5d7a6d]">Boleto (em breve)</span>
                    </label>
                  </div>
                </div>

                {paymentMethod === 'credit-card' && mp && (
                  <CardPaymentForm
                    ref={CardPaymentFormRef}
                    mp={mp}
                    transactionAmount={totalAmount}
                    cardholderName={cardholderName}
                    setCardholderName={setCardholderName}
                    identificationType={identificationType}
                    setIdentificationType={setIdentificationType}
                    identificationNumber={identificationNumber}
                    setIdentificationNumber={setIdentificationNumber}
                    installments={installments}
                    setInstallments={setInstallments}
                    setErrors={setErrors}
                    errors={errors}
                  />
                )}
              </div>
            </div>

            {/* Coluna direita - Resumo do pedido */}
            <div className="lg:col-span-1 bg-[#f9fbfa] rounded-xl p-6 border border-[#e0e8e0] shadow-sm flex flex-col justify-between h-fit sticky top-8">
              <div>
                <h2 className="text-xl font-bold text-[#075336] mb-4">Resumo do Pedido</h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-[#5d7a6d]">
                      <span>{item.quantidade}x {item.titulo}</span>
                      <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-[#e0e8e0] mt-4 pt-4">
                  <div className="flex justify-between font-bold text-[#075336]">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[#5d7a6d] mt-2">
                    <span>Entrega:</span>
                    <span>{deliveryMethod === 'express' ? 'R$ 20.00' : 'Grátis'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#075336] mt-4">
                    <span>Total:</span>
                    <span>R$ {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] text-white py-3 rounded-xl font-bold text-lg hover:from-[#9a3bf0] hover:to-[#7a6ae6] transition-all duration-300 shadow-md mt-6"
              >
                Finalizar Compra
              </button>

              <a 
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-4 w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors duration-300 shadow-md"
              >
                <svg className="w-5 h-5 mr-2" aria-hidden="true" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 1.956.551 3.82 1.583 5.421L2 22l4.606-2.043A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2ZM9.408 7.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clipRule="evenodd" />
                </svg>
                Fale Conosco
              </a>
            </div>
          </div>
        </form>
      </div>

      {showErrorModal && (
        <Modal type={modalErrorData.type} message={modalErrorData.message} details={modalErrorData.details} />
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-lg transform transition-all duration-300 scale-100 opacity-100">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-2xl font-bold text-[#075336] mb-3">
              Pedido Realizado com Sucesso!
            </h3>
            <p className="text-[#5d7a6d] mb-6">
              Seu pedido foi recebido e está sendo processado. Em breve você receberá um e-mail de confirmação.
            </p>
            
            <div className="bg-[#f0f8f5] rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-[#075336] mb-2">Detalhes da Compra:</h4>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-[#5d7a6d] text-sm">
                  <span>{item.quantidade}x {item.titulo}</span>
                  <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t border-[#e0e8e0] mt-4 pt-4">
              <div className="flex justify-between font-bold text-[#075336]">
                <span>Total:</span>
                <span>R$ {(subtotal + (deliveryMethod === 'express' ? 20 : 0)).toFixed(2)}</span>
              </div>
            </div>
          
            <div className="grid grid-cols-1 gap-4 mt-6">
              <Link
                to="/"
                className="border-2 border-[#8A2BE2] text-[#8A2BE2] py-3 rounded-xl font-bold text-center hover:bg-[#f5f0ff] transition-colors"
                onClick={() => setShowSuccessPopup(false)}
              >
                Continuar Comprando
              </Link>
              
              <Link
                to="/pedidos"
                className="bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] text-white py-3 rounded-xl font-bold text-center hover:from-[#9a3bf0] hover:to-[#7a6ae6] transition-all"
                onClick={() => setShowSuccessPopup(false)}
              >
                Ver Meus Pedidos
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;