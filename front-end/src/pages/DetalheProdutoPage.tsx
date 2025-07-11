import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { defaultData, type Product } from '../__mocks__/datamockadaprodutos';
import Button from '../components/Button';

function DetalheProdutoPage() {
    const { produtoId } = useParams<{ produtoId: string }>();
    const navigate = useNavigate();
    const [produto, setProduto] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [editmodal, setEditModal] = useState(false);
    const handleCancelExit = () => {
        setEditModal(false); // Fecha o modal sem sair
    }

    const handleConfirmExit = () => {
        setEditModal(false);
        navigate('/'); // Redireciona para a página inicial
    }

    useEffect(() => {
        if (!produtoId) {
            setLoading(false);
            return;
        }

        try {
            // Decodifica o produtoId de Base64
            const produtoDecodificado = atob(produtoId);
            console.log('Produto decodificado:', produtoDecodificado);
            
            // Buscar o produto pelos dados mockados
            const produtoEncontrado = defaultData.find(
                p => p.produto === produtoDecodificado
            );
            
            console.log('Produto encontrado:', produtoEncontrado);
            setProduto(produtoEncontrado || null);
        } catch (error) {
            console.error('Erro ao decodificar Base64:', error);
            setProduto(null);
        }
        
        setLoading(false);
    }, [produtoId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Carregando...</div>
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
            <div className="fixed inset-0 bg-inherit bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Confirmar Saída
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Tem certeza que deseja sair do painel administrativo? Você será redirecionado para a página inicial.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button 
                                name="Cancelar" 
                                color="blue" 
                                onClick={handleCancelExit}
                            />
                            <Button 
                                name="Sair" 
                                color="bgred" 
                                onClick={handleConfirmExit}
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
                    {/* Imagem do produto */}
                    <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
                        <span className="text-gray-500">Imagem do produto</span>
                    </div>

                    {/* Informações do produto */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {produto.produto}
                        </h1>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-600">Preço:</h3>
                                <p className="text-2xl font-bold text-green-600">
                                    {produto.preco} R$
                                </p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600">Estoque:</h3>
                                <p className="text-lg">{produto.estoque}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600">Status:</h3>
                                <span className={`px-2 py-1 rounded text-sm ${
                                    produto.status === 'Ativo' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {produto.status}
                                </span>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600">Data:</h3>
                                <p className="text-lg">{produto.data}</p>
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
                                onClick={() => {
                                    if (confirm('Tem certeza que deseja excluir este produto?')) {
                                        // Lógica para excluir (chamada API)
                                        navigate('/admin/produtos');
                                    }
                                }}
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