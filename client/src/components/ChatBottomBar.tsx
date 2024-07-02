import React, { useEffect, useRef, useState } from 'react'
import useChat from '../hooks/useChatContext'
import useAuth from '../hooks/useAuthContext';
import useSocket from '../hooks/useSocketContext';

function ChatBottomBar() {
  const {chat} = useChat();
  const {auth} = useAuth();
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState<text>();
  const {socket} = useSocket();
  const divRef = useRef<HTMLDivElement | null>(null)

  type text = {
    chat: string | undefined
    contactID: string | undefined,
    sender_id: string | undefined,
    date: string,
    msg_text: string
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if(e.key === 'Enter') {
      sendMessage();
    };
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const sendMessage = () => {
    const date = new Date();
    const currentDate = `${('0'+date.getHours()).slice(-2)}:${('0'+date.getMinutes()).slice(-2)} ${date.getFullYear()}-${(('0'+(date.getMonth()+1))).slice(-2)}-${('0'+date.getDate()).slice(-2)}`;
    const text = input;
    setInput('');

    const msgObj = {chat: chat?.ID, contactID: chat?.contact, sender_id: auth?.id, date: currentDate, msg_text: text};
    
    setMsg(msgObj);
  };

  useEffect(() => {
    divRef.current?.addEventListener('keydown', handleKeyDown);

    return (() => {
      divRef.current?.removeEventListener('keydown', handleKeyDown);
    });
  },[input]);

  useEffect(() => {
    if(msg) {
      socket.emit('message', msg)
    }
  },[msg]);

  useEffect(() => {
    setTimeout(() => {
      socket.emit('isTyping', {id: auth?.id, chat: chat?.ID, input: input.length});
    }, 500);
  },[input, socket]);

  return (
    <div ref={divRef} className='flex flex-row mt-auto justify-normal items-center w-full h-[39px] rounded-3xl'>
      <input disabled={!chat ? true : false} className='w-5/6 h-10 px-5 placholder-gray-400 bg-[#282b30] focus:outline-none rounded-bl-3xl' type="text" value={input} onChange={(e) => handleInput(e)} placeholder='Type a message...'/>
      <button disabled={!chat ? true : false} className={'w-1/6 h-10 border-l border-[#2f3136] rounded-br-3xl bg-[#282b30] ' + (!chat ? null : 'hover:bg-[#40444b] hover:rounded-br-3xl')} onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatBottomBar
