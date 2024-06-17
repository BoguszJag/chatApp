import React from 'react'
import useAuth from '../hooks/useAuthContext'

type props = {
    msgID: string,
    msgSenderID: string,
    msgText: string,
    msgDate: string
}

function Message({msgID, msgSenderID, msgText, msgDate}: props) {
    const {auth} = useAuth();

    return (
        <div className={'flex flex-col rounded-md w-1/2 h-fit border border-red-500 text-wrap break-words '+ (auth?.id === msgSenderID ? 'ml-auto' : 'mr-auto')} id={msgID}>
            <p>{msgText}</p>
            <p className='text-10'>{msgDate}</p>
        </div>
    )
}

export default Message
