import React from 'react'

type props = {
    uid: string,
    username: string,
    lastMessage: string | null,
    senderID: string | null,
    isDisplayed: boolean | null,
    handleChat: (contactID: string, contactName: string) => void,
    handleSidepanelState: React.Dispatch<React.SetStateAction<string>>
};

function Contact({uid, username, lastMessage, senderID, isDisplayed, handleChat, handleSidepanelState}: props) {

    const handleClick = () => {
        handleChat(uid, username);
        handleSidepanelState('hide');
    };

// onClick={uid !== chat?.contact ? () => handleClick() : undefined}

    return (
        <div id={uid} onClick={handleClick} className='flex flex-col justify-normal px-2 py-1 hover:bg-[#40444b] mx-3 rounded-xl overflow-hidden text-nowrap'>
            {<p className={!isDisplayed ? 'oswald-700 text-gray-400' : ''}>{username}</p>} 
            <p className={`text-[14px] ` + (!isDisplayed ? 'oswald-700 text-gray-400' : null)}>{senderID ? (senderID !== uid ? 'You: ' : username + ': ') : null}{lastMessage ? lastMessage.slice(0, 15) : null}</p>
        </div>
    )
}

export default Contact
