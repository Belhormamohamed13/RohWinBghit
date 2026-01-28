import { api } from "../api";
import type { ApiResponse, MessageDto } from "../../types/api";

export type SendMessageArgs = {
  receiverId: string;
  tripId?: string;
  bookingId?: string;
  content: string;
};

export const messagesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMessagesByTrip: build.query<ApiResponse<MessageDto[]>, string>({
      query: (tripId) => ({ url: `/messages/by-trip/${tripId}`, method: "GET" }),
      providesTags: (result, _err, tripId) =>
        result?.data
          ? [
              ...result.data.map((m) => ({ type: "Message" as const, id: m._id })),
              { type: "Message" as const, id: `TRIP_${tripId}` }
            ]
          : [{ type: "Message" as const, id: `TRIP_${tripId}` }]
    }),
    sendMessage: build.mutation<ApiResponse<MessageDto>, SendMessageArgs>({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        data: body
      }),
      invalidatesTags: (result) =>
        result?.data?.trip
          ? [{ type: "Message" as const, id: `TRIP_${String(result.data.trip)}` }]
          : []
    })
  })
});

export const { useGetMessagesByTripQuery, useSendMessageMutation } = messagesApi;

