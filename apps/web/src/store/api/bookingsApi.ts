import { api } from "../api";
import type { ApiResponse, BookingDto } from "../../types/api";

export type CreateBookingArgs = {
  tripId: string;
  seatCount: number;
  passengerMessage?: string;
};

export type BookingActionDto = {
  id: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  seatCount: number;
  tripId: string;
  passengerId: string;
};

export const bookingsApi = api.injectEndpoints({
  endpoints: (build) => ({
    createBooking: build.mutation<ApiResponse<BookingDto>, CreateBookingArgs>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        data: body
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const created = data.data;

          // Optimistic for UX (disable duplicate booking CTA).
          dispatch(
            bookingsApi.util.updateQueryData("getMyBookings", undefined, (draft: any) => {
              if (!draft?.data) return;
              const exists = (draft.data as BookingDto[]).some((b) => b._id === created._id);
              if (!exists) draft.data.unshift(created);
            })
          );
        } catch {
          // ignore
        }
      }
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
    }),

    getBookingsForTrip: build.query<ApiResponse<BookingDto[]>, string>({
      query: (tripId) => ({ url: `/bookings/trip/${tripId}`, method: "GET" })
    }),

    acceptBooking: build.mutation<ApiResponse<BookingActionDto>, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/accept`,
        method: "PATCH"
      })
    }),
    rejectBooking: build.mutation<ApiResponse<BookingActionDto>, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/reject`,
        method: "PATCH"
      })
    }),
    cancelBooking: build.mutation<ApiResponse<BookingActionDto>, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}/cancel`,
        method: "PATCH"
      })
    })
  })
});

export const {
  useCreateBookingMutation,
  useGetMyBookingsQuery,
  useGetBookingsForTripQuery,
  useAcceptBookingMutation,
  useRejectBookingMutation,
  useCancelBookingMutation
} = bookingsApi;

