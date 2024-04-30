import React, { useEffect, useState } from 'react'
import Search from './Search'
import User from './User';
import useAuth from '../hooks/useAuthContext';
import useInvitations from '../hooks/useInvitationsContext';

function AddContacts() {
    const [users, setUsers] = useState<[] | null>(null);
    const { auth, checkAuth } = useAuth();
    const { getSent, sentInvitations } = useInvitations();

    async function getInvited() {
        await getSent();
        // console.log(sentInvitations);
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
        
                getInvited();
                
            } catch(err) {
            console.log(err);
            }; 
        };
    };

    useEffect(() => {
        getInvited();
    },[])

  return (
    <div className='w-full'>
        <Search handleUsers={setUsers} apiRoute='/api/addContacts'/>
        <div className='overflow-y-auto'>
            {users && users.map(user => {
                // console.log(sent.some((e:{invitation_receiver: string}) => e.invitation_receiver == user['id']))
                if(user['id'] === auth.user['id']) { 
                    return null;
                } else if(sentInvitations.some((e:{invitation_receiver: string}) => e.invitation_receiver == user['id'])) {
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