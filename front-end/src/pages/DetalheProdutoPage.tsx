import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Button from '../components/Button';
import apiClient from '../api';

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

function DetalheProdutoPage() {
    const { produtoId } = useParams<{ produtoId: string }>();
    const navigate = useNavigate();
    const [produto, setProduto] = useState<Produto | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [editmodal, setEditModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);

    // Função para carregar os dados do produto
    useEffect(() => {
        if (!produtoId) {
            setCarregando(false);
            return;
        }

        const fetchProduto = async () => {
            setCarregando(true);
            try {
                // 2. CORREÇÃO: Usando apiClient para buscar os dados com autenticação
                const response = await apiClient.get<Produto>(`/product/${produtoId}/`);
                setProduto(response.data);
            } catch (error) {
                console.error('Erro ao buscar produto:', error);
                setProduto(null); // Define como nulo se houver erro
            } finally {
                setCarregando(false);
            }
        };
        fetchProduto();
    }, [produtoId]);

    const handleDeleteCancel = () => {
        setDeleteModal(false);
        };

    const handleDeleteConfirm = () => {
        deletarProduto();
        };

    const handleEditCancelExit = () => {
    setEditModal(false); // Apenas fecha o modal
    };

    const handleEditConfirmExit = () => {
        setEditModal(false);
        navigate(`/admin/produtos/editar/${produtoId}`); 
    };


    const deletarProduto = async () => {
        if (!produtoId) return;
        
        setCarregando(true);
        setDeleteModal(false);
        try {
            // 3. CORREÇÃO: Usando apiClient para deletar com autenticação
            await apiClient.delete(`/product/${produtoId}/`);
            alert('Produto deletado com sucesso!');
            navigate('/admin/produtos'); // Volta para a lista
        } catch (error) {
            console.error('Erro ao deletar produto:', error);
            alert('Erro ao deletar produto. Tente novamente.');
        } finally {
            setCarregando(false);
        }
    };

    if (carregando) {
    return (
      <div className="p-7 bg-[#f3f3f3] rounded-xl shadow-sm max-w-5xl mx-auto mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

    if (!produto) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-lg mb-4">Produto não encontrado</div>
                <p className="text-sm text-gray-500 mb-4">
                    ID da URL: {produtoId}
                </p>
                <Button 
                    name="Voltar" 
                    color="green" 
                    onClick={() => navigate('/admin/produtos')}
                />
            </div>
        );
    }

    return (
        <>
        {editmodal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Editar Produto
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Deseja editar o produto "{produto?.titulo}"? Você será redirecionado para a página de edição.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                name="Cancelar" 
                                color="blue" 
                                onClick={handleEditCancelExit}
                            />
                            <Button 
                                name="Editar" 
                                color="bggreen" 
                                onClick={handleEditConfirmExit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}
        {deletemodal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Confirmar Deleção
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Tem certeza que deseja excluir o produto "{produto?.titulo}"? Esta ação não pode ser desfeita.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                name="Cancelar" 
                                color="blue" 
                                onClick={handleDeleteCancel}
                            />
                            <Button 
                                name="Confirmar" 
                                color="bgred" 
                                onClick={handleDeleteConfirm}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <Button 
                    name="← Voltar" 
                    color="bggreen" 
                    onClick={() => navigate('/admin/produtos')}
                />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-200 rounded-lg min-h-64 max-h-96 overflow-hidden">
                        {produto.imagens && produto.imagens.length > 0 ? (
                            <img 
                                src={produto.imagens[0].url} 
                                alt={produto.titulo} 
                                className="w-full h-auto max-h-96 object-contain rounded-lg"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent) {
                                        parent.innerHTML = '<div class="h-64 flex items-center justify-center"><span class="text-gray-500">Erro ao carregar imagem</span></div>';
                                    }
                                }}
                            />
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <span className="text-gray-500">Imagem do produto</span>
                            </div>
                        )}
                    </div>

                    {/* Informações do produto */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {produto.titulo}
                        </h1>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-600">Preço:</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    R${produto.preco} 
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600">Estoque:</h3>
                                <p className="text-lg">{produto.quantidade}</p>
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-600">Material:</h3>
                                <p className="text-lg">{produto.material}</p>
                            </div>
                           
                        </div>

                        {/* Botões de ação */}
                        <div className="flex gap-4 mt-8">
                            <Button 
                                name="Editar Produto" 
                                color="blue" 
                                onClick={() => setEditModal(true)}
                            />
                            <Button 
                                name="Excluir Produto" 
                                color="red" 
                                onClick={() => setDeleteModal(true)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
        
}


export default DetalheProdutoPage;