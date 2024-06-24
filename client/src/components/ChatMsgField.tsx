import React, { useEffect, useRef, useState } from 'react'
import useChat from '../hooks/useChatContext'
import Message from './Message';
import useSocket from '../hooks/useSocketContext';
import useAuth from '../hooks/useAuthContext';

function ChatMsgField() {
  const {chat, getMessages, messages} = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const {auth} = useAuth();
  const {socket} = useSocket();
  const scrollDiv = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    scrollDiv.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollOnContactChange = () => {
    scrollDiv.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    getMessages();
  },[chat?.contact]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    socket.on('typing', (senderID) => {
      if(auth && (auth?.id !== senderID)) {
        setIsTyping(true);
      };

      clearTimeout(timer);
      
      timer = setTimeout(() => {
        setIsTyping(false);
    }, 3000);
    });

    socket.on('stopedTyping', (senderID) => {
      if(auth && (auth?.id !== senderID)) {
        setIsTyping(false);
      };
    });

  },[auth, socket]);

  useEffect(() => {
    if(scrollRef.current) {
      const isAtBottom = scrollRef.current.scrollTop + scrollRef.current.clientHeight + 300 >= scrollRef.current.scrollHeight;
      if (isAtBottom) scrollToBottom();
    };
    
    if(scrollRef.current && scrollRef.current.scrollTop <= 100) scrollOnContactChange()
  },[messages]);

  return (
    <div ref={scrollRef} className='flex flex-col h-full w-full whitespace-nowrap overflow-y-scroll'>
        {messages ? messages.map(message => {
        return (
          <Message key={message.msg_id} msgID={message.msg_id} msgSenderID={message.sender_id} msgDate={message.date} msgText={message.msg_text} />
        )
      }) : null}
      <div ref={scrollDiv}></div>
      {isTyping ? <p className='mt-auto'>{chat?.contactName} is typing...</p> : null}
    </div>
  )
}

export default ChatMsgField
