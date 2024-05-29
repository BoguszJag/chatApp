import React from 'react'

type props = {
    msgID: string,
    msgText: string,
    msgDate: string
}

function Message({msgID, msgText, msgDate}: props) {

    return (
        <div className='flex flex-col rounded-md w-1/2 h-fit border border-red-500 text-wrap break-words' id={msgID}>
            Username
            <p>{msgText}</p>
            <p className='text-10'>{msgDate}</p>
        </div>
    )
}

export default Message
