import React from 'react'

type props = {
    buttonText: string,
    onClickCancel: () => void
}

function InvitationCancelButton({buttonText, onClickCancel}: props) {
  return (
    <div>
      <button onClick={() => onClickCancel()} className='px-2 ml-3 border border-[#40444b] bg-[#2f3136] hover:bg-[#40444b] hover:border-[#282b30] hover:text-[#282b30] rounded-full'>{buttonText}</button>
    </div>
  )
}

export default InvitationCancelButton
