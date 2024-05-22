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

    async function sendInvite(receiver: string) {
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
                body: JSON.stringify({sender: auth.id, receiver: receiver})
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
    <div className='w-full'>
        <Search handleInputChange={setInputChange} handleUsers={setUsers} apiRoute='/api/addContacts'/>
        <div className='overflow-y-auto'>
            {users && users.map(user => {
                if(auth && user['id'] === auth['id']) { 
                    return null;
                } else if((invites && invites.receivedInvites.some((e:{id: string}) => e.id === user['id'])) 
                    || (invites && invites.sentInvites.some((e:{id: string}) => e.id === user['id'])) 
                    || (invites && invites.contacts.some((e:{id: string}) => e.id === user['id']))) {
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