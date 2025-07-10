import { Link, useNavigate } from "react-router-dom"
import Button from "../components/Button"
import TabelaProdutos from "../components/TabelaProdutos"

function ProdutosPage(){
  const navigate = useNavigate();
    
    const handleAddProduct = () => {
        navigate('../adicionarproduto');
    };
    return(
    <>
      <div className="flex flex-row justify-end w-full m-0 mt-2" >
        <Button name="Adicionar Produto" color="green" onClick={handleAddProduct}></Button>
      </div>
      <TabelaProdutos></TabelaProdutos>
    </>
    )
}
export default ProdutosPage