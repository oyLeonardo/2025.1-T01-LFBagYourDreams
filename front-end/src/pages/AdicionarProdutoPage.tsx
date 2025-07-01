import InputText from "../components/InputText"
import Button from "../components/Button"
import { Link } from "react-router-dom"
function AdicionarProdutoPage(){
    return(
        <div className="h-screen w-full">
            <div className="p-2 flex justify-baseline">
                <h1>Detalhes do Produto</h1>
            </div>
            <form action="" className="flex flex-col h-full rounded-md bg-white p-5 ">
                
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
                            <textarea placeholder="Lorem Ipsum Is A Dummy Text" name="frame" className="flex border-solid items-start  justify-items-start p-1 px-2 text-start border-1 rounded-md w-full h-40 outline-0"/>
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
                        <div className="w-80 rounded-2xl bg-gray-300 h-80"></div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:cursor-pointer">
                            <p className="text-gray-500">Drop your image here, or browse</p>
                            <p className="text-gray-400 text-sm mt-1">Jpeg, png are allowed</p>
                            <input type="file" className="sr-only"/>
                        </div>
                        <InputText placeholder="testesse"></InputText>
                    </div>
                </div>
                <div className="h-full">

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

