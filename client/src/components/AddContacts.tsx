import React, { useEffect, useState } from 'react'
import Search from './Search'
import User from './User';
import useAuth from '../hooks/useAuthContext';
import useInvitations from '../hooks/useInvitationsContext';

function AddContacts() {
    const [users, setUsers] = useState<[] | null>(null);
    const {auth, checkAuth} = useAuth();
    const {getInvites, invites} = useInvitations();

    async function handleInvites() {
        await getInvites();
    };

    async function sendInvite(receiver: string) {
        const authCheck = await checkAuth();
        if(authCheck) {
            try {
                await fetch('/api/sendInvitation', {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify({sender: auth.user.id, receiver: receiver})
                })
                .then(res => res.json());
        
                getInvites();
                
            } catch(err) {
            console.log(err);
            }; 
        };
    };

    useEffect(() => {
        handleInvites();
    });

  return (
    <div className='w-full'>
        <Search handleUsers={setUsers} apiRoute='/api/addContacts'/>
        <div className='overflow-y-auto'>
            {users && users.map(user => {
                if(user['id'] === auth.user['id']) { 
                    return null;
                } else if(invites.receivedInvites.some((e:{id: string}) => e.id === user['id']) 
                    || invites.sentInvites.some((e:{id: string}) => e.id === user['id']) 
                    || invites.contacts.some((e:{user_2id: string}) => e.user_2id === user['id'])) {
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