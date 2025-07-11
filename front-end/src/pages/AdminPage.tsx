import Button from "../components/Button"
import { useEffect, useState } from "react"
import Selector from "../components/Selector"
import { Link,Outlet, useLocation, useNavigate } from "react-router-dom"

function AdminPage() {
    const[active,setActive] = useState("pedidos")
    const location = useLocation()
    const navigate = useNavigate()
    const[showExitModal, setShowExitModal] = useState(false); // Modal de confirmação de saída

    const handleSairClick = () => {
        setShowExitModal(true); // Mostra o modal de confirmação
    }

    const handleConfirmExit = () => {
        // Aqui você pode adicionar a lógica de logout, como limpar o token de autenticação
        setShowExitModal(false);
        navigate('/');
    }

    const handleCancelExit = () => {
        setShowExitModal(false); // Fecha o modal sem sair
    }

    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const currentPathSegment = pathSegments[pathSegments.length - 1];

        if (currentPathSegment === 'pedidos') {
            setActive('pedidos');
        } else if (currentPathSegment === 'produtos' || currentPathSegment === 'adicionarproduto') {
            // Mantém "produtos" ativo tanto na página de produtos quanto na de adicionar produto
            setActive('produtos');
        } else if (currentPathSegment === 'admin' || currentPathSegment === '') {
            // Se a URL for apenas /admin, redireciona para o padrão
            setActive('pedidos');
            navigate('/admin/pedidos', { replace: true });
        }
    }, [location.pathname, navigate]);
    
    return (
    <>
        {/* Modal de Confirmação de Saída */}
        {showExitModal && (
            <div className="fixed inset-0 bg-inherit bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
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

        <div className="flex flex-row flex-grow justify-between">
            {/* tab lateral esquerda */}
            <div className="flex flex-col w-60 px-3 bg-white">
                <div className="flex items-center h-32 justify-center mb-10">
                    {/* aqui vai ter a nossa logo */}
                    <h1 className="text-4xl md:text-md font-black text-[#032719] mb-4">
                        <span className="text-[#034722]">ADMIN</span>
                    </h1>
                </div>
                <Link to="pedidos" className="mb-1">
                    <Selector
                        name="PEDIDOS"
                        isActive={active === "pedidos"}
                        onClick={() => setActive("pedidos")} // Mantém para o CSS
                    />
                </Link>
                <Link to="produtos">
                    <Selector
                        name="PRODUTOS"
                        isActive={active === "produtos"}
                        onClick={() => setActive("produtos")} // Mantém para o CSS
                    />
                </Link>
            </div>
            
            <div className="flex flex-col flex-grow">
                {/* header */}
                <div className="flex justify-end items-center bg-white h-30 p-4 shadow-md"> 
                    <div className="flex mr-4">
                        <Button color="bgred" name="Sair" onClick={handleSairClick} type="button" />
                    </div>
                </div>

                <main className="flex-grow p-2 h-screen bg-gray-200">
                    <Outlet/> 
                </main>
            </div>
        </div>
    </>
    )
}

export default AdminPage