import React, { useEffect, useState } from 'react'

type props = {
    handleInputChange: React.Dispatch<React.SetStateAction<string>>,
    handleUsers: React.Dispatch<React.SetStateAction<[] | null>>,
    apiRoute: string
};

function Search({handleInputChange, handleUsers, apiRoute}: props) {
    const [input, setInput] = useState('');

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        
        const value = e.target.value;
        setInput(value);
        handleInputChange(value);

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
        searchForUsers();
    },[input]);

  return (
    <input className='w-full h-10 px-5 border-b-[1px] border-gray-400 placholder-gray-400 bg-[#2f3136] focus:outline-none' placeholder='Search' onChange={(e) => handleChange(e)} type='text' value={input} name='users' />
  );
};

export default Search