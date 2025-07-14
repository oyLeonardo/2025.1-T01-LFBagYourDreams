import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface ImagemProduto {
  id: number;
  url: string;
  criado_em: string;
}

interface Produto {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: number;
  quantidade: number;
  material: string;
  cor_padrao: string;
  altura: number | null;
  comprimento: number | null;
  largura: number | null;
  imagens: ImagemProduto[];
}

function CatalogoPage() {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [products, setproducts] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const API_URL = 'http://localhost:8000/api/products/';

  useEffect(() => {
    fetchData(API_URL);
  }, []);

  function fetchData(baseUrl: string) {
    setCarregando(true);
    setErro(null);
    
    fetch(baseUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setproducts(data);
      })
      .catch((error) => {
        console.error('Erro ao buscar products:', error);
        setErro('Não foi possível carregar os products. Tente novamente mais tarde.');
      })
      .finally(() => {
        setCarregando(false);
      });
  }

  const getCorClass = (corNome: string): string => {
    const cores: Record<string, string> = {
      // Cores básicas
      'vermelho': 'bg-red-500',
      'azul': 'bg-blue-500',
      'verde': 'bg-green-500',
      'amarelo': 'bg-yellow-400',
      'preto': 'bg-black',
      'branco': 'bg-white border border-gray-300',
      'cinza': 'bg-gray-400',
      
      // Cores adicionais
      'rosa': 'bg-pink-400',
      'roxo': 'bg-purple-500',
      'laranja': 'bg-orange-500',
      'dourado': 'bg-amber-400',
      'prata': 'bg-gray-300',
      
      // Novas cores solicitadas
      'verde militar': 'bg-green-800',
      'vinho': 'bg-red-800',
      'marrom': 'bg-amber-800',
      'bege': 'bg-amber-100 border border-gray-300',
      'turquesa': 'bg-cyan-400',
      'azul marinho': 'bg-blue-800',
      'coral': 'bg-orange-300',
      'lilás': 'bg-purple-300',
      'vermelho escuro': 'bg-red-700',
      'verde claro': 'bg-green-300',
      'azul claro': 'bg-blue-300',
      'amarelo ouro': 'bg-yellow-500',
      'grafite': 'bg-gray-600',
      'caramelo': 'bg-amber-600',
      'champagne': 'bg-amber-50 border border-gray-300',
      'petróleo': 'bg-teal-700',
      'salmão': 'bg-orange-200',
      'vinho tinto': 'bg-red-900',
      'verde musgo': 'bg-green-700',
      'azul celeste': 'bg-blue-200',
      
      // Padrão para cores não mapeadas
    };
    
    return cores[corNome.toLowerCase()] || 'bg-gray-200 border border-gray-300'; // Cor padrão cinza claro
  };

  const normalizarTexto = (texto: string) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  const productsFiltrados = categoria
    ? products.filter(p => 
        normalizarTexto(p.categoria) === normalizarTexto(categoria))
    : products;
  
    const verDetalhes = (produtoId: number)=> {
    navigate(`/produto/${produtoId}`);
    };


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 capitalize">
          {categoria ? categoria : 'Todos os products'}
        </h1>

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : productsFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-gray-500">Não encontramos products na categoria "{categoria}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">
            {productsFiltrados.map(produto => (
              <div 
              key={produto.id} 
              className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
              onClick={() => verDetalhes(produto.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && verDetalhes(produto.id)}
              >
                <div className="relative pt-[100%] bg-gray-100">
                  <img 
                    src={produto.imagens.length > 0 ? produto.imagens[0].url : 'https://via.placeholder.com/300x300?text=Sem+imagem'} 
                    alt={produto.titulo} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/300x300?text=Imagem+Indisponível';
                    }}
                  />
                </div>
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-800">{produto.titulo}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{produto.descricao}</p>
                  <div className="mt-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded inline-flex items-center gap-1">
                      {produto.material} • 
                      <span className="inline-flex items-center">
                        <span 
                          className={`w-3 h-3 rounded-full inline-block mr-1 border border-gray-300 ${getCorClass(produto.cor_padrao)}`}
                        ></span>
                        {produto.cor_padrao}
                      </span>
                    </span>
                  </div>
                  <div className="mt-auto pt-3">
                    <p className="font-bold text-green-800 text-lg">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                    {produto.quantidade <= 5 && (
                      <p className="text-xs text-red-500 mt-1">
                        Últimas unidades! ({produto.quantidade} restantes)
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CatalogoPage;