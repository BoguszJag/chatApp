import React from 'react'
import useChat from '../hooks/useChatContext'

function ChatBottomBar() {
  const {chat} = useChat();

  return (
    <div className='flex flex-row mt-auto justify-normal items-center w-full h-[39px]'>
      <input disabled={!chat ? true : false} className='w-5/6 h-10 px-5 border-y border-r border-gray-400 placholder-gray-400 bg-gray-950' type="text" placeholder='Type a message...'/>
      <button disabled={!chat ? true : false} className='w-1/6 h-10 border-y border-gray-400'>Send</button>
    </div>
  )
}

export default ChatBottomBar
