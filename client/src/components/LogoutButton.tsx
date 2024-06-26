import React from 'react'
import useAuth from '../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const { auth } = useAuth();
    const { setAuth } = useAuth();
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
          navigate('/login');
    
        } catch(err) {
          console.log(err);
        };
      };

  return (
    <button className='mt-auto w-full h-10 border-t border-gray-400 hover:bg-gray-500 hover:text-black hover:rounded-b-3xl' onClick={handleLogout}>Logout</button>
  )
}

export default LogoutButton