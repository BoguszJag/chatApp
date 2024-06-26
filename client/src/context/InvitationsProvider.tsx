import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { InvitationsContextType, Invites } from '../@types/InvitationsContext';

const InvitationsContext = createContext<InvitationsContextType | null>(null);

export const InvitationsContextProvider:  React.FC<{children: React.ReactNode}> = ({children}) => {
    const {auth, checkAuth} = useAuth();
    const [invites, setInvites] = useState<Invites | null>(null);
    
    async function getInvites() {
        await checkAuth();
        if(auth) {
            try {
                await fetch('/api/getInvites', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({currentUser: auth.id})
                    })
                    .then(res => res.json())
                    .then(res => setInvites(res));

            } catch(err) {
                console.log(err);
            };
        }};

        useEffect(() => {
            if(auth === null) {
              setInvites(null);
            }
          }, [auth]);
        

    return (
        <InvitationsContext.Provider value={{ getInvites, invites, setInvites }}>
            {children}
        </InvitationsContext.Provider>
    )
};

export default InvitationsContext;