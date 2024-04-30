import React, { useEffect } from 'react'
import useInvitations from '../hooks/useInvitationsContext'

function Invitations() {
  const { getInvites, invites } = useInvitations();


  async function handleInvitations() {
    await getInvites();
  };

  useEffect(() => {
    handleInvitations();
  },[])

  return (
    <div>
      Your invitations:
      {invites && invites.receivedInvites.map((invite: {id: string, username: string}) => {
        return <div key={invite.id}>{invite.username}</div>
      })}
      <br/>
      Sent invitations:
      {invites && invites.sentInvites.map((invite: {id: string, username: string}) => {
        return <div key={invite.id}>{invite.username}</div>
      })}
    </div>
  )
}

export default Invitations