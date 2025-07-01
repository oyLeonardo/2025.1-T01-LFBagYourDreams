import { Link } from "react-router-dom"
import Button from "../components/Button"
function ProdutosPage(){
    return(
        <>
      <div className="flex flex-row justify-between bg-blue-300 w-full">
        <h1>PRODUTOS</h1>
        {/* vamos colocar aqui datas da nossa tabela (intervalos) */}
        <h2>exemploaaa</h2>
      </div>
      <div className="flex flex-row justify-end bg-green-300 w-full">
        <Link to="../adicionarproduto">
            <Button name="Adicionar Produto" color="green"></Button>
        </Link>
        {/* <Button name="Excluir"></Button> (TODO)*/}
      </div>
    </>
    )
}
export default ProdutosPage