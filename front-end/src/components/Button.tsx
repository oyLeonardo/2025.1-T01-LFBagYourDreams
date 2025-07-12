type ButtonProps = {
    name: string;
    color: keyof typeof colors;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
  }
const colors = {   
     black: "bg-black text-white",
     blue: "text-blue-500 hover:bg-blue-500 border-blue-500",    
     red: "text-red-500 hover:bg-red-500 border-red-500",
     green: "text-[#075336] hover:bg-[#075336] border-[#075336]",
     bggreen: "text-white bg-[#075336] hover:bg-[#075336] border-[#075336]",
     bgblue: "text-white bg-blue-700 hover:bg-blue-800 border-blue-500",
     bgred: "text-white bg-red-700 hover:bg-red-800 border-red-500"
    };
function Button({name,color,onClick,type="button"} : ButtonProps) {
  // safelist para cores na classe

  return (
    <>
    <button onClick={onClick} type={type} className={`${colors[color]} flex justify-center border-solid border-2  py-1 px-6 font-bold h-10 rounded-sm hover:cursor-pointer hover:text-white outline-0`}>
      {name}
    </button>
    </>
  )
}

export default Button