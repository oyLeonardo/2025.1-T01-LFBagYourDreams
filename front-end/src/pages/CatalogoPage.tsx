import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {type Produto} from '../types/produto'
import ProdutoCard from '../components/ProdutoCard';

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