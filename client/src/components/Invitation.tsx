import React from 'react'
import InvitationButton from './InvitationButton'
import InvitationCancelButton from './InvitationCancelButton'
import useAuth from '../hooks/useAuthContext'
import useInvitations from '../hooks/useInvitationsContext'

type props = {
    id: string,
    username: string,
    accept: boolean
}

function Invitation({id, username, accept}: props) {
  const { auth } = useAuth();
  const { getInvites } = useInvitations();

  async function cancelInvitation () {
    try {
      await fetch('/api/cancelInvitation', {
        method: 'POST',
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
        },
        body: JSON.stringify({currentUser: auth.user.id, target: id})
        })
        .then(res => res.json())
        .then(getInvites());

    } catch (err) {
      console.log(err);
    };
  };

  return (
    <div key={id} className='flex justify-normal items-center px-5 hover:bg-gray-500 hover:text-black h-12 w-full '>
      {username} 
      <div className='flex ml-auto'>
        {accept ? <InvitationButton buttonText='Accept' /> : null} <InvitationCancelButton buttonText='X' onClickCancel={cancelInvitation} />
      </div>
    </div>
  )
}

export default Invitation
