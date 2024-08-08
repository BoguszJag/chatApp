import React, { useEffect } from 'react'
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
          body: JSON.stringify({currentUser: auth.id, target: id})
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
          body: JSON.stringify({currentUserID: auth.id, currentUserName: auth.username, targetID: id, targetName: username})
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
