import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getSocket } from "./socket";
import { api } from "../store/api";
import type { BookingDto, MessageDto } from "../types/api";

type BookingStatusEvent = {
  bookingId: string;
  tripId: string;
  status: BookingDto["status"];
  seatCount: number;
  previousStatus: BookingDto["status"];
};

type MessageCreatedEvent = {
  tripId?: string;
  message: MessageDto;
};

export function RealtimeEventsListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();

    const onMessageCreated = (payload: MessageCreatedEvent) => {
      if (!payload.tripId) return;
      dispatch(
        api.util.updateQueryData("getMessagesByTrip", payload.tripId, (draft: any) => {
          if (!draft?.data) {
            return draft;
          }
          const exists = draft.data.some((m: MessageDto) => m._id === payload.message._id);
          if (!exists) {
            draft.data.push(payload.message);
          }
        })
      );
    };

    const onBookingStatusChanged = (payload: BookingStatusEvent) => {
      // Update trip seat counts in detail view
      dispatch(
        api.util.updateQueryData("getTripById", payload.tripId, (draft: any) => {
          if (!draft?.data) return draft;
          const trip = draft.data;
          if (
            payload.previousStatus === "pending" &&
            payload.status === "accepted"
          ) {
            trip.seatsAvailable = Math.max(0, trip.seatsAvailable - payload.seatCount);
          } else if (
            payload.previousStatus === "accepted" &&
            (payload.status === "cancelled" || payload.status === "rejected")
          ) {
            trip.seatsAvailable = trip.seatsAvailable + payload.seatCount;
          }
        })
      );

      // Update bookings list for current user
      dispatch(
        api.util.updateQueryData("getMyBookings", undefined, (draft: any) => {
          if (!draft?.data) return draft;
          const booking = (draft.data as BookingDto[]).find((b) => b._id === payload.bookingId);
          if (booking) {
            booking.status = payload.status;
          }
        })
      );
    };

    socket.on("message.created", onMessageCreated);
    socket.on("booking.statusChanged", onBookingStatusChanged);

    return () => {
      socket.off("message.created", onMessageCreated);
      socket.off("booking.statusChanged", onBookingStatusChanged);
    };
  }, [dispatch]);

  return null;
}

