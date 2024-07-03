import React from 'react'

type props = {
    buttonText: string,
    onClickAddContact: () => void
}

function InvitationButton({buttonText, onClickAddContact}: props) {
  return (
    <div>
      <button onClick={() => onClickAddContact()} className='px-2 ml-3 border border-[#40444b] bg-[#2f3136] hover:bg-[#40444b] hover:border-[#282b30] rounded-full'>{buttonText}</button>
    </div>
  )
}

export default InvitationButton
