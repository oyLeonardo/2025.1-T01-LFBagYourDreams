import { Link, Routes, Route } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import PedidosPage from './pages/PedidosPage'
import ProdutosPage from './pages/ProdutosPage'
import AdicionarProdutoPage from './pages/AdicionarProdutoPage'
function App() {
  return (
    <>
    <div className='h-full'>
      <Routes>
        <Route path="/admin" element={<AdminPage />}>
          <Route index element={<PedidosPage />} />
          <Route path="pedidos" element={<PedidosPage />} /> 
          <Route path="produtos" element={<ProdutosPage />} />
          <Route path="adicionarproduto" element={<AdicionarProdutoPage />} />
        </Route>
        <Route path="/" element={<h1>Página Inicial Pública <Link to="admin">ir para adm</Link></h1>} />
        <Route path="*" element={<h1>404 - Página Não Encontrada</h1>} />
      </Routes>
    </div>
    </>
  )
}

export default App
