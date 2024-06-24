import React, { useEffect, useState } from 'react'
import useChat from '../hooks/useChatContext'
import Message from './Message';
import useSocket from '../hooks/useSocketContext';
import useAuth from '../hooks/useAuthContext';

function ChatMsgField() {
  const {chat, getMessages, messages} = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const {auth} = useAuth();
  const {socket} = useSocket();

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

  return (
    <div className='flex flex-col h-full w-full whitespace-nowrap overflow-y-scroll'>
        {messages ? messages.map(message => {
        return (
          <Message key={message.msg_id} msgID={message.msg_id} msgSenderID={message.sender_id} msgDate={message.date} msgText={message.msg_text} />
        )
      }) : null}
      {isTyping ? <p className='mt-auto'>{chat?.contactName} is typing...</p> : null}
    </div>
  )
}

export default ChatMsgField
