import React from 'react'
import ChatInfoBar from './ChatInfoBar'
import ChatBottomBar from './ChatBottomBar'
import ChatMsgField from './ChatMsgField'

type props = {
  windowWidth: number
};

function Chat({windowWidth}: props) {
  
  return (
    <div className={'flex flex-col justify-normal items-start h-[98dvh] m-2 rounded-3xl bg-[#2f3136]'}>
      <ChatInfoBar />
      <ChatMsgField />
      <ChatBottomBar />
    </div>
  )
}

export default Chat