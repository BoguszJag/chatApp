import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';

type props = {
    handleUsers: React.Dispatch<React.SetStateAction<[] | null>>,
    apiRoute: string
};

function SearchContacts({handleUsers, apiRoute}: props) {
    const [input, setInput] = useState('');
    const {auth} = useAuth();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        
        const value = e.target.value;
        setInput(value);

    };

    async function searchForUsers() {
        try {
            if(input.length > 0) {
                const response = await fetch(apiRoute, {
                method: 'POST',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                },
                body: JSON.stringify({searchParams: input, currentUser: auth.user.id})
                })
                .then(res => res.json());
        
                handleUsers(response.users);

            } else {   
                handleUsers(null);
            }

            } catch(err) {
            console.log(err);
            }; 
    };

    useEffect(() => {
        searchForUsers();
    });

  return (
    <input className='w-full h-10 px-5 border-b-[1px] border-gray-400 placholder-gray-400 bg-gray-950' placeholder='Search' onChange={(e) => handleChange(e)} type='text' value={input} name='users' />
  );
};

export default SearchContacts
