import React from 'react'

type props = {
    id: string,
    username: string,
    handleChat: (contactID: string) => void
};

function Contact({id, username, handleChat}: props) {

    return (
        <div id={id} onClick={() => handleChat(id)} className='flex justify-normal items-center px-5 border-gray-400 border-b-[1px] hover:bg-gray-500 hover:text-black hover:border-black h-12 w-full'>
            {username} 
            <p className='ml-10 text-[14px]'>Last message</p>
        </div>
    )
}

export default Contact
