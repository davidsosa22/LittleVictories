import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const socket = io('http://localhost:3000');

  // socket.on('connect', () => console.log('socket connected'));
  // socket.on('disconnect', () => console.log('socket disconnected'));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
