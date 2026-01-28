import { api } from "../api";
import type { ApiResponse, TripDto } from "../../types/api";

export type SearchTripsArgs = {
  from: string;
  to: string;
  date?: string;
  seats?: number;
};

export const tripsApi = api.injectEndpoints({
  endpoints: (build) => ({
    searchTrips: build.query<ApiResponse<TripDto[]>, SearchTripsArgs>({
      query: ({ from, to, date, seats }) => ({
        url: "/trips",
        method: "GET",
        params: {
          from,
          to,
          date,
          seats
        }
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((trip) => ({ type: "Trip" as const, id: trip._id })),
              { type: "Trip" as const, id: "LIST" }
            ]
          : [{ type: "Trip" as const, id: "LIST" }]
    }),
    getTripById: build.query<ApiResponse<TripDto>, string>({
      query: (id) => ({ url: `/trips/${id}`, method: "GET" }),
      providesTags: (result, _error, id) => [{ type: "Trip" as const, id }]
    })
  })
});

export const { useSearchTripsQuery, useGetTripByIdQuery } = tripsApi;

