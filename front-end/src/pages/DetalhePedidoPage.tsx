import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from "../components/Button";
import apiClient from '../api';
import Alertas from '../components/Alertas';
interface Pedido {
  id: number;
  email_usuario: string;
  status: string;
  valor_total: number;
  cep: string;
  bairro: string;
  estado: string;
  cidade: string;
  numero: string;
  metodo_pagamento: string;
  frete: number;
  send_mail: string;
}

function DetalhePedidoPage() {
    const { pedidoId } = useParams<{ pedidoId: string }>();
    const navigate = useNavigate();
    const [pedido, setPedido] = useState<Pedido | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [editmodal, setEditModal] = useState(false);
    const [alerta, setAlerta] = useState<{mensagem: string, tipo: 'info' | 'success' | 'warning' | 'error'} | null>(null);
    const [formData, setFormData] = useState({
        id: "",
        email_usuario: "",
        status: "",
        valor_total: 0,
        cep: "",
        bairro: "",
        estado: "",
        cidade: "",
        numero: "",
        metodo_pagamento: "",
        frete: 0,
        send_mail: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleEditCancel = () => {
    setEditModal(false); 
    };

    const fetchPedido = async () => {
        setCarregando(true);
        try {
            const response = await apiClient.get<Pedido>(`/order/${pedidoId}/`);
            setPedido(response.data);
            
            setFormData({
                id: response.data.id.toString(),
                email_usuario: response.data.email_usuario,
                status: response.data.status,
                valor_total: response.data.valor_total,
                cep: response.data.cep,
                bairro: response.data.bairro,
                estado: response.data.estado,
                cidade: response.data.cidade,
                numero: response.data.numero,
                metodo_pagamento: response.data.metodo_pagamento,
                frete: response.data.frete,
                send_mail: response.data.email_usuario,
            });
        } catch (error) {
            console.error('Erro ao buscar pedido:', error);
            setPedido(null); 
        } finally {
            setCarregando(false);
        }
    };

    const handleEditConfirm = async () => {
        setAlerta(null);
        setCarregando(true);
        try {
            await apiClient.put(`/order/${pedidoId}/`, formData);
            
            await fetchPedido();
            
            setAlerta({
                mensagem: 'Pedido atualizado com sucesso!',
                tipo: 'success',
            });
            
            console.log('Pedido atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            setAlerta({
                mensagem: 'Erro ao atualizar pedido',
                tipo: 'error',
            });
        } finally {
            setEditModal(false);
        }
    };

    useEffect(() => {
        if (!pedidoId) {
            setCarregando(false);
            return;
        }

        fetchPedido();
    }, [pedidoId]);
    if (carregando) {
    return (
      <div className="p-7 bg-[#f3f3f3] rounded-xl shadow-sm max-w-5xl mx-auto mt-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (!pedido) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="text-lg mb-4">Pedido não encontrado</div>
                <p className="text-sm text-gray-500 mb-4">
                    ID da URL: {pedidoId}
                </p>
                <Button 
                    name="Voltar" 
                    color="green" 
                    onClick={() => navigate('/admin/pedidos')}
                />
            </div>
        );
    }

  return (
    <>
    {alerta && (
        <Alertas 
            mensagem={alerta.mensagem} 
            tipo={alerta.tipo}
            onClose={() => setAlerta(null)}
        />
    )}
    {editmodal && (
            <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Editar pedido "{pedido?.id}"
                        </h3>
                        <form>
                            <h3>Selecione um status:</h3>
                        <select value={formData.status} onChange={(e) => handleInputChange('status', e.target.value)} className="flex border-solid items-start px-2 justify-items-start p-2 mb-3 text-start border-1 rounded-md w-full outline-0 shadow-sm" name="status" id="status">
                            <option value="cancelado">Cancelado</option>
                            <option value="processando">Processando</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregue">Entregue</option>
                            </select> 
                        <div className="flex gap-4 justify-center">
                            <Button 
                                name="Cancelar" 
                                color="blue" 
                                onClick={handleEditCancel}
                            />
                            <Button 
                                type='submit'
                                name="Confirmar" 
                                color="bggreen" 
                                onClick={handleEditConfirm}
                            />
                            
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        


    <div className="container mx-auto p-6">
            <div className="mb-6">
                <Button 
                    name="← Voltar" 
                    color="bggreen" 
                    onClick={() => navigate('/admin/pedidos')}
                />
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
                {/* Cabeçalho do pedido */}
                <div className="border-b border-gray-200 pb-6 mb-8">
                    <div className='flex flex-row gap-10'>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Pedido #{pedido?.id}
                        </h1>
                        <div className="flex gap-4">
                        <Button 
                            name="Editar Status" 
                            color="blue" 
                            onClick={() => setEditModal(true)}
                        />
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            pedido?.status === 'entregue' ? 'bg-green-100 text-green-800' :
                            pedido?.status === 'enviado' ? 'bg-blue-100 text-blue-800' :
                            pedido?.status === 'processando' ? 'bg-yellow-100 text-yellow-800' :
                            pedido?.status === 'cancelado' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                            {pedido?.status}
                        </span>
                    </div>
                    
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Informações Financeiras */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 pb-2">
                            Informações Financeiras
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="bg-green-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-600 mb-1">Valor Total</h3>
                                <p className="text-3xl font-bold text-green-600">
                                    R$ {pedido?.valor_total?.toLocaleString('pt-BR', { 
                                        minimumFractionDigits: 2, 
                                        maximumFractionDigits: 2 
                                    })}
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-600 mb-1">Frete</h3>
                                    <p className="text-xl font-bold text-blue-600">
                                        R$ {pedido?.frete?.toLocaleString('pt-BR', { 
                                            minimumFractionDigits: 2, 
                                            maximumFractionDigits: 2 
                                        })}
                                    </p>
                                </div>
                                
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <h3 className="font-semibold text-gray-600 mb-1">Método de Pagamento</h3>
                                    <p className="text-lg font-medium text-purple-600">
                                        {pedido?.metodo_pagamento}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 pb-2">
                            Informações do Cliente
                        </h2>
                        
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-semibold text-gray-600 mb-2">Email do Cliente</h3>
                                <p className="text-lg text-gray-800">{pedido?.email_usuario}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Endereço de Entrega */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6  pb-2">
                        Endereço de Entrega
                    </h2>
                    
                    <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-1">CEP</h3>
                                <p className="text-lg text-gray-800">{pedido?.cep}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-1">Cidade</h3>
                                <p className="text-lg text-gray-800">{pedido?.cidade}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-1">Estado</h3>
                                <p className="text-lg text-gray-800">{pedido?.estado}</p>
                            </div>
                            
                            <div>
                                <h3 className="font-semibold text-gray-600 mb-1">Bairro</h3>
                                <p className="text-lg text-gray-800">{pedido?.bairro}</p>
                            </div>
                        </div>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold text-gray-600 mb-1">Número</h3>
                            <p className="text-lg text-gray-800">{pedido?.numero}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
  );
}

export default DetalhePedidoPage;