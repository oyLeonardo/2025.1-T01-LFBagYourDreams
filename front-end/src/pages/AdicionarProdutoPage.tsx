import InputText from "../components/InputText"
import Button from "../components/Button"
import { Link } from "react-router-dom"
function AdicionarProdutoPage(){
    return(
        <div className="w-full">
            <div className="p-2 flex justify-baseline">
                <h1>Detalhes do Produto</h1>
            </div>
            <form action="" className="flex flex-col h-full rounded-md bg-white p-10">
                
                <div className="flex gap-30 flex-row">
                    {/* esq */}
                    <div className="flex flex-col gap-3 w-full">
                        <div>
                            <label className="font-bold">Nome do Produto</label>
                            <InputText placeholder="testesse"></InputText>
                        </div>
                        <div>
                            <label className="font-bold">Descrição</label>
                            {/* input com h maior */}
                            <textarea placeholder="Lorem Ipsum Is A Dummy Text" name="frame" className="flex resize-none border-solid items-start  justify-items-start p-1 px-2 text-start border-1 rounded-md w-full h-40 outline-0"/>
                        </div>
                        <div>
                            <label className="font-bold">Categoria</label>
                            <InputText placeholder="Sneaker"></InputText>
                        </div>
                        <div className="flex flex-row gap-2">
                            <div className="w-full">
                                <label className="font-bold">Preço sla</label>
                                <InputText placeholder="Sneaker"></InputText>
                            </div>
                            <div className="w-full">
                                <label className="font-bold">Preço sla</label>
                                <InputText placeholder="Sneaker"></InputText>
                            </div>
                        </div>
                    </div>
                    {/* dir */}
                    <div className="w-full flex flex-col items-center">
                        <div className="w-80 rounded-2xl bg-gray-300 h-80">
                        </div>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-30 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-800 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm dark:text-gray-400"><span className="font-semibold text-gray-800 dark:text-gray-400">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-800 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </div> 
                        <InputText placeholder="testesse"></InputText>
                    </div>
                </div>
                <div className="flex justify-end gap-4 flex-row">
                    {/* TODO:     IMPLEMENTAR AQUI UMA FUNÇÃO DE CONFIRMAÇÃO DE SAÍDA */}
                    <Link to="../produtos">
                        <Button name="Cancelar" color="bgred" ></Button>
                    </Link>
                    <Button name="Salvar" type="submit" color="bggreen" ></Button> 
                    {/* todo: depois de salvar, link to para produtopage */}
                </div>
            </form>
            
        </div>
    )
}
export default AdicionarProdutoPage

