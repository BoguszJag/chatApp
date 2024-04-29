import React from 'react'

type props = {
    buttonText: string;
    onClick: () => void;
    action: string
}

function FormButton({buttonText, onClick, action}: props) {
    return (
    <button className='w-2/3 shadow-md rounded-xl text-lg bg-gradient-to-r from-sky-500 to-green-200 hover:from-sky-600 hover:to-green-300 my-5' onClick={onClick} formAction={action} formMethod='POST'>{buttonText}</button>
  )
}

export default FormButton