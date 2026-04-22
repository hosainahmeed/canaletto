export interface MyTicket {
  id: string
  issue: string
  clientId: string
  supportMemberId: string
  propertyId: string | null
  status: string
  priority: string
  expiresAt: string
  closedAt: string | null
  lastMessage: string | null
  lastMessageAt: string | null
  lastMessageId: string | null
  createdAt: string
  updatedAt: string
  supportMember: {
    name: string
    profile_image: string
    id: string
  }
  unseenCount: number
}