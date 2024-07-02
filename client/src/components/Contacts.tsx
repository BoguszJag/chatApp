import React, { useEffect, useState } from 'react'
import SearchContacts from './SearchContacts';
import Contact from './Contact';
import useContactsChats from '../hooks/useContactsChatsContext';
import useChat from '../hooks/useChatContext';
import { ContactsChat } from '../@types/ContactsChatsContext';

function Contacts() {
  const [contacts, setContacts] = useState<ContactsChat[] | null>(null);
  const [inputChange, setInputChange] = useState<string>('');
  const {getChat} = useChat();
  const {contactsChats} = useContactsChats();

  return (
    <div className='flex flex-col w-full overflow-y-scroll overflow-x-hidden scrollbar'>
      <SearchContacts handleInputChange={setInputChange} handleUsers={setContacts} apiRoute={null}/>
      <div className='overflow-y-scroll overflow-x-hidden scrollbar'>
          {contacts && inputChange.length > 0 && contacts.map(contact => {
            return <Contact key={contact['id']} id={contact['id']} username={contact['username']} lastMessage={contact['last_msg']} senderID={contact['sender_id']} isDisplayed={contact['displayed']} handleChat={getChat}/>
          })}
        
          {contactsChats && contactsChats.length > 0 && inputChange.length === 0 ? contactsChats.sort((a,b) => {return new Date(b.msg_date).getTime() - new Date(a.msg_date).getTime()}).map(contact => {
            return <Contact key={contact['id']} id={contact['id']} username={contact['username']} lastMessage={contact['last_msg']} senderID={contact['sender_id']} isDisplayed={contact['displayed']} handleChat={getChat}/>}) : null }
      </div>
    </div>
  )
}

export default Contacts