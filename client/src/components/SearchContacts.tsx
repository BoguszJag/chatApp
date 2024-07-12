import React, { useEffect, useState } from 'react'
import useAuth from '../hooks/useAuthContext';
import useContactsChats from '../hooks/useContactsChatsContext';
import { ContactsChat } from '../@types/ContactsChatsContext';

type props = {
    handleInputChange: React.Dispatch<React.SetStateAction<string>>,
    handleUsers: React.Dispatch<React.SetStateAction<[] | ContactsChat[] | null>>,
    apiRoute: string | null
};

function SearchContacts({handleInputChange, handleUsers, apiRoute}: props) {
    const [input, setInput] = useState('');
    const {auth} = useAuth();
    const {contactsChats} = useContactsChats();

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        
        const value = e.target.value;
        setInput(value);
        handleInputChange(value);
    };

    async function searchForUsers() {
        if(apiRoute) {
            try {
                if(input.length > 0 && auth) {
                    const response = await fetch(apiRoute, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                    },
                    body: JSON.stringify({searchParams: input, currentUser: auth.id})
                    })
                    .then(res => res.json());
            
                    handleUsers(response.users);

                } else {   
                    handleUsers(null);
                }

                } catch(err) {
                console.log(err);
            };
        } else if(contactsChats && contactsChats.length > 0) {
            const search = contactsChats?.filter((contact) => {
                if(contact.username.slice(0, input.length).includes(input)) // Case sensitive
                    return true;  
            })
            if(!search) {
                handleUsers(null);
            } else {
                handleUsers(search);
            }
        }; 
    };

    useEffect(() => {
        searchForUsers();
    },[input]);

  return (
    <input className='w-custom_margin min-h-10 px-5 mx-3 my-3 placholder-gray-400 bg-[#40444b] focus:outline-none rounded-xl' placeholder='Search through contacts' onChange={(e) => handleChange(e)} type='text' value={input} name='users' />
  );
};

export default SearchContacts
