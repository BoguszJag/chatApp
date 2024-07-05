import React, { useEffect, useRef, useState } from 'react'
import useChat from '../hooks/useChatContext'
import Message from './Message';
import useSocket from '../hooks/useSocketContext';
import useAuth from '../hooks/useAuthContext';

function ChatMsgField() {
  const {chat, getMessages, messages, chatLoading} = useChat();
  const [isTyping, setIsTyping] = useState(false);
  const {auth} = useAuth();
  const {socket} = useSocket();

  const scrollDiv = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  let ref = useRef<{prevScrollTop: number | undefined, prevScrollHeight: number | undefined} | undefined>();

  // let contactRef = useRef<string | undefined>();

  const scrollToBottom = () => {
    scrollDiv.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const snapToBottom = () => {
    scrollDiv.current?.scrollIntoView({ behavior: 'instant' });
  };

  useEffect(() => {
    let prevScrollTop: number | undefined;
    let prevScrollHeight: number | undefined;

    const scrollElement = scrollRef.current;

    const handleScroll = () => {
      prevScrollTop = scrollRef.current?.scrollTop
      prevScrollHeight = scrollRef.current?.scrollHeight
      ref.current = {prevScrollTop, prevScrollHeight}
    };

    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll);
    };

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      };
    };
  },[scrollRef])

  useEffect(() => {
    getMessages();
  },[chat?.contact]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    socket.on('typing', (senderID) => {
      if(auth && (auth?.id !== senderID)) {
        setIsTyping(true);
      };

      clearTimeout(timer);
      
      timer = setTimeout(() => {
        setIsTyping(false);
    }, 3000);
    });

    socket.on('stopedTyping', (senderID) => {
      if(auth && (auth?.id !== senderID)) {
        setIsTyping(false);
      };
    });

  },[auth, socket]);

  useEffect(() => {
    if(scrollRef.current && ref.current?.prevScrollTop && ref.current.prevScrollHeight && (ref.current?.prevScrollTop + scrollRef.current.clientHeight === ref.current?.prevScrollHeight)) {
      scrollToBottom();
    } else {
      snapToBottom();
    };
  },[messages]);

  return (
    <div ref={scrollRef} className='flex flex-col h-full w-full whitespace-nowrap overflow-y-scroll overflow-x-hidden scrollbar'>
      {chat === null && !chatLoading ? <div className='h-full w-full flex flex-col items-center justify-center text-2xl text-wrap mx-2'>Click on a contact to open up a chat</div> : null}
      {chatLoading ? <div className='h-full w-full flex flex-col items-center justify-center l'><div className='loading-spinner'></div></div> : null}
      {!chatLoading && messages ? messages.map((message) => {
        return (
          <Message key={message.msg_id} msgID={message.msg_id} msgSenderID={message.sender_id} msgDate={message.date} msgText={message.msg_text} />
        )
      }) : null}
      <div ref={scrollDiv}></div>
      {isTyping ? <p className='h-[24px]'>{chat?.contactName} is typing...</p> : <p className='mt-auto pt-[24px]'></p>}
    </div>
  )
}

export default ChatMsgField
