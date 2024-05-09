import React from 'react'

type props = {
    buttonText: string,
    onClickCancel: () => void
}

function InvitationCancelButton({buttonText, onClickCancel}: props) {
  return (
    <div>
      <button onClick={() => onClickCancel()} className='px-3 ml-3 border-[1px] border-gray-400 hover:border-black bg-slate-200 hover:bg-red-800 text-black rounded'>{buttonText}</button>
    </div>
  )
}

export default InvitationCancelButton
