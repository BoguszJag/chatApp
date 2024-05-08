import React from 'react'
import InvitationButton from './InvitationButton'

type props = {
    id: string,
    username: string,
    accept: boolean
}

function Invitation({id, username, accept}: props) {
  return (
    <div key={id} className='flex justify-normal items-center px-5 hover:bg-gray-300 h-12 w-full '>
      {username} 
      <div className='flex ml-auto'>
        {accept ? <InvitationButton buttonText='Accept' /> : null} <InvitationButton buttonText='X' />
      </div>
    </div>
  )
}

export default Invitation
