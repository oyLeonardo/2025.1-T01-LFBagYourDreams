import Button from "../components/Button"
import { useState } from "react"
import Selector from "../components/Selector"
import { Link,Outlet } from "react-router-dom"
function AdminPage() {
    const[active,setActive] = useState("pedidos")
    return (
    <>
    <div className="flex flex-row flex-grow justify-between">
      {/* tab lateral esquerda */}
      <div className="flex flex-col w-60 px-3 bg-white">
        <div className="flex items-center h-32 justify-center mb-10">
        {/* aqui vai ter a nossa logo */}
        LOGO
        </div>
        <Link to="pedidos">
        <Selector
          name="PEDIDOS"
          isActive={active === "pedidos"}
          onClick={() => setActive("pedidos")}
        />
        </Link>
        <Link to="produtos">
          <Selector
            name="PRODUTOS"
            isActive={active === "produtos"}
            onClick={() => setActive("produtos")}
          />
        </Link>
      </div>
      <div className="flex flex-col flex-grow">
        {/* header */}
        <div className="flex justify-end items-center bg-white h-30 p-4 shadow-md"> 
          <div className="flex mr-4">
            <Button name="ADMIN"></Button>
          </div>
        </div>

        <main className="flex-grow p-10 bg-gray-200">
          <Outlet/> 
        </main>
      </div>
    </div>
    
    </>
  )
}

export default AdminPage