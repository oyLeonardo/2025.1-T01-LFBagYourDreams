import Navbar from '../components/Navbar';

function HomePage() {
return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />

        <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-2xl">
            <div className="flex justify-center mb-8">
            <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <svg 
                    className="w-12 h-12 text-white animate-pulse" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                </svg>
                </div>
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold text-white animate-bounce">
                NEW
                </div>
            </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Bem-vindo ao nosso <span className="text-indigo-600">Catálogo</span>
            </h1>

            <p className="text-gray-600 text-lg mb-8">
            Descubra nossa coleção exclusiva de produtos cuidadosamente selecionados para você.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-1"
            >
                Explorar Produtos
            </button>
            </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
            {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-4" />
                <h3 className="font-semibold text-lg text-gray-800 mb-2">Produto {item}</h3>
                <p className="text-gray-600 text-sm mb-4">Descrição breve do produto destacado</p>
                <div className="flex justify-between items-center">
                <span className="font-bold text-indigo-600">R$ {item * 49}.90</span>
                <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded text-sm transition-colors">
                    Detalhes
                </button>
                </div>
            </div>
            ))}
        </div>
        </div>
        
        <p className="mt-auto py-6 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} LF Bag Your Dreams.
        </p>
    </div>
    );
}

export default HomePage;