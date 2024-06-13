import React, { createContext } from 'react'
import { io, Socket } from 'socket.io-client';

type SocketContextType = {
    socket: Socket
}

const socket = io('http://localhost:3001');

const SocketContext = createContext<SocketContextType>({socket});

export const SocketContextProvider: React.FC<{children: React.ReactNode}> = ({children}) => {

  return (
    <SocketContext.Provider value={{ socket }}>
        {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
