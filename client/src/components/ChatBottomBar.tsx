import React, { useEffect, useRef, useState } from 'react'
import useChat from '../hooks/useChatContext'
import useAuth from '../hooks/useAuthContext';
import useSocket from '../hooks/useSocketContext';
import CryptoJS from 'crypto-js';

function ChatBottomBar() {
  const {chat, chatLoading} = useChat();
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
    const currentDate = date.toString();
    const text = input;
    setInput('');

    if(text.length > 0) {
      let message = text;

      if(auth) {
        message = CryptoJS.AES.encrypt(message, auth.id).toString();
      };

      const msgObj = {chat: chat?.ID, contactID: chat?.contact, sender_id: auth?.id, date: currentDate, msg_text: message};  
      setMsg(msgObj);
    }
  };

  useEffect(() => {
    divRef.current?.addEventListener('keydown', handleKeyDown);

    return (() => {
      divRef.current?.removeEventListener('keydown', handleKeyDown);
    });
  },[input]);

  useEffect(() => {
    if(msg) {
      socket.emit('message', msg);
    };
  },[msg]);

  useEffect(() => {
    setTimeout(() => {
      socket.emit('isTyping', {id: auth?.id, chat: chat?.ID, input: input.length});
    }, 500);
  },[input, socket]);

  return (
    <div ref={divRef} className='flex flex-row mt-auto justify-normal items-center w-full h-[39px] rounded-3xl'>
      <input disabled={!chat || chatLoading ? true : false} className='w-5/6 h-10 px-5 placholder-gray-400 bg-[#282b30] focus:outline-none rounded-bl-3xl' type="text" value={input} onChange={(e) => handleInput(e)} placeholder='Type a message...'/>
      <button disabled={!chat || chatLoading ? true : false} className={'w-1/6 h-10 border-l border-[#2f3136] rounded-br-3xl bg-[#282b30] overflow-hidden ' + (!chat ? null : 'hover:bg-[#40444b] hover:rounded-br-3xl')} onClick={sendMessage}>Send</button>
    </div>
  )
}

export default ChatBottomBar
