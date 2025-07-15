interface InputProps {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function InputText({placeholder, value, onChange, type} : InputProps){
    return(
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} name="frame" className="flex border-solid items-start px-2 justify-items-start p-2 text-start border-1 rounded-md w-full outline-0 shadow-sm"/> 
    )
}

export default InputText