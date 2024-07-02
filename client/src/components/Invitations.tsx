import React, { useEffect } from 'react'
import useInvitations from '../hooks/useInvitationsContext'
import Invitation from './Invitation';

function Invitations() {
  const {invites} = useInvitations();

  return (
    <div className='flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden scrollbar'>
      <div className='h-full overflow-y-scroll overflow-x-hidden scrollbar'>
        <p className='px-5'>Your invitations:</p>
        {invites && invites.receivedInvites.map((invite: {id: string, username: string}) => {
          return <Invitation key={invite.id} id={invite.id} username={invite.username} accept={true} />
        })}
        <p className='px-5 border-t-[1px] border-gray-400'>Sent invitations:</p>
        {invites && invites.sentInvites.map((invite: {id: string, username: string}) => {
          return <Invitation key={invite.id} id={invite.id} username={invite.username} accept={false} />
        })}
      </div>
    </div>
  )
}

export default Invitations