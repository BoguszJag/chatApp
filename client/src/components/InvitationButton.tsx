import React from 'react'

type props = {
    buttonText: string
}

function InvitationButton({buttonText}: props) {
  return (
    <div>
      <button className='px-3 ml-3 border-[1px] border-black'>{buttonText}</button>
    </div>
  )
}

export default InvitationButton
