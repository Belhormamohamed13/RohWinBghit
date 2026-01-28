import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "../utils/axiosBaseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Auth", "User", "Trip", "Booking", "Message", "Notification", "Payment", "Review"],
  endpoints: (build) => ({
    health: build.query<{ ok: boolean; name: string; env: string }, void>({
      query: () => ({ url: "/health", method: "GET" })
    })
  })
});

export const { useHealthQuery } = api;

