import React from 'react'
import useChat from '../hooks/useChatContext';

type props = {
    id: string,
    username: string,
    lastMessage: string,
    senderID: string,
    isDisplayed: boolean,
    handleChat: (contactID: string, contactName: string) => void,
    handleSidepanelState: React.Dispatch<React.SetStateAction<string>>
};

function Contact({id, username, lastMessage, senderID, isDisplayed, handleChat, handleSidepanelState}: props) {
    const {chat} = useChat();

    const handleClick = () => {
        handleChat(id, username);
        handleSidepanelState('hide');
    };

    return (
        <div id={id} onClick={id !== chat?.contact ? () => handleClick() : undefined} className='flex flex-col justify-normal px-2 py-1 hover:bg-[#40444b] mx-3 rounded-xl overflow-hidden text-nowrap'>
            {<p className={!isDisplayed ? 'oswald-700 text-gray-400' : ''}>{username}</p>} 
            <p className={`text-[14px] ` + (!isDisplayed ? 'oswald-700 text-gray-400' : null)}>{senderID ? (senderID !== id ? 'You: ' : username + ': ') : null}{lastMessage ? lastMessage.slice(0, 15) : null}</p>
        </div>
    )
}

export default Contact
