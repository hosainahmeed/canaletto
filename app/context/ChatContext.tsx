import { ChatMessage, SupportTicket } from '@/app/types/chat';
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinTicketRoom: (ticketId: string) => void;
  disconnectSocket: () => void;
  initializeSocket: () => void;
  sendMessage: (ticketId: string, message: string, attachments?: string[]) => Promise<void>;
  onNewMessage: (callback: (message: ChatMessage) => void) => () => void;
  onTicketUpdated: (callback: (ticket: SupportTicket) => void) => () => void;
  markSeen: (ticketId: string) => Promise<void>;
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

      const newSocket = io('http://10.10.20.9:9050', {
        auth: {
          token: token
        },
        transports: ['websocket']
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error: any) => {
        setIsConnected(false);
      });

      setSocket(newSocket);
    } catch (error: any) {
      setIsConnected(false);
    }
  };

  const joinTicketRoom = (ticketId: string) => {
    if (socket && isConnected) {
      socket.emit('join-ticket', { ticketId });
    }
  };

  const markSeen = async (ticketId: string) => {
    if (!socket) {
      throw new Error('Socket not initialized');
    }

    if (!isConnected) {
      throw new Error('Socket not connected');
    }

    socket.emit('mark-seen', { ticketId });
  };

  const sendMessage = async (ticketId: string, message: string, attachments?: string[]): Promise<void> => {
    if (!socket) {
      throw new Error('Socket not initialized');
    }

    if (!isConnected) {
      throw new Error('Socket not connected');
    }

    // Just emit the message and return immediately
    // The real message will come through the socket event
    socket.emit('send-message', {
      ticketId,
      message,
      ...(attachments && { attachments })
    });
  };

  const onNewMessage = (callback: (message: any) => void) => {
    if (socket) {
      socket.on('receive-message', callback);
      return () => {
        socket.off('receive-message', callback);
      };
    }
    return () => { };
  };

  const onTicketUpdated = (callback: (ticket: any) => void) => {
    if (socket) {
      socket.on('ticket-updated', callback);
      return () => {
        socket.off('ticket-updated', callback);
      };
    }
    return () => { };
  };

  const disconnectSocket = () => {
    if (socket) {
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    initializeSocket();
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
    sendMessage,
    onNewMessage,
    onTicketUpdated,
    markSeen
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
