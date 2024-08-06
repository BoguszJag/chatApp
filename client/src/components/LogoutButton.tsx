import React from 'react'
import useAuth from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocketContext';

function LogoutButton() {
    const { auth } = useAuth();
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const {socket} = useSocket();

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
          socket.disconnect();
          setAuth(null);
          navigate('/login');
          window.location.reload();
    
        } catch(err) {
          console.log(err);
        };
      };

  return (
    <button className='mt-auto w-full min-h-10 hover:bg-[#40444b] hover:rounded-b-3xl rounded-b-3xl bg-[#282b30] overflow-hidden' onClick={handleLogout}>Logout</button>
  )
}

export default LogoutButton