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
    <div>
      Your invitations:
      {invites && invites.receivedInvites.map((invite: {id: string, username: string}) => {
        return <Invitation id={invite.id} username={invite.username} />
      })}
      <br/>
      Sent invitations:
      {invites && invites.sentInvites.map((invite: {id: string, username: string}) => {
        return <Invitation id={invite.id} username={invite.username} />
      })}
    </div>
  )
}

export default Invitations