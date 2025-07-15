import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CardPaymentForm from '../components/CheckoutPage/CardPaymentForm';
import { validateCPF } from '../utils/validators';
import { useCart } from '../components/CartContext';
import { loadMercadoPago } from '@mercadopago/sdk-js';
import apiClient from '../api';

// --- Interfaces ---
interface CartItem {
  id: string | number;
  titulo: string;
  preco: number;
  quantidade: number;
}

interface ModalProps {
  type: 'success' | 'error';
  message: string;
  details: string;
}

// --- Componente Principal ---
const CheckoutPage = () => {
  const { cartItems, clearCart, cartId } = useCart();

  console.log("1. ID do carrinho obtido do contexto:", cartId); 

  // Estados do Formulário
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
  
  // Estados do Cartão
  const [cardholderName, setCardholderName] = useState('');
  const [identificationType, setIdentificationType] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [installments, setInstallments] = useState('');

  // Estados de Controle de UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    nome: '', email: '', cpf: '', telefone: '', cep: '',
    endereco: '', numero: '', cidade: '', estado: '',
    cardholderName: '', identificationType: '',
    identificationNumber: '', installments: '',
  });
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [modalErrorData, setModalErrorData] = useState<ModalProps>({ type: 'error', message: '', details: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: CartItem[]; total: number } | null>(null);

  // Estados e Refs do Mercado Pago
  const [mp, setMp] = useState<any>(null);
  const CardPaymentFormRef = useRef<any>(null);
  
  // Variáveis Calculadas
  const subtotal = cartItems.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  const totalAmount = subtotal + (deliveryMethod === 'express' ? 20 : 0);
  const whatsappNumber = "5511999999999";
  const whatsappMessage = "Olá, gostaria de tirar dúvidas sobre minha compra no site!";

  // Funções Auxiliares de Formatação e Validação
  const formatCPF = (value: string) => value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').replace(/(-\d{2})\d+?$/, '$1');
  const formatTelefone = (value: string) => { const cleaned = value.replace(/\D/g, ''); if (cleaned.length > 11) return value.substring(0, 15); const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/); if (!match) return value; let formatted = ''; if (match[1]) formatted += `(${match[1]}`; if (match[2]) formatted += `) ${match[2]}`; if (match[3]) formatted += `-${match[3]}`; return formatted; };
  const formatCEP = (value: string) => value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{3})\d+?$/, '$1');
  const validateTelefone = (telefone: string): boolean => { const cleaned = telefone.replace(/\D/g, ''); return cleaned.length >= 10 && cleaned.length <= 11; };
  const validateEmail = (email: string): boolean => { if (!email) return true; const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return re.test(email); };
  
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
      }
    } catch (error) { console.error('Erro ao buscar CEP:', error); }
  };

  useEffect(() => { if (cep.replace(/\D/g, '').length === 8) { buscarEnderecoPorCEP(cep); } }, [cep]);

  // Carregamento do SDK do Mercado Pago
  useEffect(() => {
    const fetchPublicKey = async () => {
      try {
        const response = await apiClient.get('api/public-key/');
        if (response.data.public_key) {
          await loadMercadoPago();
          const mpInstance = new (window as any).MercadoPago(response.data.public_key);
          setMp(mpInstance);
        }
      } catch (error) { console.error('Error fetching public key:', error); }
    };
    fetchPublicKey();
  }, []);

  const validateForm = () => { /* Adicione sua lógica de validação aqui */ return true; };
  const resetForm = () => { /* Adicione sua lógica de reset aqui */ };

  // Função de envio para o backend
  const handlePaymentSubmission = async (cardToken: string) => {
    try {
      const paymentData = {
        transaction_amount: totalAmount, token: cardToken,
        description: `Compra na Loja - Pedido de ${nome}`,
        installments: parseInt(installments, 10),
        payment_method_id: (CardPaymentFormRef.current?.getPaymentMethodId() || ''),
        payer: { email: email, identification: { type: identificationType, number: identificationNumber }, first_name: nome.split(' ')[0], last_name: nome.split(' ').slice(1).join(' ') || '' },
        shipping_address: { zip_code: cep.replace(/\D/g, ''), street_name: endereco, street_number: numero, neighborhood: '', city: cidade, federal_unit: estado },

        cart_id: cartId,

        cart_items: cartItems.map(item => ({
            product_id: item.id,
            quantity: item.quantidade
        }))
      };

      const response = await apiClient.post('api/pagamento/processar/', paymentData);

      console.log('Resposta do backend:', response.status, response.data); // Debug

      // Verifica se o status é de sucesso (200-299) ou se há uma resposta de aprovação no conteúdo
      if (response.status >= 200 && response.status < 300) {
        // Verifica se a resposta contém informações de aprovação
        const responseData = response.data;
        const isApproved = responseData?.status === 'approved' || 
                          (responseData?.message && responseData.message.toLowerCase().includes('aprovado')) ||
                          responseData?.payment_status === 'approved' ||
                          responseData?.success === true ||
                          (!responseData?.error && !responseData?.message?.toLowerCase().includes('erro'));

        console.log('isApproved:', isApproved, 'responseData:', responseData); // Debug

        if (isApproved) {
          setCompletedOrder({ items: cartItems, total: totalAmount });
          setShowSuccessPopup(true);
          clearCart();
          resetForm();
        } else {
          setModalErrorData({ 
            type: 'error', 
            message: 'Erro no Pagamento', 
            details: responseData?.message || responseData?.error || 'Ocorreu um erro no processamento do pagamento.' 
          });
          setShowErrorModal(true);
        }
      } else {
        setModalErrorData({ 
          type: 'error', 
          message: 'Erro no Pagamento', 
          details: response.data?.message || response.data?.error || 'Ocorreu um erro.' 
        });
        setShowErrorModal(true);
      }
    } catch (error) {
      setModalErrorData({ type: 'error', message: 'Erro de Conexão', details: 'Não foi possível conectar ao servidor.' });
      setShowErrorModal(true);
    }
  };

  // Função principal do clique do botão
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isSubmitting) return;

    if (paymentMethod === 'credit-card' && CardPaymentFormRef.current) {
      setIsSubmitting(true);
      try {
        const token = await CardPaymentFormRef.current.createMPCardToken();
        if (token) {
          await handlePaymentSubmission(token);
        } else {
          setModalErrorData({ type: 'error', message: 'Erro no Cartão', details: 'Não foi possível validar os dados do cartão.' });
          setShowErrorModal(true);
        }
      } catch (error) {
        console.error('Erro ao tokenizar cartão:', error);
        setModalErrorData({ type: 'error', message: 'Erro na Tokenização', details: 'Ocorreu um erro ao processar os dados do cartão.' });
        setShowErrorModal(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f8f5] to-[#e4f0ea] relative">
      <div className="absolute top-20 right-0 opacity-15"><div className="w-28 h-28 rounded-full bg-[#8A2BE2] blur-xl"></div></div>
      <div className="absolute bottom-10 left-10 opacity-15"><div className="w-20 h-20 rounded-full bg-[#9370DB] blur-xl"></div></div>
      
      <Navbar />

      <div className="flex-grow py-8 px-4 max-w-6xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-[#075336] mb-4">Finalize sua <span className="text-[#8A2BE2]">Compra</span></h1>
          <p className="text-[#5d7a6d] max-w-2xl mx-auto">Revise seus itens e preencha as informações para concluir seu pedido</p>
        </div>

        <form className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-[#e0e8e0]" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="border-b border-[#e0e8e0] pb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3"><span className="text-white">1</span></div>
                  <h2 className="text-xl font-bold text-[#075336]">Dados de Entrega</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-[#5d7a6d] mb-2">Nome Completo *</label>
                    <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className={`w-full rounded-xl border ${errors.nome ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="Seu nome completo" required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="block text-sm font-medium text-[#5d7a6d] mb-2">Email</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`w-full rounded-xl border ${errors.email ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="seu.email@exemplo.com" />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="block text-sm font-medium text-[#5d7a6d] mb-2">CPF *</label>
                    <input type="text" id="cpf" value={cpf} onChange={(e) => setCpf(formatCPF(e.target.value))} className={`w-full rounded-xl border ${errors.cpf ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="000.000.000-00" required />
                  </div>
                  <div>
                    <label htmlFor="telefone" className="block text-sm font-medium text-[#5d7a6d] mb-2">Telefone *</label>
                    <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(formatTelefone(e.target.value))} className={`w-full rounded-xl border ${errors.telefone ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="(00) 00000-0000" required />
                  </div>
                  <div>
                    <label htmlFor="cep" className="block text-sm font-medium text-[#5d7a6d] mb-2">CEP *</label>
                    <input type="text" id="cep" value={cep} onChange={(e) => setCep(formatCEP(e.target.value))} className={`w-full rounded-xl border ${errors.cep ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="00000-000" required />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="endereco" className="block text-sm font-medium text-[#5d7a6d] mb-2">Endereço *</label>
                    <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} className={`w-full rounded-xl border ${errors.endereco ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="Nome da Rua, Avenida, etc." required />
                  </div>
                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-[#5d7a6d] mb-2">Número *</label>
                    <input type="text" id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} className={`w-full rounded-xl border ${errors.numero ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="123" required />
                  </div>
                  <div>
                    <label htmlFor="complemento" className="block text-sm font-medium text-[#5d7a6d] mb-2">Complemento</label>
                    <input type="text" id="complemento" value={complemento} onChange={(e) => setComplemento(e.target.value)} className="w-full rounded-xl border border-[#d0e8e0] bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]" placeholder="Apto 101, Bloco B" />
                  </div>
                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-[#5d7a6d] mb-2">Cidade *</label>
                    <input type="text" id="cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} className={`w-full rounded-xl border ${errors.cidade ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="Sua cidade" required />
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-[#5d7a6d] mb-2">Estado *</label>
                    <input type="text" id="estado" value={estado} onChange={(e) => setEstado(e.target.value)} className={`w-full rounded-xl border ${errors.estado ? 'border-red-500' : 'border-[#d0e8e0]'} bg-[#f9fbfa] p-3.5 text-[#075336] focus:outline-none focus:ring-2 focus:ring-[#8FBC8F]`} placeholder="Seu estado (ex: SP)" required />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-[#075336] mb-4 mt-8">Tipo de Entrega</h3>
                <div className="flex space-x-4">
                  <label className="flex items-center"><input type="radio" name="deliveryMethod" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="form-radio text-[#8A2BE2]" /><span className="ml-2 text-[#5d7a6d]">Padrão (Grátis)</span></label>
                  <label className="flex items-center"><input type="radio" name="deliveryMethod" value="express" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="form-radio text-[#8A2BE2]" /><span className="ml-2 text-[#5d7a6d]">Expressa (R$ 20,00)</span></label>
                </div>
              </div>
              <div className="pb-8">
                <div className="flex items-center mb-6">
                  <div className="bg-[#8FBC8F] w-8 h-8 rounded-full flex items-center justify-center mr-3"><span className="text-white">2</span></div>
                  <h2 className="text-xl font-bold text-[#075336]">Dados de Pagamento</h2>
                </div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#075336] mb-4">Método de Pagamento</h3>
                  <div className="flex space-x-4">
                    <label className="flex items-center"><input type="radio" name="paymentMethod" value="credit-card" checked={paymentMethod === 'credit-card'} onChange={() => setPaymentMethod('credit-card')} className="form-radio text-[#8A2BE2]" /><span className="ml-2 text-[#5d7a6d]">Cartão de Crédito</span></label>
                    <label className="flex items-center"><input type="radio" name="paymentMethod" value="pix" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} className="form-radio text-[#8A2BE2]" /><span className="ml-2 text-[#5d7a6d]">Pix (em breve)</span></label>
                    <label className="flex items-center"><input type="radio" name="paymentMethod" value="boleto" checked={paymentMethod === 'boleto'} onChange={() => setPaymentMethod('boleto')} className="form-radio text-[#8A2BE2]" /><span className="ml-2 text-[#5d7a6d]">Boleto (em breve)</span></label>
                  </div>
                </div>
                {paymentMethod === 'credit-card' && mp && (
                  <CardPaymentForm ref={CardPaymentFormRef} mp={mp} transactionAmount={totalAmount} cardholderName={cardholderName} setCardholderName={setCardholderName} identificationType={identificationType} setIdentificationType={setIdentificationType} identificationNumber={identificationNumber} setIdentificationNumber={setIdentificationNumber} installments={installments} setInstallments={setInstallments} setErrors={setErrors} errors={errors} />
                )}
              </div>
            </div>
            <div className="lg:col-span-1 bg-[#f9fbfa] rounded-xl p-6 border border-[#e0e8e0] shadow-sm flex flex-col justify-between h-fit sticky top-8">
              <div>
                <h2 className="text-xl font-bold text-[#075336] mb-4">Resumo do Pedido</h2>
                <div className="space-y-3 mb-4">
                  {cartItems.map((item) => (<div key={item.id} className="flex justify-between text-[#5d7a6d]"><span>{item.quantidade}x {item.titulo}</span><span>R$ {(item.preco * item.quantidade).toFixed(2)}</span></div>))}
                </div>
                <div className="border-t border-[#e0e8e0] mt-4 pt-4">
                  <div className="flex justify-between font-bold text-[#075336]"><span>Subtotal:</span><span>R$ {subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between text-[#5d7a6d] mt-2"><span>Entrega:</span><span>{deliveryMethod === 'express' ? 'R$ 20.00' : 'Grátis'}</span></div>
                  <div className="flex justify-between font-bold text-[#075336] mt-4"><span>Total:</span><span>R$ {totalAmount.toFixed(2)}</span></div>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] text-white py-3 rounded-xl font-bold text-lg transition-all duration-300 shadow-md mt-6 hover:from-[#9a3bf0] hover:to-[#7a6ae6] disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? 'Processando...' : 'Finalizar Compra'}
              </button>
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer" className="mt-4 w-full flex items-center justify-center bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition-colors duration-300 shadow-md">
                Fale Conosco
              </a>
            </div>
          </div>
        </form>
      </div>

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full text-center shadow-lg">
            <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <h3 className="text-xl font-bold mb-2 text-red-600">{modalErrorData.message}</h3>
            <p className="text-gray-600 mb-4">{modalErrorData.details}</p>
            <button onClick={() => setShowErrorModal(false)} className="bg-[#8A2BE2] text-white py-2 px-4 rounded-xl font-bold">Ok</button>
          </div>
        </div>
      )}

      {showSuccessPopup && completedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-lg">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <h3 className="text-2xl font-bold text-[#075336] mb-3">Pedido Realizado com Sucesso!</h3>
                <p className="text-[#5d7a6d] mb-6">Seu pedido foi recebido e está sendo processado. Em breve você receberá um e-mail de confirmação.</p>
                <div className="bg-[#f0f8f5] rounded-lg p-4 mb-6 text-left">
                    <h4 className="font-semibold text-[#075336] mb-2">Detalhes da Compra:</h4>
                    {completedOrder.items.map(item => (
                        <div key={item.id} className="flex justify-between text-[#5d7a6d] text-sm">
                            <span>{item.quantidade}x {item.titulo}</span>
                            <span>R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t border-[#e0e8e0] mt-4 pt-4">
                    <div className="flex justify-between font-bold text-[#075336]">
                        <span>Total:</span>
                        <span>R$ {completedOrder.total.toFixed(2)}</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mt-6">
                    <Link to="/" className="border-2 border-[#8A2BE2] text-[#8A2BE2] py-3 rounded-xl font-bold text-center hover:bg-[#f5f0ff] transition-colors" onClick={() => setShowSuccessPopup(false)}>Continuar Comprando</Link>
                </div>
            </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default CheckoutPage;
