export interface Invoice {
  id: string
  pdfLink: string
  date: string
  status: 'pending' | 'paid'
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
