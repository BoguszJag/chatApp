import React, { createContext, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { chat, ChatContextType } from '../@types/ChatContext';
import { io, Socket } from 'socket.io-client';

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {auth, checkAuth} = useAuth();
    const [chat, setChat] = useState<chat | null>(null);
    const [currentSocket, setSocket] = useState<Socket | null>(null);

    async function getChat(contactID: string) {
        await checkAuth();
        if(auth) {
          try {
            const response = await fetch('/api/getChat', {
              method: 'POST',
              credentials: 'include',
              headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
              },
              body: JSON.stringify({currentUserID: auth.id, contactID: contactID})
              })
              .then(res => res.json());
                  
              const socket = io();
              socket.emit('join', response.chatID.name);
              setSocket(socket);

            } catch(err) {
                console.log(err);
            }; 
          };
      };

  return (
    <ChatContext.Provider value={{ getChat, chat, setChat, currentSocket }}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatContext
