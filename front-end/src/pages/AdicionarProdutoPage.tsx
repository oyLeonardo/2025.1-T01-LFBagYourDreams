import InputText from "../components/InputText"
import Button from "../components/Button"
import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"

function AdicionarProdutoPage(){
    const navigate = useNavigate()
    
    // Estado para o modal de confirmação
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        descricao: '',
        categoria: 'Bolsa',
        preco: '',
        material: 'material1',
        cor: '',
        comprimento: '',
        altura: '',
        largura: '',
        imagem: null as File | null
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const [previewImage, setPreviewImage] = useState<string | null>(null);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        
        if (file) {
            setFormData(prev => ({
                ...prev,
                imagem: file
            }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Validação básica
        if (!formData.nome || !formData.preco) {
            alert('Nome e preço são obrigatórios!');
            return;
        }
        
        // Mostrar modal de confirmação
        setShowConfirmModal(true);
    };

    const handleConfirmSave = () => {
        // Salvar aqui os dados para a api
        console.log('Dados do produto:', formData);
        
        // Fechar modal e navegar
        setShowConfirmModal(false);
        navigate('/admin/produtos');
    };

    const handleCancelSave = () => {
        setShowConfirmModal(false);
    };

    return(
        <div className="w-full">
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
                                Confirmar Salvamento
                            </h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Deseja mesmo salvar as alterações? Todas as informações do produto serão salvas no sistema.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <Button 
                                    name="Cancelar" 
                                    color="bgred" 
                                    onClick={handleCancelSave}
                                />
                                <Button 
                                    name="Salvar" 
                                    color="bggreen" 
                                    onClick={handleConfirmSave}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-2 flex justify-baseline">
                <h1 className="text-2xl font-bold">Detalhes do Produto</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col h-full rounded-md bg-white p-10">
                <div className="flex gap-30 flex-row">
                    {/* esq */}
                    <div className="flex flex-col gap-3 w-full">
                        <div>
                            <label className="font-bold">Nome do Produto</label>
                            <InputText placeholder="Nome" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)}></InputText>
                        </div>
                        <div>
                            <label className="font-bold">Descrição</label>
                            {/* input com h maior */}
                            <textarea placeholder="Lorem Ipsum Is A Dummy Text" value={formData.descricao} onChange={(e) => handleInputChange('descricao', e.target.value)} className="flex resize-none border-solid items-start  justify-items-start p-1 px-2 text-start border-1 rounded-md w-full h-40 outline-0"/>
                        </div>
                        <div className="w-full">
                             <label className="font-bold" htmlFor="categoria">Categoria:</label>

                            <select value={formData.categoria} onChange={(e) => handleInputChange('categoria', e.target.value)} className="flex border-solid items-start px-2 justify-items-start p-2 text-start border-1 rounded-md w-full outline-0 shadow-sm" name="categoria" id="categoria">
                            <option value="Bolsa">Bolsa</option>
                            </select> 
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <label className="font-bold">Preço</label>
                                <InputText value={formData.preco} onChange={(e) => handleInputChange('preco', e.target.value)}  placeholder="Preço"></InputText>
                            </div>
                            <div className="w-full">
                                 <label className="font-bold" htmlFor="material">Material:</label>

                                <select value={formData.material} onChange={(e) => handleInputChange('material', e.target.value)} className="flex border-solid items-start px-2 justify-items-start p-2 text-start border-1 rounded-md w-full outline-0 shadow-sm" name="material" id="material">
                                <option value="material1">material1</option>
                                <option value="material2">material2</option>
                                <option value="material3">material3</option>
                                <option value="material4">material4</option>
                                </select> 
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Cor</label>
                                <InputText value={formData.cor} onChange={(e) => handleInputChange('cor', e.target.value)} placeholder="Cor"></InputText>
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Comprimento</label>
                                <InputText value={formData.comprimento} onChange={(e) => handleInputChange('comprimento', e.target.value)} placeholder="Comprimento"></InputText>
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Altura</label>
                                <InputText value={formData.altura} onChange={(e) => handleInputChange('altura', e.target.value)} placeholder="Altura"></InputText>
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Largura</label>
                                <InputText value={formData.largura} onChange={(e) => handleInputChange('largura', e.target.value)} placeholder="Largura"></InputText>
                            </div>
                        </div>
                    </div>
                    {/* dir */}
                    <div className="w-full flex flex-col items-center gap-10">
                        {/* Preview da imagem */}
                        <div className="w-80 rounded-2xl bg-gray-300 h-80 flex items-center justify-center overflow-hidden">
                            {previewImage ? (
                                <img 
                                    src={previewImage} 
                                    alt="Preview" 
                                    className="w-full h-full object-cover rounded-2xl"
                                />
                            ) : (
                                <span className="text-gray-500">Preview da imagem</span>
                            )}
                        </div>
                        
                        {/* Upload area */}
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm dark:text-gray-400">
                                        <span className="font-semibold text-gray-800 dark:text-gray-400">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-800 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
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
                    <Button name="Salvar" type="submit" color="bggreen" />
                </div>
            </form>
        </div>
    )
}
export default AdicionarProdutoPage

