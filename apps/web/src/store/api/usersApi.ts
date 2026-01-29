import { api } from "../api";
import type { ApiResponse } from "../../types/api";

export type MeDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  wilayaCode: string;
  roles: string[];
  isDriver: boolean;
  isPassenger: boolean;
};

export const usersApi = api.injectEndpoints({
  endpoints: (build) => ({
    me: build.query<ApiResponse<MeDto>, void>({
      query: () => ({ url: "/users/me", method: "GET" }),
      providesTags: [{ type: "User" as const, id: "ME" }]
    })
  })
});

export const { useMeQuery } = usersApi;

