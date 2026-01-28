import { api } from "../api";

/**
 * Types simples (tu pourras les typer plus tard proprement)
 */
type User = {
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

type AuthResponse = {
  success: boolean;
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
};

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    // =========================
    // LOGIN
    // =========================
    login: build.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        data: body // ⚠️ IMPORTANT pour axios
      }),
      invalidatesTags: ["Auth"]
    }),

    // =========================
    // REGISTER
    // =========================
    register: build.mutation<
      AuthResponse,
      {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        password: string;
        wilayaCode: string;
        isDriver: boolean;
        isPassenger: boolean;
      }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        data: body // ⚠️ IMPORTANT pour axios
      }),
      invalidatesTags: ["Auth"]
    }),

    // =========================
    // REFRESH TOKEN
    // =========================
    refresh: build.mutation<
      { success: boolean; data: { accessToken: string } },
      { refreshToken: string }
    >({
      query: (body) => ({
        url: "/auth/refresh",
        method: "POST",
        data: body
      })
    }),

    // =========================
    // LOGOUT (optionnel)
    // =========================
    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST"
      }),
      invalidatesTags: ["Auth"]
    })
  }),
  overrideExisting: false
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation
} = authApi;
