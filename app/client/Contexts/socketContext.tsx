import React, { createContext, useContext } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
  const socket = io('http://ec2-13-59-184-112.us-east-2.compute.amazonaws.com');

  // socket.on('connect', () => console.log('socket connected'));
  // socket.on('disconnect', () => console.log('socket disconnected'));

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
