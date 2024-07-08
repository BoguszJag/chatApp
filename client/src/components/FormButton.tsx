import React from 'react'

type props = {
    buttonText: string;
    onClick: () => void;
    action: string
}

function FormButton({buttonText, onClick, action}: props) {
    return (
    <button className='w-1/3 shadow-md rounded-3xl text-lg p-[2px] mb-5 bg-[#40444b] hover:bg-gray-400 hover:text-[#1e2124]' onClick={onClick} formAction={action} formMethod='POST'>{buttonText}</button>
  )
}

export default FormButton