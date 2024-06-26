import React from 'react'

type props = {
    id: string,
    username: string,
    lastMessage: string,
    senderID: string,
    isDisplayed: boolean,
    handleChat: (contactID: string, contactName: string) => void
};

function Contact({id, username, lastMessage, senderID, isDisplayed, handleChat}: props) {
    return (
        <div id={id} onClick={() => handleChat(id, username)} className='flex flex-col justify-normal px-5 border-gray-400 border-b-[1px] hover:bg-gray-500 hover:text-black hover:border-black h-12 w-full'>
            {username} 
            <p className={`text-[14px]` + (!isDisplayed ? 'font-bold text-red-800' : null)}>{senderID ? (senderID !== id ? 'You: ' : username + ': ') : null}{lastMessage ? lastMessage.slice(0, 15) : null}</p>
        </div>
    )
}

export default Contact
