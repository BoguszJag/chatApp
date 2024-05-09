import React from 'react'

type props = {
    buttonText: string,
    onClickAddContact: () => void
}

function InvitationButton({buttonText, onClickAddContact}: props) {
  return (
    <div>
      <button onClick={() => onClickAddContact()} className='px-3 ml-3 border-[1px] border-gray-400 hover:bg-green-600 hover:border-black rounded'>{buttonText}</button>
    </div>
  )
}

export default InvitationButton
