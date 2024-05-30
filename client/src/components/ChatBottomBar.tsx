import React, { useEffect, useState } from 'react'
import useChat from '../hooks/useChatContext'
import useAuth from '../hooks/useAuthContext';

function ChatBottomBar() {
  const {chat, getChat} = useChat();
  const {auth} = useAuth();
  const [input, setInput] = useState('');

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const sendMessage = async () => {
    const date = new Date();
    const currentDate = `${date.getHours()}:${date.getMinutes()} ${date.getDay()}.${(date.getMonth()+1)}.${date.getFullYear()}`;
    const text = input;
    setInput('');
    if(chat && auth != null) {
      try {
        await fetch('/api/sendMessage', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({contactID: chat.contactID, sender_id: auth.id, date: currentDate, msg_text: text})
        });
      } catch (err) {
        console.log(err);
      };
  };
  };

  const handleGetChat = async () => {
    if(chat) {
      await getChat(chat.contactID);
    };
  };

  useEffect(() => {
    handleGetChat();
    console.log('Check')
  }, [input])
 
  return (
    <div className='flex flex-row mt-auto justify-normal items-center w-full h-[39px]'>
      <input disabled={!chat ? true : false} className='w-5/6 h-10 px-5 border-y border-r border-gray-400 placholder-gray-400 bg-gray-950' type="text" value={input} onChange={(e) => handleInput(e)} placeholder='Type a message...'/>
      <button disabled={!chat ? true : false} className='w-1/6 h-10 border-y border-gray-400' onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatBottomBar
