import React, { createContext, useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { ChatContextType, chatType, msg } from '../@types/ChatContext';
import useSocket from '../hooks/useSocketContext';

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {auth} = useAuth();
  const [chat, setChat] = useState<chatType>(null);
  const {socket} = useSocket();
  const [messages, setMessages] = useState<msg[] | null>(null);

  async function getChat(contactID: string, contactName: string) {

    socket.emit('leave', chat?.ID);

    if(auth) {
      try {
        await fetch('/api/getChat', {
          method: 'POST',
          credentials: 'include',
          headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
          body: JSON.stringify({currentUserID: auth.id, contactID: contactID})
          })
          .then(res => res.json())
          .then(res => {{setChat({ID: res.chatID, messages: res.chat, contact: res.contact, contactName: contactName}); socket.emit('join', res.chatID);}})
          .then(res => {return () => {getChat(contactID, contactName)}});
            
        } catch(err) {
          console.log(err);
        }; 
        };
  };

  async function getMessages() {
    if(chat) {
      try {
        await fetch('/api/getMessages', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({sender_id: auth?.id, contactID: chat.contact})
        })
        .then(res => res.json())
        .then(res => setMessages(res))
      
      } catch(err) {
        console.log(err);
      };
    };
  };

  useEffect(() => {

    socket.on('updateChat', getMessages)

    return () => {
      socket.off('updateChat', getMessages)
    }

  },[socket, messages])

  useEffect(() => {
    if(auth === null) {
      setMessages(null);
      setChat(null);
    }
  }, [auth]);

  return (
    <ChatContext.Provider value={{ getChat, chat, setChat, messages, getMessages }}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatContext
