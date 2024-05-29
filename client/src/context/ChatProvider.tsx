import React, { createContext, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import { chat, ChatContextType } from '../@types/ChatContext';

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const {auth, checkAuth} = useAuth();
    const [chat, setChat] = useState<chat | null>(null);

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
              .then(res => res.json())
              .then(res => setChat(res.chat));
                  
              console.log(chat);
    
            } catch(err) {
                console.log(err);
            }; 
          };
      };

  return (
    <ChatContext.Provider value={{ getChat, chat, setChat }}>
        {children}
    </ChatContext.Provider>
  )
}

export default ChatContext
