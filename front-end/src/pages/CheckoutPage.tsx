import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CreditCardForm from '../utils/CreditCardForm';
import { validateCPF } from '../utils/validators';
import { useCart } from '../components/CartContext';

interface ModalProps {
  type: 'success' | 'error';
  message: string;
  details: string;
}

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
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
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: ''
  });

  // Estados para os campos do cartão
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  
  // Estado para o modal de erro
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorData, setModalErrorData] = useState<ModalProps>({
    type: 'error',
    message: '',
    details: ''
  });

  // Estado para o popup de sucesso
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Número do WhatsApp da cliente (substitua pelo número real)
  const whatsappNumber = "5511999999999"; // Formato: 55 (código país) + 11 (DDD) + 99999999
  const whatsappMessage = "Olá, gostaria de tirar dúvidas sobre minha compra no site!";

  const subtotal = cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);

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
      cardName: '',
      cardNumber: '',
      cardExpiry: '',
      cardCvv: ''
    };
    let isValid = true;

    // Validação do Nome
    if (!nome) {
      newErrors.nome = 'Nome é obrigatório';
      isValid = false;
    }

    // Validação do Email
    if (email && !validateEmail(email)) {
      newErrors.email = 'Email inválido';
      isValid = false;
    }

    // Validação do CPF
    if (!cpf) {
      newErrors.cpf = 'CPF é obrigatório';
      isValid = false;
    } else if (!validateCPF(cpf.replace(/\D/g, ''))) {
      newErrors.cpf = 'CPF inválido';
      isValid = false;
    }

    // Validação do Telefone
    if (!telefone) {
      newErrors.telefone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!validateTelefone(telefone)) {
      newErrors.telefone = 'Telefone inválido';
      isValid = false;
    }

    // Validação do CEP
    if (!cep) {
      newErrors.cep = 'CEP é obrigatório';
      isValid = false;
    } else if (cep.replace(/\D/g, '').length !== 8) {
      newErrors.cep = 'CEP inválido';
      isValid = false;
    }

    // Validação dos outros campos
    if (!endereco) {
      newErrors.endereco = 'Endereço é obrigatório';
      isValid = false;
    }
    
    if (!numero) {
      newErrors.numero = 'Número é obrigatório';
      isValid = false;
    }
    
    if (!cidade) {
      newErrors.cidade = 'Cidade é obrigatória';
      isValid = false;
    }
    
    if (!estado) {
      newErrors.estado = 'Estado é obrigatório';
      isValid = false;
    }

    // Validação do cartão se método for cartão
    if (paymentMethod === 'credit-card') {
      if (!cardName) {
        newErrors.cardName = 'Nome no cartão é obrigatório';
        isValid = false;
      }
      
      if (!cardNumber || cardNumber.replace(/\D/g, '').length < 16) {
        newErrors.cardNumber = 'Número do cartão inválido';
        isValid = false;
      }
      
      if (!cardExpiry || cardExpiry.length !== 5) {
        newErrors.cardExpiry = 'Data de expiração inválida';
        isValid = false;
      }
      
      if (!cardCvv || cardCvv.length < 3) {
        newErrors.cardCvv = 'CVV inválido';
        isValid = false;
      }
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
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setPaymentMethod('credit-card');
    setDeliveryMethod('standard');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Exibir modal de erro com os campos inválidos
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
    
    // Aqui você integraria com a API do Mercado Pago
    if (paymentMethod === 'credit-card') {
      // Tokenizar o cartão com Mercado Pago
      const cardData = {
        cardNumber: cardNumber.replace(/\D/g, ''),
        cardName,
        cardExpiry,
        cardCvv
      };
      
      console.log('Dados do cartão para tokenização:', cardData);
      // Chamada para API do Mercado Pago para tokenização
      // fetch('https://api.mercadopago.com/v1/card_tokens', {...})
    }
    
    // Exibir popup de sucesso
    setShowSuccessPopup(true);
    
    // Limpar o carrinho após a compra
    clearCart();
    
    // Resetar o formulário (opcional)
    resetForm();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f8f5] to-[#e4f0ea] relative">
      {/* Elementos decorativos */}
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
            {/* Coluna esquerda - Dados do pedido */}
            <div className="lg:col-span-2 space-y-8">
              {/* Seção de Entrega */}
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
                  {/* Campo Nome */}
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

                  {/* Campo Email */}
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
                    {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email}</p>}
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
                      placeholder="Nome da rua"
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
                      placeholder="Número"
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
                      placeholder="Ex: Casa, Apto 101, Atrás do posto"
                    />
                    <p className="mt-1 text-xs text-[#5d7a6d]">Opcional: casa, apartamento, ponto de referência, etc.</p>
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
                      placeholder="UF"
                      required
                    />
                    {errors.estado && <p className="mt-1 text-red-500 text-sm">{errors.estado}</p>}
                  </div>
                </div>
              </div>

              {/* Seção de Itens */}
              <div className="border-b border-[#e0e8e0] pb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">2</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#075336]">
                    Itens do Pedido
                  </h2>
                </div>
                
                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center p-4 bg-[#f9fbfa] rounded-xl">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-[#d0e8e0]">
                        <img 
                          src={item.imagem_url} 
                          alt={item.titulo} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://via.placeholder.com/300x300/f0f8f5/075336?text=${encodeURIComponent(item.titulo.substring(0, 15))}`;
                          }}
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h4 className="font-medium text-[#075336]">{item.titulo}</h4>
                        <div className="flex items-center text-sm text-[#5d7a6d] mt-1">
                          <span>{item.quantidade} × R$ {item.preco.toFixed(2)}</span>
                          {item.cor_padrao && (
                            <span className="ml-3 flex items-center">
                              <span className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: item.cor_padrao }}></span>
                              {item.cor_padrao}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="font-semibold text-[#075336]">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seção de Pagamento */}
              <div className="border-b border-[#e0e8e0] pb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">3</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#075336]">
                    Método de Pagamento
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { id: 'credit-card', label: 'Cartão de crédito/débito', icon: 'credit-card' },
                    { id: 'pix', label: 'Pix', icon: 'pix' },
                    { id: 'boleto', label: 'Boleto bancário', icon: 'barcode' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      className={`rounded-xl border-2 p-4 transition-all cursor-pointer ${
                        paymentMethod === method.id
                          ? 'border-[#8A2BE2] bg-[#f5f0ff] shadow-md'
                          : 'border-[#d0e8e0] bg-white hover:border-[#8A2BE2]/50'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                          paymentMethod === method.id ? 'bg-[#8A2BE2]' : 'bg-[#e0e8e0]'
                        }`}>
                          <span className="text-white font-medium text-lg">
                            {method.icon === 'credit-card' ? '💳' : method.icon === 'pix' ? '📱' : '📄'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-[#075336]">{method.label}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Formulário de cartão de crédito (condicional) */}
                {paymentMethod === 'credit-card' && (
                  <CreditCardForm 
                    cardName={cardName}
                    setCardName={setCardName}
                    cardNumber={cardNumber}
                    setCardNumber={setCardNumber}
                    cardExpiry={cardExpiry}
                    setCardExpiry={setCardExpiry}
                    cardCvv={cardCvv}
                    setCardCvv={setCardCvv}
                    errors={{
                      cardName: errors.cardName,
                      cardNumber: errors.cardNumber,
                      cardExpiry: errors.cardExpiry,
                      cardCvv: errors.cardCvv
                    }}
                  />
                )}
              </div>

              {/* Seção de Entrega */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white">4</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#075336]">
                    Método de Entrega
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'standard', label: 'Entrega Padrão', description: '5-7 dias úteis', price: 'Grátis' },
                    { id: 'express', label: 'Entrega Expressa', description: '1-2 dias úteis', price: 'R$ 20,00' }
                  ].map((method) => (
                    <div 
                      key={method.id}
                      className={`rounded-xl border-2 p-4 transition-all cursor-pointer ${
                        deliveryMethod === method.id
                          ? 'border-[#8A2BE2] bg-[#f5f0ff] shadow-md'
                          : 'border-[#d0e8e0] bg-white hover:border-[#8A2BE2]/50'
                      }`}
                      onClick={() => setDeliveryMethod(method.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-[#075336]">{method.label}</div>
                          <div className="text-sm text-[#5d7a6d] mt-1">{method.description}</div>
                        </div>
                        <div className="font-bold text-[#075336]">{method.price}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna direita - Resumo do pedido */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#f9f0ff] to-[#e6e6fa] rounded-2xl p-6 border border-[#e0d0f0] shadow-sm">
                <h3 className="text-xl font-bold text-[#4B0082] mb-6 text-center">
                  Resumo do Pedido
                </h3>

                <div className="space-y-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-[#e0d0f0]">
                        <img 
                          src={item.imagem_url} 
                          alt={item.titulo} 
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = `https://via.placeholder.com/300x300/f0f8f5/075336?text=${encodeURIComponent(item.titulo.substring(0, 15))}`;
                          }}
                        />
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium text-[#075336] text-sm line-clamp-1">{item.titulo}</h4>
                        <div className="text-xs text-[#5d7a6d]">
                          {item.quantidade} × R$ {item.preco.toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="font-semibold text-[#075336] text-sm">
                        R$ {(item.preco * item.quantidade).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#e0d0f0] mt-6 pt-6 space-y-3">
                  <div className="flex justify-between text-[#5d7a6d]">
                    <span>Subtotal</span>
                    <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-[#5d7a6d]">
                    <span>Frete</span>
                    <span className="font-medium">
                      {deliveryMethod === 'express' ? 'R$ 20,00' : 'Grátis'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-[#5d7a6d]">
                    <span>Desconto</span>
                    <span className="font-medium">R$ 0,00</span>
                  </div>
                  
                  <div className="flex justify-between text-[#075336] font-bold text-lg pt-3 border-t border-[#e0d0f0]">
                    <span>Total</span>
                    <span>R$ {(subtotal + (deliveryMethod === 'express' ? 20 : 0)).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] cursor-pointer text-white py-4 rounded-xl font-bold hover:from-[#9a3bf0] hover:to-[#7a6ae6] transition-all duration-300 shadow-lg"
                  >
                    Finalizar Compra
                  </button>
                  
                  <Link 
                    to="/" 
                    className="mt-4 w-full flex items-center justify-center border-2 border-[#8A2BE2] text-[#8A2BE2] py-3.5 rounded-xl font-bold hover:bg-[#f5f0ff] transition-colors"
                  >
                    Continuar Comprando
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#f0f8f5] to-[#e0f0ea] rounded-2xl p-6 border border-[#d0e8e0]">
                <h4 className="font-bold text-[#075336] mb-3">Precisa de ajuda?</h4>
                <p className="text-[#5d7a6d] text-sm mb-4">
                  Fale com nossa equipe para tirar dúvidas ou personalizar sua bolsa
                </p>
                <a 
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-[#8A2BE2] font-medium hover:text-[#6A5ACD]"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="w-5 h-5 mr-2" 
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.150-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Falar pelo WhatsApp
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal de Erro */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8c66] p-6">
              <h3 className="text-2xl font-bold text-white text-center">
                {modalErrorData.message}
              </h3>
            </div>
            
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
                  <svg 
                    className="w-16 h-16 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-[#075336]">
                  {modalErrorData.details}
                </p>
              </div>

              <button
                onClick={() => setShowErrorModal(false)}
                className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] text-white py-3 rounded-xl font-bold hover:from-[#9a3bf0] hover:to-[#7a6ae6] transition-all"
              >
                Entendi, vou corrigir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup de Sucesso */}
      {showSuccessPopup && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden transform transition-all duration-300 animate-fadeIn">
            <div className="bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] p-8 text-center">
              <div className="mx-auto bg-white rounded-full w-24 h-24 flex items-center justify-center mb-6">
                <svg 
                  className="w-16 h-16 text-green-500" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">
                Compra Realizada com Sucesso!
              </h3>
              
              <p className="text-white/90">
                Seu pedido foi processado com sucesso. Enviamos os detalhes para seu email.
              </p>
            </div>
            
            <div className="p-8">
              <div className="mb-6 text-center">
                <div className="text-lg font-bold text-[#075336] mb-1">
                  Resumo do Pedido
                </div>
                
                <div className="space-y-2 mt-4">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex justify-between text-[#5d7a6d]">
                      <span className="truncate max-w-[60%]">{item.quantidade}x {item.titulo}</span>
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
              </div>
              
              <div className="grid grid-cols-1 gap-4">
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
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;