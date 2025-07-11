import { Routes, Route } from 'react-router-dom';
import AdminPage from './pages/AdminPage';
import PedidosPage from './pages/PedidosPage';
import ProdutosPage from './pages/ProdutosPage';
import AdicionarProdutoPage from './pages/AdicionarProdutoPage';
import HomePage from './pages/HomePage';
import CatalogoPage from './pages/CatalogoPage';
import DetalheProdutoPage from './pages/DetalheProdutoPage';
import ProdutoPageCatalogo from './pages/ProdutoPageCatalogo';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <Routes>
          <Route path="/admin" element={<AdminPage />}>
            <Route index element={<PedidosPage />} />
            <Route path="pedidos" element={<PedidosPage />} />
            <Route path="produtos" element={<ProdutosPage />} />
            <Route path="adicionarproduto" element={<AdicionarProdutoPage />} />
            <Route path="produto/:produtoId" element={<DetalheProdutoPage />} />
          </Route>
          <Route path="/" element={<HomePage />} />
          <Route path="/categoria/:categoria" element={<CatalogoPage />} />
          <Route path="/produto/:id" element={<ProdutoPageCatalogo />} />
          <Route path="/produto/:id" element={<ProdutoPageCatalogo />} />
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-2xl font-bold">404 - Página Não Encontrada</h1>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;