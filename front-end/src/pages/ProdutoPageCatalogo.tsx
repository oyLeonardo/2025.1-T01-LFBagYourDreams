import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../components/CartContext';
import {type Produto} from '../types/produto';
import { getCorClass } from '../utils/getCorClass';


function ProdutoPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const API_LISTA_PRODUTOS = 'http://localhost:8000/api/products/';

  useEffect(() => {
    const fetchProduto = async () => {
      setCarregando(true);
      setErro(null);
      
      try {
        const response = await fetch(API_LISTA_PRODUTOS);
        
        if (!response.ok) {
          throw new Error('Erro ao buscar lista de produtos');
        }
        
        const todosProdutos = await response.json();
        const produtoEncontrado = todosProdutos.find((p: Produto) => p.id === Number(id));

        if (!produtoEncontrado) {
          throw new Error(`Produto com ID ${id} não encontrado`);
        }
        
        setProduto(produtoEncontrado);
      } catch (error) {
        console.error('Erro ao buscar produto:', error);
        setErro(error instanceof Error ? error.message : 'Erro desconhecido');
      } finally {
        setCarregando(false);
      }
    };

    fetchProduto();
  }, [id]);

  const adicionarAoCarrinho = () => {
    if (produto) {
      const cartItem = {
        id: produto.id,
        titulo: produto.titulo,
        preco: produto.preco,
        quantidade: quantidade,
        imagem_url: produto.imagens.length > 0 ? produto.imagens[0].url : 'https://via.placeholder.com/300x300?text=Sem+imagem',
        cor_padrao: produto.cor_padrao
      };

      addToCart(cartItem);
      setMostrarConfirmacao(true);
      
      setTimeout(() => {
        setMostrarConfirmacao(false);
      }, 3000);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (erro || !produto) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="text-center py-12 bg-white rounded-lg shadow max-w-4xl mx-auto my-8 p-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            {erro || 'Produto não encontrado'}
          </h3>
          <p className="mt-1 text-gray-500">
            {erro?.includes('404') && 'Verifique se o servidor Django está rodando corretamente'}
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Voltar ao catálogo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      {/* Notificação de adicionado ao carrinho */}
      {mostrarConfirmacao && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg flex items-center animate-fadeInOut">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{quantidade} {produto.titulo} adicionado(s) ao carrinho!</span>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-green-900 hover:text-green-950 transition"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 p-6">
              <div className="relative pt-[70%] bg-gray-100 rounded-lg">
                <img 
                  src={produto.imagens.length > 0 ? produto.imagens[0].url : 'https://via.placeholder.com/300x300?text=Sem+imagem'} 
                  alt={produto.titulo} 
                  className="absolute top-0 left-0 w-full h-full object-contain p-4"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Imagem+não+carregada';
                  }}
                />
              </div>
            </div>
            <div className="md:w-1/2 p-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{produto.titulo}</h1>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium mb-4">
                {produto.categoria}
              </span>
              
              <p className="text-green-900 text-2xl font-bold mb-4">
                R$ {produto.preco.toFixed(2).replace('.', ',')}
              </p>
              
              <p className="text-gray-700 mb-6">{produto.descricao}</p>
              
              <div className="mb-4">
                <p className="font-medium text-gray-800">Material:</p>
                <p className="text-gray-600">{produto.material}</p>
              </div>
              
              <div className="mb-4">
                <p className="font-medium text-gray-800">Cor padrão:</p>
                  <div 
                    className={`w-5 h-5 rounded-full border border-gray-300 ${getCorClass(produto.cor_padrao)}`}
                    title={produto.cor_padrao}
                  ></div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <button 
                    onClick={() => setQuantidade(q => Math.max(1, q - 1))}
                    disabled={quantidade <= 1}
                    className="px-3 py-1 bg-gray-200 rounded-l hover:bg-gray-300 disabled:opacity-50"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 bg-gray-100 border-t border-b border-gray-200">
                    {quantidade}
                  </span>
                  <button 
                    onClick={() => setQuantidade(q => Math.min(produto.quantidade, q + 1))}
                    disabled={quantidade >= produto.quantidade}
                    className="px-3 py-1 bg-gray-200 rounded-r hover:bg-gray-300 disabled:opacity-50"
                  >
                    +
                  </button>
                  <span className="ml-3 text-sm text-gray-600">
                    {produto.quantidade} disponíveis
                  </span>
                </div>
                
                <button
                  onClick={adicionarAoCarrinho}
                  disabled={produto.quantidade === 0 || quantidade > produto.quantidade}
                  className={`w-full py-3 px-4 rounded-lg font-medium ${
                    produto.quantidade === 0 || quantidade > produto.quantidade
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-green-900 text-white hover:bg-green-950'
                  }`}
                >
                  {produto.quantidade === 0 
                    ? 'Produto Esgotado' 
                    : quantidade > produto.quantidade
                      ? 'Quantidade indisponível'
                      : 'Adicionar ao Carrinho'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProdutoPage;