import React, { useEffect, useState } from 'react'
import useInvitations from '../hooks/useInvitationsContext';

type props = {
    handleUsers: React.Dispatch<React.SetStateAction<[] | null>>,
    apiRoute: string
};

function Search({handleUsers, apiRoute}: props) {
    const [input, setInput] = useState('');
    const { getSent } = useInvitations();

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
                body: JSON.stringify({searchParams: input})
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
        setTimeout(() => {
            searchForUsers();
        }, 100)  
    }, [input]);

  return (
    <input className='w-full h-10 px-5 border-b-[1px] border-black' placeholder='Search' onChange={(e) => handleChange(e)} type='text' value={input} name='users' />
  );
};

export default Search