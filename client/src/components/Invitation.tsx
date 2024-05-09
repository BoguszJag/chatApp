import React from 'react'
import InvitationButton from './InvitationButton'
import InvitationCancelButton from './InvitationCancelButton'

type props = {
    id: string,
    username: string,
    accept: boolean
}

function Invitation({id, username, accept}: props) {
  return (
    <div key={id} className='flex justify-normal items-center px-5 hover:bg-gray-500 hover:text-black h-12 w-full '>
      {username} 
      <div className='flex ml-auto'>
        {accept ? <InvitationButton buttonText='Accept' /> : null} <InvitationCancelButton buttonText='X' />
      </div>
    </div>
  )
}

export default Invitation
