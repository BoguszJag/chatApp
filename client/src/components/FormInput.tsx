import React, { ChangeEvent } from 'react'

type props = {
    inputValue: string;
    inputType: string;
    inputName: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

function FormInput({inputValue, inputType, inputName, placeholder, onChange}: props) {

  return (
    <input className='border-solid h-10 w-3/4 p-5 mb-5 caret-[#1e2124] bg-[#40444b] rounded-3xl focus:outline-none' onChange={(e) => onChange(e)} required placeholder={placeholder} value={inputValue} type={inputType} name={inputName}></input>
  )
}

export default FormInput