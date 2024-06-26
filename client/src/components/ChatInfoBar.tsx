import React from 'react'
import useChat from '../hooks/useChatContext'

function ChatInfoBar() {
  const {chat} = useChat();

  return (
    <div className='flex flex-shrink-0 justify-normal items-center w-full h-[39px] border-b border-gray-400 rounded-t-3xl'>
      <p className='ml-4'>{chat ? chat.contactName : null}</p>
    </div>
  )
}

export default ChatInfoBar
