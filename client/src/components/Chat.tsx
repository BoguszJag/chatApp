import React from 'react'
import ChatInfoBar from './ChatInfoBar'
import ChatBottomBar from './ChatBottomBar'
import ChatMsgField from './ChatMsgField'

function Chat() {
  
  return (
    <div className='flex flex-col justify-normal items-start border-r border-y border-gray-400 h-dvh'>
      <ChatInfoBar />
      <ChatMsgField />
      <ChatBottomBar />
    </div>
  )
}

export default Chat