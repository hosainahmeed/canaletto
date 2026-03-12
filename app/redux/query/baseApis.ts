import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

const baseQuery = fetchBaseQuery({
  baseUrl: "https://rnj64vmh-9050.inc1.devtunnels.ms/api/v1",
  prepareHeaders: async (headers: any) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseApis = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "auth",
    "profile",
    "property",
    "product",
    "category",
    "subcategory",
    "cart",
    "shippingAddress",
    "pickupAddress",
    "order",
    "privacyPolicy",
    "termsAndConditions",
    "notification",
  ],
  endpoints: () => ({}),
});

export default baseApis;
