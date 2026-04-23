export interface SupportTicket {
  id: string;
  issue: string;
  clientId: string;
  supportMemberId: string;
  propertyId: string | null;
  status: 'IN_PROGRESS' | 'CLOSED' | 'PENDING';
  priority: 'NORMAL' | 'HIGH' | 'LOW';
  expiresAt: string;
  closedAt: string | null;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageId: string;
  createdAt: string;
  updatedAt: string;
  unseenCount: number;
}

export interface ChatMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderRole: 'CLIENT' | 'SUPPORT' | 'ADMIN';
  message: string;
  attachments: string[];
  senderName: string;
  senderProfileImage: string;
  isSeen: boolean;
  seenAt: Date | null;
  createdAt: Date;
}

export interface SocketMessagePayload {
  ticketId: string;
  message: string;
  attachments?: string[];
}
