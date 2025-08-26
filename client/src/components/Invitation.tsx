import React, { useEffect } from 'react'
import InvitationButton from './InvitationButton'
import InvitationCancelButton from './InvitationCancelButton'
import useAuth from '../hooks/useAuthContext'
import useInvitations from '../hooks/useInvitationsContext'

type props = {
    id: string,
    userId: string,
    username: string,
    accept: boolean
}

function Invitation({id, username, userId, accept}: props) {
  const {auth} = useAuth();
  const {getInvites} = useInvitations();

  async function cancelInvitation() {
    if(auth) {
      try {
        await fetch('/api/cancelInvitation', {
          method: 'POST',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
          body: JSON.stringify({id: id})
          })
          .then(res => res.json());

          getInvites();

      } catch (err) {
        console.log(err);
      };
    };
  };

  async function addContact() {
    if(auth) {
      try {
        await fetch('/api/addContact', {
          method: 'POST',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
          body: JSON.stringify({inviteId: id, currentUserId: auth.id, currentUserName: auth.username, targetName: username, targetId: userId})
          })
          .then(res => res.json());

          getInvites();

      } catch (err) {
        console.log(err);
      };
    };
  };

  return (
    <div key={id} className='flex justify-normal items-center h-12 px-2 py-1 mx-3 hover:bg-[#40444b] rounded-xl'>
      {username} 
      <div className='flex ml-auto'>
        {accept ? <InvitationButton buttonText='Accept' onClickAddContact={addContact} /> : null} <InvitationCancelButton buttonText='X' onClickCancel={cancelInvitation} />
      </div>
    </div>
  )
}

export default Invitation
