import React, { createContext, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { ContactsChats, ContactsChatsContextType } from '../@types/ContactsChatsContext';

const ContactsChatsContext = createContext<ContactsChatsContextType | null>(null);

export const ContactsChatsContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {checkAuth, auth} = useAuth();
  const [contactsChats, setContactsChats] = useState<ContactsChats | null>(null);

  async function getContactsChats() {
    await checkAuth();
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

          console.log(contactsChats);

        } catch(err) {
            console.log(err);
        };
    }};

  return (
    <ContactsChatsContext.Provider value={{ getContactsChats, contactsChats }}>
      {children}
    </ContactsChatsContext.Provider>

  )
}

export default ContactsChatsContext;
