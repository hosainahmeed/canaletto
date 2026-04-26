export interface Invoice {
  id: string
  propertyId: string
  clientId: string
  invoiceDate: string
  dueDate: string
  amount: number
  status: 'OPEN' | 'PARTIALLY_PAID' | 'PAID'
  paymentDate: string
  document_url: string
  createdAt: string
  updatedAt: string
}

export interface PaymentPlan {
  id: string
  propertyId: string
  managerId: string
  name: string
  file_url: string
  createdAt: string
  updatedAt: string
  property: {
    name: string
  }
  manager: {
    name: string
    profile_image: string
  }
}

export interface FileItem {
  id: string
  name: string
  file_url: string
  createdAt: string
  updatedAt: string
}
