import React, { useEffect } from 'react'
import useInvitations from '../hooks/useInvitationsContext'
import Invitation from './Invitation';

function Invitations() {
  const {invites} = useInvitations();

  return (
    <div className='flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden scrollbar'>
      <div className='h-full overflow-y-scroll overflow-x-hidden scrollbar'>
        {invites && invites.receivedInvites.length === 0 && invites.sentInvites.length === 0 ? <p className='px-5 pt-3 mb-3'>You have no invitations</p> : null}
        {invites === null || (invites && invites.receivedInvites.length === 0) ? null : <p className='px-5 pt-3 mb-3'>Your invitations: </p>}
        {invites && invites.receivedInvites.map((invite: {id: string, username: string}) => {
          return <Invitation key={invite.id} id={invite.id} username={invite.username} accept={true} />
        })}
        {invites === null || (invites && invites.sentInvites.length === 0) ? null : <p className='px-5 pt-3 my-3'>Sent invitations:</p>}
        {invites && invites.sentInvites.map((invite: {id: string, username: string}) => {
          return <Invitation key={invite.id} id={invite.id} username={invite.username} accept={false} />
        })}
        {invites === null ? <div className='flex items-center justify-center w-full mt-5'><div className='loading-spinner w-full'></div></div> : null}
      </div>
    </div>
  )
}

export default Invitations