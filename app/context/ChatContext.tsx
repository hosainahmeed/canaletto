import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinTicketRoom: (ticketId: string) => void;
  disconnectSocket: () => void;
  initializeSocket: () => void;
  sendMessage: (ticketId: string, message: string, attachments?: string[]) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const initializeSocket = async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");

      if (!token) {
        console.log('No token found for socket connection');
        return;
      }

      // Close existing connection if any
      if (socket) {
        socket.disconnect();
      }

      const newSocket = io('http://10.10.20.9:3500', {
        auth: {
          token: token
        },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        console.log('Socket connected successfully');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error: any) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);
    } catch (error: any) {
      console.error('Error initializing socket:', error);
      setIsConnected(false);
    }
  };

  const joinTicketRoom = (ticketId: string) => {
    if (socket && isConnected) {
      socket.emit('join-ticket', { ticketId });
      console.log('Joined ticket room:', ticketId);
    } else {
      console.log('Socket not connected, cannot join ticket room');
    }
  };

  const sendMessage = (ticketId: string, message: string, attachments?: string[]) => {
    if (socket && isConnected) {
      socket.emit('send-message', {
        ticketId,
        message,
        ...(attachments && { attachments })
      });
      console.log('Sent message:', message);
    } else {
      console.log('Socket not connected, cannot send message');
    }
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    // Initialize socket on component mount
    initializeSocket();

    // Cleanup on unmount
    return () => {
      disconnectSocket();
    };
  }, []);

  const value: ChatContextType = {
    socket,
    isConnected,
    joinTicketRoom,
    disconnectSocket,
    initializeSocket,
    sendMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
