import React from 'react'
import useChat from '../hooks/useChatContext'
import Message from './Message';

function ChatMsgField() {
  const {chat} = useChat();

  return (
    <div className='h-full w-full overflow-y-auto'>
      {chat ? chat.map(messages => {
        return (
          <Message key={messages.msg_id} msgID={messages.msg_id} msgDate={messages.date} msgText={messages.msg_text} />
        )
      }) : null}
    </div>
  )
}

export default ChatMsgField
