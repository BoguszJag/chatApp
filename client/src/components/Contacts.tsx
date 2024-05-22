import React, { useEffect, useState } from 'react'
import useInvitations from '../hooks/useInvitationsContext';
import SearchContacts from './SearchContacts';
import Contact from './Contact';
import useAuth from '../hooks/useAuthContext';

function Contacts() {
  const [contacts, setContacts] = useState<[] | null>(null);
  const {getInvites} = useInvitations(); 
  const [inputChange, setInputChange] = useState<string>('');
  const {checkAuth, auth} = useAuth();

  async function handleInvites() {
    await getInvites();
  };

  async function getChat(contactID: string) {
    await checkAuth();
    if(auth) {
      try {
        const response = await fetch('/api/getChat', {
          method: 'POST',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
          body: JSON.stringify({currentUserID: auth.id, contactID: contactID})
          })
          .then(res => res.json());
              
          console.log(response);

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
        <SearchContacts handleInputChange={setInputChange} handleUsers={setContacts} apiRoute='/api/searchContacts'/>
        <div className='overflow-y-auto'>
          {contacts && contacts.map(contact => {
            return <Contact key={contact['id']} id={contact['id']} username={contact['username']} handleChat={getChat}/>
          })}
        </div>
    </div>
  )
}

export default Contacts