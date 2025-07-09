import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: string;
  estoque: number;
}

const mockProdutos: Produto[] = [
  {
    id: 1,
    nome: "Bolsa Masculina",
    descricao: "Bolsa executiva em couro",
    preco: 299.90,
    imagem: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7",
    categoria: "Masculino",
    estoque: 15
  },
  {
    id: 2,
    nome: "Necessaire Feminina",
    descricao: "Necessaire elegante",
    preco: 159.90,
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    categoria: "Feminino",
    estoque: 20
  },
  {
    id: 3,
    nome: "Mochila Infantil",
    descricao: "Mochila escolar divertida",
    preco: 129.90,
    imagem: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec",
    categoria: "Infantil",
    estoque: 10
  },
  {
    id: 4,
    nome: "Bolsa Térmica",
    descricao: "Conserva temperatura",
    preco: 199.90,
    imagem: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d",
    categoria: "Termicas",
    estoque: 8
  },
  {
    id: 4,
    nome: "Necessaire Feminina",
    descricao: "Necessaire elegante",
    preco: 159.90,
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    categoria: "Feminino",
    estoque: 20
  },
  {
    id: 4,
    nome: "Necessaire Feminina",
    descricao: "Necessaire elegante",
    preco: 159.90,
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    categoria: "Feminino",
    estoque: 20
  },
  {
    id: 4,
    nome: "Necessaire Feminina",
    descricao: "Necessaire elegante",
    preco: 159.90,
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    categoria: "Feminino",
    estoque: 20
  },
  {
    id: 4,
    nome: "Necessaire Feminina",
    descricao: "Necessaire elegante",
    preco: 159.90,
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
    categoria: "Feminino",
    estoque: 20
  },
];

function CatalogoPage() {
  const { categoria } = useParams(); // Captura o parâmetro da URL
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setProdutos(mockProdutos);
      setCarregando(false);
    }, 500);
  }, []);

  // Função para normalizar textos (remover acentos e colocar em minúsculas)
  const normalizarTexto = (texto: string) => {
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };

  // Filtra os produtos baseado na categoria da URL
  const produtosFiltrados = categoria
    ? produtos.filter(p => 
        normalizarTexto(p.categoria) === normalizarTexto(categoria))
    : produtos;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 capitalize">
          {categoria ? categoria : 'Todos os Produtos'}
        </h1>

        {carregando ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : produtosFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-gray-500">Não encontramos produtos na categoria "{categoria}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-8">
            {produtosFiltrados.map(produto => (
              <div key={produto.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full">
                <div className="relative pt-[100%] bg-gray-100">
                  <img 
                    src={produto.imagem} 
                    alt={produto.nome} 
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 flex-grow flex flex-col">
                  <h3 className="font-semibold text-gray-800">{produto.nome}</h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">{produto.descricao}</p>
                  <div className="mt-auto pt-3">
                    <p className="font-bold text-green-600 text-lg">
                      R$ {produto.preco.toFixed(2)}
                    </p>
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