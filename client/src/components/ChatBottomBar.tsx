import React, { useEffect, useState } from 'react'
import useChat from '../hooks/useChatContext'
import useAuth from '../hooks/useAuthContext';
import useSocket from '../hooks/useSocketContext';

function ChatBottomBar() {
  const {chat} = useChat();
  const {auth} = useAuth();
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<text>();
  const {socket} = useSocket();

  type text = {
    chat: string | undefined
    contactID: string | undefined,
    sender_id: string | undefined,
    date: string,
    msg_text: string
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const sendMessage = () => {
    const date = new Date();
    const currentDate = `${date.getHours()}:${('0'+date.getMinutes()).slice(-2)} ${('0'+date.getDate()).slice(-2)}.${(('0'+(date.getMonth()+1))).slice(-2)}.${date.getFullYear()}`;
    const text = input;
    setInput('');

    const msgObj = {chat: chat?.ID, contactID: chat?.contact, sender_id: auth?.id, date: currentDate, msg_text: text};
    
    setMsg(msgObj);
  };

  useEffect(() => {
    if(msg) {
      socket.emit('message', msg)
    }
  },[msg])


  return (
    <div className='flex flex-row mt-auto justify-normal items-center w-full h-[39px]'>
      <input disabled={!chat ? true : false} className='w-5/6 h-10 px-5 border-y border-r border-gray-400 placholder-gray-400 bg-gray-950' type="text" value={input} onChange={(e) => handleInput(e)} placeholder='Type a message...'/>
      <button disabled={!chat ? true : false} className={'w-1/6 h-10 border-y border-gray-400 ' + (!chat ? null : 'hover:bg-gray-500 hover:text-black')} onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatBottomBar
