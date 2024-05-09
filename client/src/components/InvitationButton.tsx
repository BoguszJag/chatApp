import React from 'react'

type props = {
    buttonText: string
}

function InvitationButton({buttonText}: props) {
  return (
    <div>
      <button className='px-3 ml-3 border-[1px] border-gray-400 hover:bg-green-700 hover:border-black rounded'>{buttonText}</button>
    </div>
  )
}

export default InvitationButton
