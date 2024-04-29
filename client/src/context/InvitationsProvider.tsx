import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';

const InvitationsContext = createContext<any>({});

export const InvitationsContextProvider = ({ children }: any) => {
    const { auth, checkAuth } = useAuth();
    const [sentInvitations, setSentInvitations] = useState<Array<{invitation_receiver: string}>>([]);

    async function getReceived() {
        const check = await checkAuth();
        if(check) {
            try {
                const response = await fetch('/api/getReceivedInvites', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    },
                    body: JSON.stringify({currentUser: auth.user.id})
                    })
                    .then(res => res.json());

                    // console.log(response);

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
                    body: JSON.stringify({currentUser: auth.user.username})
                    })
                    .then(res => res.json())
                    .then(res => setSentInvitations(res.receivers))
            
                    // setSentInvitations(res.receivers)

            } catch(err) {
                console.log(err);
            };
        }};

    return (
        <InvitationsContext.Provider value={{ getReceived, getSent, sentInvitations }}>
            {children}
        </InvitationsContext.Provider>
    )
};

export default InvitationsContext;