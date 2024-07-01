import React from 'react'
import useAuth from '../hooks/useAuthContext'
import useChat from '../hooks/useChatContext';

type props = {
    msgID: string,
    msgSenderID: string,
    msgText: string,
    msgDate: string
}

function Message({msgID, msgSenderID, msgText, msgDate}: props) {
    const {auth} = useAuth();
    const {chat} = useChat();

    return (
        <div className='flex flex-row mt-1'>
            {auth?.id !== msgSenderID ? 
            <p className='mt-auto mx-1 px-2 border-gray-400 border-solid-2 border-[1px] rounded-full'>{chat?.contactName.slice(0,1)}</p> : null}
            <div className={'flex flex-col rounded-3xl max-w-[40%] h-fit text-wrap break-words'+ (auth?.id === msgSenderID ? ' ml-auto mr-1 bg-[#40444b]' : ' mr-auto bg-[#292b2f]')} id={msgID}>
                <p className='p-2'>{msgText}</p>
                {/* <p className='text-10'>{msgDate}</p> */}
            </div>
        </div>
    )
}

export default Message
