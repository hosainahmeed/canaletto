export interface ProjectTypes {
  id: string,
  contentManagerId: string,
  title: string,
  images: string[],
  description: string,
  typeOfUse: string,
  propertySize: string,
  totalRooms: number,
  propertyType: string,
  startingPrice: string,
  paymentPlan: string,
  investmentOption: string,
  handoverYear: string,
  location: string,
  createdAt: string,
  updatedAt: string,
  contentManager: {
    name: string,
    email: string,
    profile_image: string
  }
}