import React, { useEffect } from 'react'
import useInvitations from '../hooks/useInvitationsContext'
import Invitation from './Invitation';

function Invitations() {
  const { getInvites, invites } = useInvitations();


  async function handleInvitations() {
    await getInvites();
  };

  useEffect(() => {
    handleInvitations();
  },[]);

  return (
    <div className='w-full'>
      <p className='px-5'>Your invitations:</p>
      {invites && invites.receivedInvites.map((invite: {id: string, username: string}) => {
        return <Invitation id={invite.id} username={invite.username} accept={true} />
      })}
      <br/>
      <p className='px-5'>Sent invitations:</p>
      {invites && invites.sentInvites.map((invite: {id: string, username: string}) => {
        return <Invitation id={invite.id} username={invite.username} accept={false} />
      })}
    </div>
  )
}

export default Invitations