export interface MarketUpdateType {
  id: string;
  contentManagerId: string;
  title: string;
  description: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  contentManager: {
    name: string;
    email: string;
    profile_image: string;
  };
}

export enum MarketUpdateFilterType {
  MARKET_NEWS,
  PROPERTY_PRICE_UPDATES,
  REGULATORY_AND_LEGAL_CHANGES,
  INVESTMENT_TRENDS_AND_DATA,
  ECONOMIC_UPDATES
}