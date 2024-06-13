import React from 'react'
import useChat from '../hooks/useChatContext'

function ChatInfoBar() {
  const {chat} = useChat();

  return (
    <div className='flex flex-shrink-0 justify-normal items-center w-full h-[39px] border-b border-gray-400'>
      {chat ? chat.contact : null}
    </div>
  )
}

export default ChatInfoBar
