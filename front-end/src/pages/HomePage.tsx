import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBagIcon, SparklesIcon, HeartIcon, TagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

function HomePage() {
  const navigate = useNavigate();
  const [produtosDestaque, setProdutosDestaque] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const telefoneVendedora = "+5511999999999";

  useEffect(() => {
    const fetchProdutosDestaque = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/products/');
        const data = await response.json();
        setProdutosDestaque(selecionarDestaques(data));
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        setCarregando(false);
      }
    };

    fetchProdutosDestaque();
  }, []);

  const selecionarDestaques = (produtos: Produto[]): Produto[] => {
    const ultimasUnidades = produtos.filter(p => p.quantidade < 5);
    const outrosProdutos = produtos.filter(p => p.quantidade >= 5);
    const embaralhados = [...outrosProdutos].sort(() => Math.random() - 0.5);
    const combinados = [...ultimasUnidades, ...embaralhados];
    return combinados.slice(0, 4); 
  };

  const verDetalhesProduto = (produtoId: number) => {
    navigate(`/produto/${produtoId}`);
  };

  const getCorClass = (corNome: string): string => {
    const cores: Record<string, string> = {
      'vermelho': 'bg-red-500',
      'azul': 'bg-blue-500',
      'verde': 'bg-green-500',
      'amarelo': 'bg-yellow-400',
      'preto': 'bg-black',
      'branco': 'bg-white border border-gray-300',
      'cinza': 'bg-gray-400',
      'rosa': 'bg-pink-400',
      'roxo': 'bg-purple-500',
      'laranja': 'bg-orange-500',
      'dourado': 'bg-amber-400',
      'prata': 'bg-gray-300',
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
    };
    return cores[corNome.toLowerCase()] || 'bg-gray-200 border border-gray-300';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f8f5] to-[#e4f0ea]">
      {/* Elementos decorativos ROXOS */}
      <div className="absolute top-20 right-0 opacity-15">
        <div className="w-28 h-28 rounded-full bg-[#8A2BE2] blur-xl"></div>
      </div>
      <div className="absolute bottom-10 left-10 opacity-15">
        <div className="w-20 h-20 rounded-full bg-[#9370DB] blur-xl"></div>
      </div>
      
      {/* Padrões decorativos ROXOS */}
      <div className="absolute top-1/3 right-20 w-14 h-14 rounded-full bg-[#6A5ACD] opacity-15 blur-xl"></div>
      <div className="absolute bottom-1/4 left-20 w-16 h-16 rounded-full bg-[#4B0082] opacity-10 blur-xl"></div>

      <Navbar />

      <div className="flex-grow flex flex-col items-center justify-center p-4 pt-8">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mb-16 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#8FBC8F]/30 to-[#a2d9c3]/30 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-pulse-slow">
                <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center border border-[#d0e0d0] shadow-inner">
                  <ShoppingBagIcon className="w-16 h-16 text-[#8FBC8F]" />
                </div>
              </div>
              <div className="absolute -top-2 -right-2 bg-[#8A2BE2] text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-bold shadow-md animate-bounce">
                NEW
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-[#075336] mb-4">
            Transforme seu <span className="text-[#8FBC8F]">estilo</span> com <br className="hidden md:block" />
            <span className="text-[#4a8c68]">LF Bag Your Dreams</span>
          </h1>

          <p className="text-[#5d7a6d] text-xl mb-8 max-w-2xl mx-auto">
            Bolsas exclusivas e personalizadas que refletem sua personalidade única
          </p>
        </div>
        
        {/* Seção de Vantagens - Atualizada com tema roxo */}
        <div className="max-w-6xl w-full mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8e0f0] flex items-center">
              <div className="bg-[#f5f0ff] p-3 rounded-xl mr-4">
                <ArrowPathIcon className="w-8 h-8 text-[#8A2BE2]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#4B0082]">Produção Artesanal</h3>
                <p className="text-[#6A5ACD] text-sm">Feitas à mão com atenção aos detalhes</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8e0f0] flex items-center">
              <div className="bg-[#f5f0ff] p-3 rounded-xl mr-4">
                <HeartIcon className="w-8 h-8 text-[#8A2BE2]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#4B0082]">Personalização Total</h3>
                <p className="text-[#6A5ACD] text-sm">Crie a bolsa dos seus sonhos</p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#e8e0f0] flex items-center">
              <div className="bg-[#f5f0ff] p-3 rounded-xl mr-4">
                <TagIcon className="w-8 h-8 text-[#8A2BE2]" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#4B0082]">Qualidade Premium</h3>
                <p className="text-[#6A5ACD] text-sm">Materiais selecionados e duráveis</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Seção Sobre a Loja */}
        <div className="max-w-6xl w-full mb-16 bg-gradient-to-br from-white to-[#f8fcfb] rounded-3xl shadow-xl p-8 border border-[#d0e8e0] relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#8FBC8F]/10 blur-3xl"></div>
          
          <h2 className="text-3xl font-bold text-center text-[#075336] mb-12 relative z-10">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8FBC8F] to-[#075336]">
              Nossa História
            </span>
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="flex-1">
              <div className="rounded-2xl overflow-hidden border-4 border-white shadow-lg transform transition-transform duration-500 hover:scale-[1.02]">
                <img 
                  src="https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80" 
                  alt="Costura criativa"
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-[#5d7a6d] mb-4 leading-relaxed text-lg">
                A <strong className="text-[#8FBC8F]">LF Bag Your Dreams</strong> nasceu da paixão por transformar tecidos em sonhos palpáveis. Fundada em 2023, nossa marca combina o conhecimento técnico com a sensibilidade artística.
              </p>
              
              <p className="text-[#5d7a6d] mb-4 leading-relaxed text-lg">
                Nossa fundadora, com vasta experiência em costura criativa, dedicou-se ao ensino no <strong className="text-[#075336]">Instituto Formiguinhas</strong>, compartilhando seu conhecimento com mulheres em situação de vulnerabilidade social.
              </p>
              
              <p className="text-[#5d7a6d] leading-relaxed text-lg">
                Cada bolsa é uma criação única, produzida artesanalmente pela própria cliente, garantindo não apenas qualidade superior, mas também uma conexão pessoal e autêntica com cada peça.
              </p>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-[#f0f8f5] to-[#e0f0ea] rounded-xl border border-[#8FBC8F]/30 shadow-sm">
                <p className="text-[#8FBC8F] font-semibold text-lg italic">
                  "Mais do que bolsas, criamos sonhos materializados com linhas, tecidos e muito amor."
                </p>
                <p className="mt-2 text-[#5d7a6d] text-right">— Fundadora, LF Bag Your Dreams</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Banner Personalização WhatsApp */}
        <div id="personalize" className="bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] rounded-2xl p-8 text-white max-w-6xl w-full mb-12 relative overflow-hidden transform transition-transform duration-300 hover:-translate-y-1">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between relative z-10">
            <div className="flex-1 mb-6 md:mb-0">
              <div className="flex items-center mb-4">
                <SparklesIcon className="w-10 h-10 text-white mr-3" />
                <h2 className="text-2xl md:text-3xl font-bold">Crie sua bolsa dos sonhos!</h2>
              </div>
              <p className="text-lg max-w-xl">
                Converse diretamente com nossa artesã e desenvolva uma peça exclusiva, perfeita para o seu estilo e necessidades.
              </p>
            </div>
            <a 
              href={`https://wa.me/${telefoneVendedora}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#8A2BE2] px-8 py-4 rounded-xl font-bold hover:bg-[#f0f8f5] transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="w-6 h-6 mr-2" 
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com artesã agora
            </a>
          </div>
        </div>
        
        {/* Produtos em Destaque - Atualizado */}
        <div id="produtos" className="mt-8 mb-16 w-full max-w-6xl px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]">
                Destaques do Catálogo
              </span>
            </h2>
          </div>
          
          {carregando ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-48 rounded-lg"></div>
                    <div className="mt-4 space-y-2">
                      <div className="bg-gray-200 h-4 rounded"></div>
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-6 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {produtosDestaque.map(produto => (
                <div 
                  key={produto.id} 
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full cursor-pointer"
                  onClick={() => verDetalhesProduto(produto.id)}
                >
                  <div className="relative pt-[100%] bg-gray-100">
                    <img 
                      src={produto.imagens.length > 0 ? produto.imagens[0].url : 'https://via.placeholder.com/300x300?text=Sem+imagem'} 
                      alt={produto.titulo} 
                      className="absolute top-0 left-0 w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Imagem+não+carregada';
                      }}
                    />
                    {produto.quantidade < 5 && (
                      <div className="absolute top-2 left-2 bg-[#8A2BE2] text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-pulse">
                        Últimas {produto.quantidade} unidades!
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-semibold text-gray-800">{produto.titulo}</h3>
                    <div className="mt-2 flex items-center">
                      <span 
                        className={`w-4 h-4 rounded-full inline-block mr-2 border border-gray-300 ${getCorClass(produto.cor_padrao)}`}
                      ></span>
                      <span className="text-xs text-gray-500">{produto.cor_padrao}</span>
                    </div>
                    <div className="mt-auto pt-3">
                      <p className="font-bold text-[#8A2BE2] text-lg">
                        R$ {produto.preco.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Seção: Experiência de Personalização */}
        <div className="bg-gradient-to-r from-[#8FBC8F] to-[#4a8c68] rounded-2xl p-8 max-w-6xl w-full mb-16 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 blur-2xl"></div>
          
          <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="flex-1 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-[#075336] mb-4">
                Crie a bolsa perfeita para você
              </h2>
              <p className="text-[#075336] text-lg mb-6 max-w-md">
                Nossa jornada de criação conjunta garante que cada detalhe reflita seu estilo único e necessidades específicas.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-[#8FBC8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#075336]">Consulta Personalizada</h3>
                    <p className="text-[#5d7a6d]">Conversa direta com nossa artesã para definir cada detalhe</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-[#8FBC8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#075336]">Acompanhamento do Processo</h3>
                    <p className="text-[#5d7a6d]">Atualizações em cada etapa da confecção da sua peça</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white rounded-full p-2 mr-3">
                    <svg className="w-6 h-6 text-[#8FBC8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#075336]">Entrega Especial</h3>
                    <p className="text-[#5d7a6d]">Embalagem premium e certificado de autenticidade</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="bg-gradient-to-br from-white to-[#f0f8f5] rounded-2xl p-6 shadow-xl border border-[#d0e8e0]">
                  <div className="flex items-center mb-4">
                    <div className="bg-[#8FBC8F] text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span>1</span>
                    </div>
                    <h3 className="font-bold text-[#075336]">Escolha o modelo base</h3>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="bg-[#8FBC8F] text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span>2</span>
                    </div>
                    <h3 className="font-bold text-[#075336]">Personalize cores e detalhes</h3>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="bg-[#8FBC8F] text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span>3</span>
                    </div>
                    <h3 className="font-bold text-[#075336]">Acompanhe a confecção</h3>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-[#8FBC8F] text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                      <span>4</span>
                    </div>
                    <h3 className="font-bold text-[#075336]">Receba sua criação única</h3>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-[#8A2BE2] text-white px-4 py-2 rounded-lg font-bold shadow-lg">
                  Experiência Exclusiva
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Novo botão WhatsApp abaixo da seção Experiência Exclusiva */}
        <div className="max-w-6xl w-full mb-16 flex justify-center">
          <a 
            href={`https://wa.me/${telefoneVendedora}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-[#8A2BE2] to-[#6A5ACD] text-white px-10 py-5 rounded-2xl font-bold hover:from-[#9a3bf0] hover:to-[#7a6ae6] transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-8 h-8 mr-3" 
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Fale agora com nossa artesã e crie sua bolsa única
          </a>
        </div>
        
      
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;