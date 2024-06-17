import React, { useEffect, useState } from 'react'
import useInvitations from '../hooks/useInvitationsContext';
import SearchContacts from './SearchContacts';
import Contact from './Contact';
import useContactsChats from '../hooks/useContactsChatsContext';
import useChat from '../hooks/useChatContext';

function Contacts() {
  const [contacts, setContacts] = useState<[] | null>(null);
  const {getInvites} = useInvitations(); 
  const [inputChange, setInputChange] = useState<string>('');
  const {getChat} = useChat();
  const {contactsChats} = useContactsChats();

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
            return <Contact key={contact['id']} id={contact['id']} username={contact['username']} lastMessage={contact['last_msg']} handleChat={getChat}/>
          })}
        </div>
        {contactsChats && inputChange.length === 0 ? contactsChats.map(contact => {
          return <Contact key={contact['id']} id={contact['id']} username={contact['username']} lastMessage={contact['last_msg']} handleChat={getChat}/>}) : null }
    </div>
  )
}

export default Contacts