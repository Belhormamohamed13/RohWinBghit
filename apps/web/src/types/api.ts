export type ApiError = {
  code: string;
  message: string;
};

export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown> | null;
  error: ApiError | null;
};

export type TripDto = {
  _id: string;
  driver: string;
  departureCity: string;
  departureWilayaCode: string;
  arrivalCity: string;
  arrivalWilayaCode: string;
  departureAt: string;
  arrivalEstimateAt?: string;
  seatsTotal: number;
  seatsAvailable: number;
  pricePerSeat: number;
  description: string;
  status: "draft" | "published" | "closed" | "in_progress" | "completed" | "cancelled";
};

export type BookingDto = {
  _id: string;
  trip: string | TripDto;
  passenger: string;
  seatCount: number;
  totalAmount: number;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
  payment: {
    status: "not_required" | "pending" | "paid" | "failed" | "refunded";
    method: "cash" | "cib_sim" | "baridimob_sim" | null;
    providerRef: string;
  };
  passengerMessage: string;
  createdAt: string;
  updatedAt: string;
};

export type MessageDto = {
  _id: string;
  sender: string;
  receiver: string;
  trip?: string;
  booking?: string;
  content: string;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
};

