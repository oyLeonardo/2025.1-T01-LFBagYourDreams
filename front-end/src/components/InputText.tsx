type InputProps = {
    placeholder: string;
}
function InputText({placeholder} : InputProps){
    return(
        <input type="text" placeholder={placeholder} name="frame" className="flex border-solid items-start px-2 justify-items-start p-2 text-start border-1 rounded-md w-full outline-0 shadow-sm"/> 
    )
}

export default InputText