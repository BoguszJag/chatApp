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
    <input className='w-custom_margin min-h-10 px-5 mx-3 my-3 placholder-gray-400 bg-[#40444b] focus:outline-none rounded-xl' placeholder='Search' onChange={(e) => handleChange(e)} type='text' value={input} name='users' />
  );
};

export default Search