import React, { useEffect, useState } from 'react'
import SearchContacts from './SearchContacts';
import Contact from './Contact';
import useContactsChats from '../hooks/useContactsChatsContext';
import useChat from '../hooks/useChatContext';
import { ContactsChat } from '../@types/ContactsChatsContext';

type props = {
  handleSidepanelState: React.Dispatch<React.SetStateAction<string>>
};

function Contacts({handleSidepanelState}: props) {
  const [contacts, setContacts] = useState<ContactsChat[] | null>(null);
  const [inputChange, setInputChange] = useState<string>('');
  const {getChat} = useChat();
  const {contactsChats} = useContactsChats();

  return (
    <div className='flex flex-col w-full overflow-y-scroll overflow-x-hidden scrollbar'>
      <SearchContacts handleInputChange={setInputChange} handleUsers={setContacts} apiRoute={null}/>
      <div className='pl-[10px] overflow-y-scroll overflow-x-hidden scrollbar'>
          {contacts && inputChange.length > 0 && contacts.map(contact => {
            return <Contact key={contact.userInfo.uid} uid={contact.userInfo.uid} username={contact.userInfo.username} lastMessage={contact.lastMessage ? contact.lastMessage.text : null} senderID={contact.lastMessage ? contact.lastMessage.senderId : null} isDisplayed={contact.lastMessage ? contact.lastMessage.displayed : null} handleChat={getChat} handleSidepanelState={handleSidepanelState}/>
          })}
        
          {contactsChats && contactsChats.length > 0 && inputChange.length === 0 ? contactsChats.sort((a,b) => {return new Date(b.lastMessage.date).getTime() - new Date(a.lastMessage.date).getTime()}).map(contact => {
            return <Contact key={contact.userInfo.uid} uid={contact.userInfo.uid} username={contact.userInfo.username} lastMessage={contact.lastMessage ? contact.lastMessage.text : null} senderID={contact.lastMessage ? contact.lastMessage.senderId : null} isDisplayed={contact.lastMessage ? contact.lastMessage.displayed : null} handleChat={getChat} handleSidepanelState={handleSidepanelState}/>}) : null }
      </div>
    </div>
  )
}

export default Contacts