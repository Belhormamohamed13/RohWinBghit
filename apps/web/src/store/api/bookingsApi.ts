import { api } from "../api";
import type { ApiResponse, BookingDto } from "../../types/api";

export type CreateBookingArgs = {
  tripId: string;
  seatCount: number;
  passengerMessage?: string;
};

export const bookingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createBooking: build.mutation<ApiResponse<BookingDto>, CreateBookingArgs>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        data: body
      }),
      invalidatesTags: (result) =>
        result?.data
          ? [
              { type: "Booking" as const, id: result.data._id },
              { type: "Trip" as const, id: typeof result.data.trip === "string" ? result.data.trip : result.data.trip._id },
              { type: "Booking" as const, id: "LIST_ME" }
            ]
          : [{ type: "Booking" as const, id: "LIST_ME" }]
    }),
    getMyBookings: build.query<ApiResponse<BookingDto[]>, void>({
      query: () => ({ url: "/bookings/me", method: "GET" }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((b) => ({ type: "Booking" as const, id: b._id })),
              { type: "Booking" as const, id: "LIST_ME" }
            ]
          : [{ type: "Booking" as const, id: "LIST_ME" }]
    })
  })
});

export const { useCreateBookingMutation, useGetMyBookingsQuery } = bookingsApi;

