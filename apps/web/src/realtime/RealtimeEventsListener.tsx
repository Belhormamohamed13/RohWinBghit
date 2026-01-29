import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getSocket } from "./socket";
import type { BookingDto, MessageDto } from "../types/api";
import type { AppDispatch } from "../store/store";
import { messagesApi } from "../store/api/messagesApi";
import { tripsApi } from "../store/api/tripsApi";
import { bookingsApi } from "../store/api/bookingsApi";

type BookingStatusEvent = {
  bookingId: string;
  tripId: string;
  newStatus: BookingDto["status"];
  seatCount: number;
  previousStatus: BookingDto["status"];
};

type TripStatusEvent = {
  tripId: string;
  previousStatus: "draft" | "published";
  newStatus: "published" | "closed";
};

type MessageCreatedEvent = {
  tripId?: string;
  message: MessageDto;
};

export function RealtimeEventsListener() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = getSocket();

    const onMessageCreated = (payload: MessageCreatedEvent) => {
      if (!payload.tripId) return;
      dispatch(
        messagesApi.util.updateQueryData("getMessagesByTrip", payload.tripId, (draft: any) => {
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
        tripsApi.util.updateQueryData("getTripById", payload.tripId, (draft: any) => {
          if (!draft?.data) return draft;
          const trip = draft.data;
          if (
            payload.previousStatus === "pending" &&
            payload.newStatus === "accepted"
          ) {
            trip.seatsAvailable = Math.max(0, trip.seatsAvailable - payload.seatCount);
          } else if (
            payload.previousStatus === "accepted" &&
            (payload.newStatus === "cancelled" || payload.newStatus === "rejected")
          ) {
            trip.seatsAvailable = trip.seatsAvailable + payload.seatCount;
          }
        })
      );

      // Update bookings list for current user
      dispatch(
        bookingsApi.util.updateQueryData("getMyBookings", undefined, (draft: any) => {
          if (!draft?.data) return draft;
          const booking = (draft.data as BookingDto[]).find((b) => b._id === payload.bookingId);
          if (booking) {
            booking.status = payload.newStatus;
          }
        })
      );

      // Update driver trip bookings cache (if present)
      dispatch(
        bookingsApi.util.updateQueryData("getBookingsForTrip", payload.tripId, (draft: any) => {
          if (!draft?.data) return draft;
          const booking = (draft.data as BookingDto[]).find((b) => b._id === payload.bookingId);
          if (booking) booking.status = payload.newStatus;
        })
      );
    };

    const onTripStatusChanged = (payload: TripStatusEvent) => {
      dispatch(
        tripsApi.util.updateQueryData("getTripById", payload.tripId, (draft: any) => {
          if (!draft?.data) return draft;
          draft.data.status = payload.newStatus;
        })
      );
    };

    socket.on("message.created", onMessageCreated);
    socket.on("booking.statusChanged", onBookingStatusChanged);
    socket.on("trip.statusChanged", onTripStatusChanged);

    return () => {
      socket.off("message.created", onMessageCreated);
      socket.off("booking.statusChanged", onBookingStatusChanged);
      socket.off("trip.statusChanged", onTripStatusChanged);
    };
  }, [dispatch]);

  return null;
}

