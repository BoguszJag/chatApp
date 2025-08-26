import React, { useEffect, useState } from 'react'
import Search from './Search'
import User from './User';
import useAuth from '../hooks/useAuthContext';
import useInvitations from '../hooks/useInvitationsContext';

function AddContacts() {
    const [users, setUsers] = useState<[] | null>(null);
    const {auth, checkAuth} = useAuth();
    const {getInvites, invites} = useInvitations();
    const [inputChange, setInputChange] = useState<string>('');

    async function handleInvites() {
        await getInvites();
    };

    async function sendInvite(receiver: string, username: string) {
        await checkAuth();
        if(auth) {
            try {
                await fetch('/api/sendInvitation', {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify({sender: auth.id, senderName: auth.username, receiver: receiver, receiverName: username})
                })
                .then(res => res.json());
        
                await handleInvites();
                
            } catch(err) {
            console.log(err);
            }; 
        };
    };

    useEffect(() => {
        handleInvites();
    },[inputChange]);

  return (
    <div className='flex flex-col w-full h-full overflow-y-scroll overflow-x-hidden scrollbar whitespace-nowrap'>
        <Search handleInputChange={setInputChange} handleUsers={setUsers} apiRoute='/api/addContacts'/>
        <div className='h-full overflow-y-scroll overflow-x-hidden scrollbar whitespace-nowrap'>
            {users && inputChange.length > 0 && users.map(user => {
                if(auth && user['id'] === auth['id']) { 
                    return null;
                } else if((invites && invites.receivedInvites.some((e:{invitation_sender: string}) => e.invitation_sender === user['id'])) 
                    || (invites && invites.sentInvites.some((e:{invitation_receiver: string}) => e.invitation_receiver === user['id'])) 
                    || (invites && invites.contacts.some((e:{uid: string}) => e.uid === user['id']))) {
                    return <User key={user['id']} id={user['id']} username={user['username']} invite={sendInvite} invited={true} />
                } else {
                    return <User key={user['id']} id={user['id']} username={user['username']} invite={sendInvite} invited={false} />
                }
            })}
        </div>
    </div>
  );
};

export default AddContacts