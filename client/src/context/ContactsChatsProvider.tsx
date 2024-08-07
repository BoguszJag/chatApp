import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { ContactsChat, ContactsChatsContextType } from '../@types/ContactsChatsContext';
import useSocket from '../hooks/useSocketContext';
import CryptoJS from 'crypto-js';

const ContactsChatsContext = createContext<ContactsChatsContextType | null>(null);

export const ContactsChatsContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {auth} = useAuth();
  const [contactsChats, setContactsChats] = useState<ContactsChat[] | undefined>(undefined);
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
          .then(res => {
            res.forEach((contact: ContactsChat) => {
              const bytes = CryptoJS.AES.decrypt(contact.last_msg, contact.sender_id);
              contact.last_msg = bytes.toString(CryptoJS.enc.Utf8);
            });
            setContactsChats(res);
          });

        } catch(err) {
            console.log(err);
        };
    }};

    useEffect(() => {
      if(auth === null) {
        setContactsChats(undefined);
      };

      getContactsChats();
    }, [auth]);
  
    useEffect(() => {
      
      socket.on('updateChat', getContactsChats);
      
      return () => {
        socket.off('updateChat', getContactsChats);
      };

    },[socket, contactsChats]);

    useEffect(() => {
      
        const checkTimer = setInterval(getContactsChats, 10000);

        return () => {
          clearInterval(checkTimer);
        };

    },[auth]);

  return (
    <ContactsChatsContext.Provider value={{ getContactsChats, contactsChats, setContactsChats }}>
      {children}
    </ContactsChatsContext.Provider>

  )
}

export default ContactsChatsContext;
