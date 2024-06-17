import React, { useEffect } from 'react'
import useChat from '../hooks/useChatContext'
import Message from './Message';

function ChatMsgField() {
  const {chat, getMessages, messages} = useChat();

  useEffect(() => {
    getMessages();
  },[chat?.contact])

  return (
    <div className='h-full w-full whitespace-nowrap overflow-y-scroll'>
        {messages ? messages.map(message => {
        return (
          <Message key={message.msg_id} msgID={message.msg_id} msgSenderID={message.sender_id} msgDate={message.date} msgText={message.msg_text} />
        )
      }) : null}
    </div>
  )
}

export default ChatMsgField
