import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Alert } from "react-native";

const baseUrl = "https://rnj64vmh-9050.inc1.devtunnels.ms/api/v1";

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers: any) => {
    const token = await SecureStore.getItemAsync("accessToken");

    if (!token) {
      Alert.alert("Error", "No token found");
      router.replace("/(auth)/login");
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
  ],
  endpoints: () => ({}),
});

export default baseApis;