import { Link } from "react-router-dom"
import Button from "../components/Button"
import TabelaProdutos from "./tabelapedidos"

function ProdutosPage(){
    return(
    <>
      <div className="flex flex-row justify-end w-full">
        <Link to="../adicionarproduto">
            <Button name="Adicionar Produto" color="green"></Button>
        </Link>
        {/* <Button name="Excluir"></Button> (TODO)*/}
      </div>
      <TabelaProdutos></TabelaProdutos>
    </>
    )
}
export default ProdutosPage