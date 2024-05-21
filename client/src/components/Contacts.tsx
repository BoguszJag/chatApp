import React, { useEffect, useState } from 'react'
import useInvitations from '../hooks/useInvitationsContext';
import SearchContacts from './SearchContacts';
import Contact from './Contact';

function Contacts() {
    const [contacts, setContacts] = useState<[] | null>(null);
    const {getInvites} = useInvitations(); 
    const [inputChange, setInputChange] = useState<string>('');

    async function handleInvites() {
      await getInvites();
    };

    useEffect(() => {
      handleInvites();
    },[inputChange]);

  return (
    <div className='w-full'>
        <SearchContacts handleInputChange={setInputChange} handleUsers={setContacts} apiRoute='/api/searchContacts'/>
        <div className='overflow-y-auto'>
          {contacts && contacts.map(contact => {
            return <Contact key={contact['user_2id']} id={contact['user_2id']} username={contact['user_2_name']}/>
          })}
        </div>
    </div>
  )
}

export default Contacts