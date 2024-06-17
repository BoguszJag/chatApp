import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { ContactsChats, ContactsChatsContextType } from '../@types/ContactsChatsContext';
import useSocket from '../hooks/useSocketContext';

const ContactsChatsContext = createContext<ContactsChatsContextType | null>(null);

export const ContactsChatsContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {auth} = useAuth();
  const [contactsChats, setContactsChats] = useState<ContactsChats | null>(null);
  const {socket} = useSocket();

  async function getContactsChats() {
    if(auth) {
      try {
        await fetch('/api/getContactsChats', {
          method: 'POST',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({currentUser: auth.id})
          })
          .then(res => res.json())
          .then(res => setContactsChats(res));

        } catch(err) {
            console.log(err);
        };
    }};

    useEffect(() => {
      if(auth === null) {
        setContactsChats(null);
      };

      getContactsChats();
    }, [auth]);
  
    useEffect(() => {
      
      socket.on('updateChat', getContactsChats);
      
      return () => {
        socket.off('updateChat', getContactsChats);
      };

    },[socket, contactsChats]);

  return (
    <ContactsChatsContext.Provider value={{ getContactsChats, contactsChats, setContactsChats }}>
      {children}
    </ContactsChatsContext.Provider>

  )
}

export default ContactsChatsContext;
