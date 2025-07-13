import InputText from "../components/InputText"
import Button from "../components/Button"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import Alertas from "../components/Alertas"

function AdicionarProdutoPage(){
    const navigate = useNavigate()
    const { produtoId } = useParams<{ produtoId?: string }>();
    const isEditMode = Boolean(produtoId);
    
    const [carregando, setCarregando] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [alerta, setAlerta] = useState<{mensagem: string, tipo: 'info' | 'success' | 'warning' | 'error'} | null>(null);
    const [formData, setFormData] = useState({
        titulo: "",
        quantidade: "",
        descricao: "",
        categoria: "",
        preco: "",
        material: "",
        cor_padrao: "",
        comprimento: "",
        altura: "",
        largura: "",
        imagem: null as File | null
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Funções de validação com regex
    const handleTituloChange = (value: string) => {
        // Apenas letras, espaços e acentos (sem números ou caracteres especiais)
        const regex = /^[a-zA-ZÀ-ÿ\s]*$/;
        if (regex.test(value) || value === '') {
            handleInputChange('titulo', value);
        }
    };

    const handlePrecoChange = (value: string) => {
        // Apenas números e um ponto decimal (formato: 123.45)
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value) || value === '') {
            handleInputChange('preco', value);
        }
    };

    const handleQuantidadeChange = (value: string) => {
        // Apenas números inteiros maiores que 0
        const regex = /^[1-9]\d*$/;
        if (regex.test(value) || value === '') {
            handleInputChange('quantidade', value);
        }
    };

    const handleDimensaoChange = (field: string, value: string) => {
        // Apenas números decimais positivos (formato: 123.45)
        const regex = /^\d*\.?\d*$/;
        if (regex.test(value) || value === '') {
            handleInputChange(field, value);
        }
    };

    const handleCorChange = (value: string) => {
        // Apenas letras, espaços e acentos (para cores como "Marrom Escuro")
        const regex = /^[a-zA-ZÀ-ÿ\s]*$/;
        if (regex.test(value) || value === '') {
            handleInputChange('cor_padrao', value);
        }
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [imagemRemovidaManualmente, setImagemRemovidaManualmente] = useState(false);
    
    // Carregar dados do produto para edição
    useEffect(() => {
        if (isEditMode && produtoId) {
            const carregarProduto = async () => {
                try {
                    setCarregando(true);
                    const response = await fetch(`http://localhost:8000/api/product/${produtoId}`);
                    
                    if (response.ok) {
                        const produto = await response.json();
                        setFormData({
                            titulo: produto.titulo || "",
                            quantidade: produto.quantidade?.toString() || "",
                            descricao: produto.descricao || "",
                            categoria: produto.categoria || "",
                            preco: produto.preco?.toString() || "",
                            material: produto.material || "",
                            cor_padrao: produto.cor_padrao || "",
                            comprimento: produto.comprimento?.toString() || "",
                            altura: produto.altura?.toString() || "",
                            largura: produto.largura?.toString() || "",
                            imagem: null // Não carregamos a imagem existente no form
                        });
                        
                        // Se houver imagem, mostrar preview
                        if (produto.imagens && produto.imagens.length > 0) {
                            setPreviewImage(produto.imagens[0].url);
                        }
                    } else {
                        setAlerta({
                            mensagem: 'Erro ao carregar dados do produto',
                            tipo: 'error'
                        });
                    }
                } catch (error) {
                    console.error('Erro ao carregar produto:', error);
                    setAlerta({
                        mensagem: 'Erro ao carregar dados do produto',
                        tipo: 'error'
                    });
                } finally {
                    setCarregando(false);
                }
            };
            
            carregarProduto();
        }
    }, [isEditMode, produtoId]);
    
    const [previewImageFile, setPreviewImageFile] = useState<string | null>(null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            setFormData(prev => ({
                ...prev,
                imagem: file
            }));
            console.log('Nova imagem selecionada:', file);
            // Limpar a imagem existente quando uma nova for selecionada
            setPreviewImage(null);
            setImagemRemovidaManualmente(false); // Reset do flag de remoção manual
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImageFile(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Limpar alertas anteriores
        setAlerta(null);
        
        // Validação mais robusta com regex
        const erros = [];
        
        // Validar título (apenas letras, espaços e acentos)
        const tituloRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
        if (!formData.titulo.trim()) {
            erros.push('Título é obrigatório');
        } else if (!tituloRegex.test(formData.titulo.trim())) {
            erros.push('Título deve conter apenas letras e espaços');
        }
        
        // Validar preço (números decimais positivos)
        const precoRegex = /^\d+(\.\d{1,2})?$/;
        if (!formData.preco) {
            erros.push('Preço é obrigatório');
        } else if (!precoRegex.test(formData.preco) || parseFloat(formData.preco) <= 0) {
            erros.push('Preço deve ser um valor válido maior que zero (ex: 89.90)');
        }
        
        // Validar quantidade (números inteiros maiores que 0)
        const quantidadeRegex = /^[1-9]\d*$/;
        if (!formData.quantidade) {
            erros.push('Quantidade é obrigatória');
        } else if (!quantidadeRegex.test(formData.quantidade)) {
            erros.push('Quantidade deve ser um número inteiro maior que zero');
        }
        
        if (!formData.categoria) erros.push('Categoria é obrigatória');
        if (!formData.material) erros.push('Material é obrigatório');
        
        // Para criação, imagem é obrigatória. Para edição, só se não houver imagem existente
        if (!isEditMode && !formData.imagem) {
            erros.push('Imagem é obrigatória');
        } else if (isEditMode && !formData.imagem && !previewImage) {
            erros.push('Imagem é obrigatória');
        }
        
        // Validar dimensões (se preenchidas, devem ser números decimais positivos)
        const dimensaoRegex = /^\d*\.?\d+$/;
        if (formData.comprimento && !dimensaoRegex.test(formData.comprimento)) {
            erros.push('Comprimento deve ser um número válido (ex: 25.5)');
        }
        if (formData.altura && !dimensaoRegex.test(formData.altura)) {
            erros.push('Altura deve ser um número válido (ex: 15.0)');
        }
        if (formData.largura && !dimensaoRegex.test(formData.largura)) {
            erros.push('Largura deve ser um número válido (ex: 8.5)');
        }
        
        if (erros.length > 0) {
            setAlerta({
                mensagem: `Erros encontrados: ${erros.join(', ')}`,
                tipo: 'error'
            });
            return;
        }
        
        // Mostrar modal de confirmação
        setShowConfirmModal(true);
    };

    const handleConfirmSave = async () => {
        try {
            setShowConfirmModal(false);
            setCarregando(true);
            
            // Preparar dados para envio (sem imagem)
            const dadosParaEnvio = {
                titulo: formData.titulo,
                quantidade: parseInt(formData.quantidade) || 1,
                descricao: formData.descricao,
                categoria: formData.categoria,
                preco: parseFloat(formData.preco) || 0,
                material: formData.material,
                cor_padrao: formData.cor_padrao,
                comprimento: formData.comprimento ? parseFloat(formData.comprimento) : null,
                altura: formData.altura ? parseFloat(formData.altura) : null,
                largura: formData.largura ? parseFloat(formData.largura) : null,
            };

            console.log('Dados para envio:', dadosParaEnvio);
            console.log('Nova imagem selecionada:', !!formData.imagem);
            console.log('Imagem existente preservada:', !!previewImage && !formData.imagem);
            console.log('Imagem removida manualmente:', imagemRemovidaManualmente);
            let response;
            
            // Determinar URL e método baseado no modo
            const url = isEditMode 
                ? `http://localhost:8000/api/product/${produtoId}/`
                : 'http://localhost:8000/api/products/';
            const method = isEditMode ? 'PUT' : 'POST';
            
            console.log('🌐 INFORMAÇÕES DA API:');
            console.log('  📍 URL:', url);
            console.log('  🔧 Método:', method);
            console.log('  📝 Modo:', isEditMode ? 'EDIÇÃO' : 'CRIAÇÃO');
            console.log('  🆔 Produto ID:', produtoId || 'N/A');
            
            // Usar FormData quando:
            // 1. Nova imagem foi selecionada (para criar ou substituir)
            // 2. Estamos criando um produto novo (obrigatório ter imagem)
            // 3. Imagem foi removida manualmente (para indicar remoção)
            if (formData.imagem || !isEditMode || imagemRemovidaManualmente) {
                const formDataToSend = new FormData();
                
                Object.entries(dadosParaEnvio).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        formDataToSend.append(key, value.toString());
                    }
                });
                
                // Adicionar nova imagem (substitui a existente)
                if (formData.imagem) {
                    formDataToSend.append('imagens', formData.imagem);
                    console.log('Enviando nova imagem para substituir a existente');
                    console.log('Nova imagem selecionada:', formData.imagem);
                    console.log('datatosend:', formDataToSend.get('imagens'));
                }
                // Sinalizar remoção de imagem existente
                else if (imagemRemovidaManualmente) {
                    formDataToSend.append('remover_imagem', 'true');
                    console.log('Sinalizando remoção da imagem existente');
                }
                
                console.log(`🚀 FAZENDO REQUISIÇÃO ${method}:`);
                console.log('  📍 URL:', url);
                console.log('  📦 Tipo de dados: FormData (com imagem)');
                console.log('  🖼️ Contém imagem:', !!formData.imagem);
                
                // Log detalhado do FormData
                console.log('  📋 CONTEÚDO DO FORMDATA:');
                for (let pair of formDataToSend.entries()) {
                    if (pair[0] === 'imagem' && pair[1] instanceof File) {
                        console.log(`    ${pair[0]}:`, pair[1], `(${pair[1].name}, ${pair[1].size} bytes)`);
                    } else {
                        console.log(`    ${pair[0]}:`, pair[1]);
                    }
                }
                
                response = await fetch(url, {
                    method: method,
                    body: formDataToSend
                });
            } else {
                console.log(`🚀 FAZENDO REQUISIÇÃO ${method}:`);
                console.log('  📍 URL:', url);
                console.log('  📦 Tipo de dados: JSON (sem imagem)');
                console.log('  💾 Mantendo imagem existente');
                
                // Modo edição sem nova imagem - mantém a imagem existente
                response = await fetch(url, {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dadosParaEnvio)
                });
            }

            if (response.ok) {
                const resultado = await response.json();
                console.log(`✅ SUCESSO - Requisição ${method} completada:`);
                console.log('  📍 URL usada:', url);
                console.log('  📊 Status:', response.status);
                console.log('  📝 Resultado:', resultado);
                console.log(`Produto ${isEditMode ? 'atualizado' : 'criado'}:`, resultado);
                setAlerta({
                    mensagem: `Produto ${isEditMode ? 'atualizado' : 'adicionado'} com sucesso!`,
                    tipo: 'success'
                });
                setTimeout(() => {
                    setShowConfirmModal(false);
                    navigate('/admin/produtos');
                }, 2000);
            } else {
                const errorData = await response.text();
                console.error(`❌ ERRO - Requisição ${method} falhou:`);
                console.error('  📍 URL usada:', url);
                console.error('  📊 Status:', response.status);
                console.error('  📄 Resposta:', errorData);
                console.error('Erro na resposta:', errorData);
                throw new Error(`Erro ${response.status}: ${errorData}`);
            }
        } catch (error) {
            console.error(`Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto:`, error);
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            setAlerta({
                mensagem: `Erro ao ${isEditMode ? 'atualizar' : 'adicionar'} produto: ${errorMessage}`,
                tipo: 'error'
            });
        } finally {
            setCarregando(false);
        }
    };

    const handleCancelSave = () => {
        setShowConfirmModal(false);
    };

    return(
        <div className="w-full">
            {/* Alertas */}
            {alerta && (
                <Alertas 
                    mensagem={alerta.mensagem} 
                    tipo={alerta.tipo}
                    onClose={() => setAlerta(null)}
                />
            )}

            {/* Modal de Confirmação */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-inherit backdrop-blur-sm bg-opacity-35 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Confirmar {isEditMode ? 'Atualização' : 'Salvamento'}
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Deseja mesmo {isEditMode ? 'atualizar' : 'salvar'} as alterações? Todas as informações do produto serão {isEditMode ? 'atualizadas' : 'salvas'} no sistema.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button 
                                    name="Cancelar" 
                                    color="bgred" 
                                    onClick={handleCancelSave}
                                />
                                <Button 
                                    name={carregando ? (isEditMode ? "Atualizando..." : "Salvando...") : (isEditMode ? "Atualizar" : "Salvar")} 
                                    color="bggreen" 
                                    onClick={handleConfirmSave}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-2 flex justify-baseline">
                <h1 className="text-2xl font-bold">{isEditMode ? 'Editar Produto' : 'Detalhes do Produto'}</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col h-full rounded-md bg-white p-10">
                <div className="flex gap-30 flex-row">
                    {/* esq */}
                    <div className="flex flex-col gap-3 w-full">
                        <div>
                            <label className="font-bold">Nome do Produto</label>
                            <InputText 
                                placeholder="Ex: Bolsa de Couro Elegante" 
                                value={formData.titulo} 
                                onChange={(e) => handleTituloChange(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-bold">Descrição</label>
                            {/* input com h maior */}
                            <textarea placeholder="Lorem Ipsum Is A Dummy Text" value={formData.descricao} onChange={(e) => handleInputChange('descricao', e.target.value)} className="flex resize-none border-solid items-start  justify-items-start p-1 px-2 text-start border-1 rounded-md w-full h-40 outline-0"/>
                        </div>
                        <div className="w-full">
                             <label className="font-bold" htmlFor="categoria">Categoria:</label>

                            <select value={formData.categoria} onChange={(e) => handleInputChange('categoria', e.target.value)} className="flex border-solid items-start px-2 justify-items-start p-2 text-start border-1 rounded-md w-full outline-0 shadow-sm" name="categoria" id="categoria">
                            <option value="">Selecione uma categoria</option>
                            <option value="masculino">Masculino</option>
                            <option value="feminino">Feminino</option>
                            <option value="infantil">Infantil</option>
                            <option value="termicas">Térmicas</option>
                            </select> 
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <label className="font-bold">Preço (R$)</label>
                                <InputText 
                                    value={formData.preco} 
                                    onChange={(e) => handlePrecoChange(e.target.value)} 
                                    placeholder="Ex: 89.90"
                                />
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Quantidade (estoque)</label>
                                <InputText 
                                    value={formData.quantidade} 
                                    onChange={(e) => handleQuantidadeChange(e.target.value)} 
                                    placeholder="Ex: 10"
                                />
                            </div>
                            <div className="w-full">
                                 <label className="font-bold" htmlFor="material">Material:</label>

                                <select value={formData.material} onChange={(e) => handleInputChange('material', e.target.value)} className="flex border-solid items-start px-2 justify-items-start p-2 text-start border-1 rounded-md w-full outline-0 shadow-sm" name="material" id="material">
                                <option value="">Selecione um material</option>
                                <option value="Couro">Couro</option>
                                <option value="Tecido">Tecido</option>
                                <option value="Sintético">Sintético</option>
                                <option value="Lona">Lona</option>
                                </select> 
                            </div>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <label className="font-bold">Cor</label>
                                <InputText 
                                    value={formData.cor_padrao} 
                                    onChange={(e) => handleCorChange(e.target.value)} 
                                    placeholder="Ex: Marrom Escuro"
                                />
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Comprimento(cm)</label>
                                <InputText 
                                    value={formData.comprimento} 
                                    onChange={(e) => handleDimensaoChange('comprimento', e.target.value)} 
                                    placeholder="Ex: 25.5"
                                />
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Altura(cm)</label>
                                <InputText 
                                    value={formData.altura} 
                                    onChange={(e) => handleDimensaoChange('altura', e.target.value)} 
                                    placeholder="Ex: 15.0"
                                />
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Largura(cm)</label>
                                <InputText 
                                    value={formData.largura} 
                                    onChange={(e) => handleDimensaoChange('largura', e.target.value)} 
                                    placeholder="Ex: 8.5"
                                />
                            </div>
                        </div>
                    </div>
                    {/* dir */}
                    <div className="w-full flex flex-col items-center gap-10">
                        {/* Preview da imagem */}
                        <div className="w-80 rounded-2xl bg-gray-300 h-80 flex items-center justify-center overflow-hidden relative">
                            {(previewImageFile || previewImage) ? (
                                <>
                                    <img 
                                        src={previewImageFile || previewImage || ""} 
                                        alt="Preview" 
                                        className="w-full h-full object-cover rounded-2xl"
                                    />
                                    
                                    {/* Indicador de nova imagem */}
                                    {previewImageFile && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            NOVA
                                        </div>
                                    )}
                                    
                                    {/* Botão para remover nova imagem selecionada */}
                                    {previewImageFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImageFile(null);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    imagem: null
                                                }));
                                                // Reset do input file
                                                const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                                                if (fileInput) {
                                                    fileInput.value = '';
                                                }
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                            title="Cancelar nova imagem"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                    
                                    {/* Botão para remover imagem existente (só aparece se não há nova imagem) */}
                                    {isEditMode && previewImage && !previewImageFile && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setPreviewImage(null);
                                                setImagemRemovidaManualmente(true);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    imagem: null
                                                }));
                                            }}
                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                                            title="Remover imagem atual"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <span className="text-gray-500">Preview da imagem</span>
                            )}
                        </div>
                        
                        {/* Upload area */}
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm dark:text-gray-400">
                                        <span className="font-semibold text-gray-800 dark:text-gray-400">
                                            {isEditMode ? 'Alterar imagem (opcional)' : 'Click to upload'}
                                        </span> 
                                        {!isEditMode && ' or drag and drop'}
                                    </p>
                                    <p className="text-xs text-gray-800 dark:text-gray-400">
                                        {isEditMode 
                                            ? 'Deixe em branco para manter a imagem atual'
                                            : 'SVG, PNG, JPG or GIF (MAX. 800x400px)'
                                        }
                                    </p>
                                </div>
                                <input 
                                    id="dropzone-file" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </label>
                        </div> 
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 flex-row mt-8">
                    <Link to="../produtos">
                        <Button name="Cancelar" color="bgred" />
                    </Link>
                    <Button name={isEditMode ? "Atualizar" : "Salvar"} type="submit" color="bggreen" />
                </div>
            </form>
        </div>
    )
}
export default AdicionarProdutoPage

