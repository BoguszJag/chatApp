import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';

const InvitationsContext = createContext<any>({});

export const InvitationsContextProvider = ({ children }: any) => {
    const { auth, checkAuth } = useAuth();
    const [sentInvitations, setSentInvitations] = useState<Array<{invitation_receiver: string}>>([]);
    const [invites, setInvites] = useState<Invites>();

    type Invites = {
        receivedInvites: Array<{id: string, username: string}>,
        sentInvites: Array<{id: string, username: string}>
    };
    
    async function getInvites() {
        const check = await checkAuth();
        if(check) {
            try {
                await fetch('/api/getInvites', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({currentUser: auth.user.id})
                    })
                    .then(res => res.json())
                    .then(res => setInvites(res))

                    console.log(invites);

            } catch(err) {
                console.log(err);
            };
        }};

    async function getSent() {
        const check = await checkAuth();
        if(check) {
            try {
                await fetch('/api/getSentInvites', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({currentUser: auth.user.id})
                    })
                    .then(res => res.json())
                    .then(res => setSentInvitations(res.receivers))
            
                    // setSentInvitations(res.receivers)

            } catch(err) {
                console.log(err);
            };
        }};

    return (
        <InvitationsContext.Provider value={{ getInvites, getSent, sentInvitations, invites }}>
            {children}
        </InvitationsContext.Provider>
    )
};

export default InvitationsContext;