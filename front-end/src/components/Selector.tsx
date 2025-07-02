import { useState } from "react";

type SelectorProps = {
  name: string;
  isActive: boolean;
  onClick: () => void;
};
function Selector({name,isActive,onClick} : SelectorProps) {
    const base = "flex rounded-md font-bold w-full py-2 pl-2 hover:cursor-pointer hover:bg-gray-300";
    const activeClass = isActive ? "bg-[#075336] text-white" : "bg-white text-black";
    return (
    <>
    <button className={`${base} ${activeClass}`} onClick={onClick}>
      {name}
    </button>
    </>
  )
}

export default Selector