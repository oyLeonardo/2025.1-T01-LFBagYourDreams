import Navbar from '../components/Navbar';
import { ShoppingBagIcon, ArrowRightIcon, SparklesIcon, HeartIcon, TagIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// Interface para tipagem dos produtos
interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  precoOriginal?: number;
  imagem: string;
  coresDisponiveis?: string[];
  avaliacao?: number;
}

// Dados dos produtos em destaque
const produtosDestaque: Produto[] = [
  {
    id: 1,
    nome: "Bolsa de Couro Premium",
    descricao: "Bolsa em couro legítimo com acabamento artesanal",
    preco: 299.90,
    precoOriginal: 349.90,
    imagem: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80",
    coresDisponiveis: ["#8B4513", "#000000", "#964B00"],
    avaliacao: 4.8
  },
  {
    id: 2,
    nome: "Bolsa Térmica para Almoço",
    descricao: "Mantenha sua comida quentinha com estilo",
    preco: 149.90,
    imagem: "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=300&q=80",
    coresDisponiveis: ["#FF6B6B", "#4ECDC4", "#556270"],
    avaliacao: 4.5
  },
  {
    id: 3,
    nome: "Mochila Executiva",
    descricao: "Perfeita para o trabalho com compartimento para laptop",
    preco: 349.90,
    precoOriginal: 399.90,
    imagem: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80",
    coresDisponiveis: ["#2C3E50", "#7F8C8D", "#16A085"],
    avaliacao: 4.9
  },
  {
    id: 4,
    nome: "Clutch Elegance",
    descricao: "Perfeita para eventos noturnos e ocasiões especiais",
    preco: 199.90,
    imagem: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=300&q=80",
    coresDisponiveis: ["#DAA520", "#800020", "#000000"],
    avaliacao: 4.7
  }
];

function HomePage() {
  const navigate = useNavigate();
  const telefoneVendedora = "+5511999999999";

  // Função para ver detalhes do produto
  const verDetalhesProduto = (produtoId: number) => {
    navigate(`/produto/${produtoId}`);
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
        
        {/* Produtos em Destaque - Design Minimalista Roxo */}
        <div id="produtos" className="mt-8 mb-16 w-full max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8A2BE2] to-[#4B0082]">
                Bolsas em Destaque
              </span>
            </h2>
            <div className="text-[#8A2BE2] font-medium flex items-center">
              <span>Ver todas</span>
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {produtosDestaque.map((produto) => (
              <div 
                key={produto.id} 
                className="bg-gradient-to-br from-[#f9f0ff] to-[#e6e6fa] p-5 rounded-2xl shadow-sm border border-[#e0d0f0] group relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                onClick={() => verDetalhesProduto(produto.id)}
              >
                <div className="h-48 mb-4 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#f0e8ff] to-[#d8cfff]">
                  <img 
                    src={produto.imagem} 
                    alt={produto.nome}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://via.placeholder.com/300x300/f9f3ff/6A5ACD?text=${encodeURIComponent(produto.nome.substring(0, 15))}`;
                    }}
                  />
                </div>
                
                <div className="text-center">
                  <h3 className="font-bold text-lg text-[#4B0082] mb-2 group-hover:text-[#8A2BE2] transition-colors">
                    {produto.nome}
                  </h3>
                  <p className="font-semibold text-[#8A2BE2]">
                    R$ {produto.preco.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
        
        {/* Depoimentos */}
        <div className="max-w-6xl w-full mb-16">
          <h2 className="text-3xl font-bold text-center text-[#075336] mb-12">
            O que nossas clientes dizem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white p-6 rounded-2xl shadow-sm border border-[#e0e8e0]">
                <div className="flex items-center mb-4">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="ml-4">
                    <h4 className="font-bold text-[#075336]">Ana Carolina</h4>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className="w-4 h-4 text-[#8FBC8F] fill-current"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-[#5d7a6d] italic">
                  "Minha bolsa personalizada superou todas as expectativas! A qualidade do material e o cuidado com os detalhes são impressionantes. Recebi vários elogios!"
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;