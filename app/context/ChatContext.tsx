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
  ticketData: any,
  setTickData: any
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
  const [ticketData, setTickData] = useState([])

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
        console.log('Socket connected successfully');
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error: any) => {
        console.log('Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);
    } catch (error: any) {
      setIsConnected(false);
    }
  };

  const joinTicketRoom = (ticketId: string) => {
    console.log('joinTicketRoom called:', ticketId, 'socket exists:', !!socket, 'isConnected:', isConnected);
    if (socket && isConnected) {
      console.log('Emitting join-ticket event for ticket:', ticketId);
      socket.emit('join-ticket', { ticketId });

      // Listen for acknowledgment
      socket.once('join-ticket-ack', (response) => {
        console.log('Join ticket acknowledgment:', response);
      });
    } else {
      console.log('Cannot join room - socket not connected');
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
      console.log('Setting up receive-message listener');
      socket.on('receive-message', (message) => {
        console.log('Socket received message:', message);
        callback(message);
      });

      // Also listen for all socket events for debugging
      socket.onAny((eventName, ...args) => {
        console.log('Socket event received:', eventName, args);
      });

      return () => {
        console.log('Removing receive-message listener');
        socket.off('receive-message', callback);
      };
    }
    console.log('Socket not available for message listener');
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
    markSeen,
    ticketData,
    setTickData
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
