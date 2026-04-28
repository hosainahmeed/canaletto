export interface SiteUpdateType {
  id: string;
  propertyId: string;
  managerId: string;
  name: string;
  image: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  property: {
    name: string;
  };
  manager: {
    name: string;
    profile_image: string;
  };
}

export interface SiteUpdateResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    data: SiteUpdateType[];
  };
}