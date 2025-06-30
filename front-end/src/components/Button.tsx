type ButtonProps = {
    name: string;

}
function Button({name} : ButtonProps) {
    return (
    <>
    <button className={`flex justify-center border-solid border-2 border-green-500 py-1 px-6 text-green-500 font-bold h-10 rounded hover:cursor-pointer hover:bg-green-500 hover:text-white`}>
      {name}
    </button>
    </>
  )
}

export default Button