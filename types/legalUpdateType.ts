export interface LegalUpdateType {
  id: string;
  contentManagerId: string;
  title: string;
  description: string;
  goodToKnow: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  contentManager: {
    name: string;
    email: string;
    profile_image: string;
  };
}