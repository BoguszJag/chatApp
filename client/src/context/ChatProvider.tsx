import React, { createContext, createRef, useEffect, useRef, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { ChatContextType, chatType, msg } from '../@types/ChatContext';
import useSocket from '../hooks/useSocketContext';
import useContactsChats from '../hooks/useContactsChatsContext';

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const {auth} = useAuth();
  const [chat, setChat] = useState<chatType>(null);
  const {socket} = useSocket();
  const [messages, setMessages] = useState<msg[] | null>(null);
  const {contactsChats, setContactsChats} = useContactsChats();
  const [chatLoading, setChatLoading] = useState(false);

  async function getChat(contactID: string, contactName: string) {

    socket.emit('leave', chat?.ID);

    if(auth) {
      setChatLoading(true);
      setMessages(null);
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
          .then(res => {{setChat({ID: res.chatID, messages: res.chat, contact: res.contact, contactName: contactName}); socket.emit('join', res.chatID)}})
          .then(res => {setChatLoading(false); return () => {getChat(contactID, contactName)}});

          if(contactsChats) {
            for(let i = 0; i < contactsChats.length; i++) {
              if(contactsChats[i].id === contactID) {
                setContactsChats((prev) => {
                  if (prev) { 
                    return [...prev.slice(0,i), ...prev.slice(i+1), {...prev[i], displayed: true}] 
                  };
                });
              };
            };
          };

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
    if(chat) socket.emit('messageDisplayed', {user: auth?.id, contact: chat?.contact, chat: chat?.ID});

    // socket.on('isDisplayed', (id) => {
    //   if(id === auth?.id) {
    //     getContactsChats();
    //   }
    // });

    // socket.off('isDisplayed', (id) => {
    //   if(id === auth?.id) {
    //     getContactsChats();
    //   }
    // });

  },[socket, chat])

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
    <ChatContext.Provider value={{ getChat, chat, setChat, messages, getMessages, chatLoading }}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatContext
