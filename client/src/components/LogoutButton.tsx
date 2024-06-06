import React from 'react'
import useAuth from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import useChat from '../hooks/useChatContext';
import useInvitations from '../hooks/useInvitationsContext';
import useContactsChats from '../hooks/useContactsChatsContext';

function LogoutButton() {
    const { auth } = useAuth();
    const { setAuth } = useAuth();
    const { setChat } = useChat();
    const { setInvites } = useInvitations();
    const { setContactsChats } = useContactsChats();
    const navigate = useNavigate();

    function handleLogout() {

        try {
          fetch('/api/logout', {
            method: 'POST',
            headers: {
              'Content-Type':'application/json',
            },
            body: JSON.stringify(auth)
          });
    
          localStorage.clear();
          setAuth(null);
          setChat(null);
          setInvites(null);
          setContactsChats(null);
          navigate('/login');
    
        } catch(err) {
          console.log(err);
        };
      };

  return (
    <button className='mt-auto w-full h-10 border-y-[1px] border-gray-400 hover:bg-gray-500 hover:text-black' onClick={handleLogout}>Logout</button>
  )
}

export default LogoutButton