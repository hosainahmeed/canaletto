export interface lifestyleTypes {
  id: string,
  contentManagerId: string,
  title: string,
  description: string,
  type: LifeStyleType,
  images: string[],
  website: string,
  location: string,
  goodToKnow: string[],
  createdAt: string,
  updatedAt: string,
  contentManager: {
    name: string,
    email: string,
    profile_image: string
  }
}

export enum LifeStyleType {
  HOTELS,
  RESORTS,
  BEACH_AND_WATERFRONT,
  DINING_AND_CAFES,
  SHOPPING_AND_ENTERTAINMENT,
  CITY_GUIDES,
}