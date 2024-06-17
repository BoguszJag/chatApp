import React from 'react'

type props = {
    id: string,
    username: string,
    lastMessage: string
    handleChat: (contactID: string, contactName: string) => void
};

function Contact({id, username, lastMessage, handleChat}: props) {

    return (
        <div id={id} onClick={() => handleChat(id, username)} className='flex justify-normal items-center px-5 border-gray-400 border-b-[1px] hover:bg-gray-500 hover:text-black hover:border-black h-12 w-full'>
            {username} 
            <p className='ml-10 text-[14px]'>{lastMessage ? lastMessage.slice(0, 15) : null}</p>
        </div>
    )
}

export default Contact
