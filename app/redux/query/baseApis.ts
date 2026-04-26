import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";

const baseUrl = "http://10.10.20.9:9050/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers: any) => {
    const token = await SecureStore.getItemAsync("accessToken");
    console.log(token)
    if (!token) {
      router.replace("/");
      return headers;
    }

    headers.set("Authorization", `${token}`);
    return headers;
  },
});

const baseQueryWithServerCheck: any = async (args: any, api: any, extraOptions: any) => {
  try {
    // health check request
    const response = await fetch(baseUrl.replace("/api/v1", ""));

    if (!response.ok) {
      router.replace("/server-down");
      return { error: { status: "SERVER_DOWN" } };
    }

  } catch (error) {
    router.replace("/server-down");
    return { error: { status: "SERVER_DOWN" } };
  }

  return rawBaseQuery(args, api, extraOptions);
};

const baseApis = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithServerCheck,
  tagTypes: [
    "auth",
    "profile",
    "property",
    "product",
    "project",
    "subcategory",
    "cart",
    "shippingAddress",
    "pickupAddress",
    "order",
    "privacyPolicy",
    "termsAndConditions",
    "notification",
    "propertyFile",
    "invoice",
    "paymentPlan",
    "construction"
  ],
  endpoints: () => ({}),
});

export default baseApis;