import { api } from "../api";
import type { ApiResponse, TripDto } from "../../types/api";

export const myTripsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMyTrips: build.query<ApiResponse<TripDto[]>, void>({
      query: () => ({ url: "/trips/me/mine", method: "GET" }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((trip) => ({ type: "Trip" as const, id: trip._id })),
              { type: "Trip" as const, id: "MY_TRIPS" }
            ]
          : [{ type: "Trip" as const, id: "MY_TRIPS" }]
    })
  })
});

export const { useGetMyTripsQuery } = myTripsApi;

