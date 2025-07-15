import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {type Produto} from '../types/produto'
import ProdutoCard from '../components/ProdutoCard';
import apiClient from '../api';
function CatalogoPage() {
  const { categoria } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search') || '';

    const isSearchRoute = location.pathname.includes('/produtos/search');

    const params = new URLSearchParams();

    if (categoria && !isSearchRoute) {
      params.append('categoria', categoria);
    }
    
    if (searchTerm) {
      params.append('search', searchTerm);
    }

    const endpoint = `/api/products/?${params.toString()}`;
    console.log("Fetching data from endpoint:", endpoint);

    fetchData(endpoint);
  }, [categoria, location.search, location.pathname]);

  async function fetchData(endpoint: string) {
    setCarregando(true);
    setErro(null);
    
    try {
      const response = await apiClient.get<Produto[]>(endpoint);
      setProdutos(response.data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      setErro('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    } finally {
      setCarregando(false);
    }
  }
  
    const verDetalhes = (produtoId: number)=> {
    navigate(`/produto/${produtoId}`);
    };

    const queryParams = new URLSearchParams(location.search);
    const searchTerm = queryParams.get('search');


  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 capitalize">
          {categoria ? categoria : 'Todos os produtos'}
        </h1>

        {searchTerm && (
          <div className="mb-6">
            <p className="text-gray-600">
              Resultados para: <span className="font-semibold">"{searchTerm}"</span>
            </p>

          </div>
        )}

        {erro && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            {erro}
          </div>
        )}

        {carregando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : produtos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm 
                ? `Não encontramos produtos para "${searchTerm}"`
                : `Não encontramos produtos na categoria "${categoria}"`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">

            {produtos.map((produto: Produto) => (
              <ProdutoCard
                key={produto.id}
                produto={produto}
                mostrarDescricao={true}
                mostrarMaterial={true}
                mostrarEstoque={true}
                onClick={() => verDetalhes(produto.id)}
              />

            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CatalogoPage;