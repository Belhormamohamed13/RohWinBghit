import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '../store/authStore'
import type {
  LoginRequest,
  RegisterRequest,
  CreateTripRequest,
  UpdateTripRequest,
  TripSearchParams,
  CreateBookingRequest,
  ConfirmPaymentRequest,
  CreateVehicleRequest,
  UpdateVehicleRequest,
  ProcessPaymentRequest,
  CreatePaymentIntentRequest,
  CreateReviewRequest,
  UpdateProfileRequest,
} from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const { refreshToken } = useAuthStore.getState()

        if (refreshToken) {
          // Try to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          })

          const { accessToken, refreshToken: newRefreshToken } = response.data.data

          useAuthStore.getState().setTokens(accessToken, newRefreshToken)

          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`
          }

          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API methods
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),

  register: (data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    role: string
  }) => api.post('/auth/register', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  verifyEmail: (token: string) =>
    api.get(`/auth/verify-email?token=${token}`),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  logout: () => api.post('/auth/logout'),

  me: () => api.get('/auth/me'),
}

export const tripsApi = {
  search: (params: TripSearchParams) => api.get('/trips/search', { params }),

  getById: (id: string) => api.get(`/trips/${id}`),

  create: (data: CreateTripRequest) => api.post('/trips', data),

  update: (id: string, data: UpdateTripRequest) => api.put(`/trips/${id}`, data),

  delete: (id: string) => api.delete(`/trips/${id}`),

  getMyTrips: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/trips/my-trips', { params }),

  cancel: (id: string, reason: string) =>
    api.post(`/trips/${id}/cancel`, { reason }),
}

export const bookingsApi = {
  create: (data: CreateBookingRequest) => api.post('/bookings', data),

  getMyBookings: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get('/bookings/my-bookings', { params }),

  getById: (id: string) => api.get(`/bookings/${id}`),

  getByTrip: (tripId: string) => api.get(`/bookings/trip/${tripId}`),

  cancel: (id: string, reason: string) =>
    api.post(`/bookings/${id}/cancel`, { reason }),

  confirmPayment: (id: string, paymentData: ConfirmPaymentRequest) =>
    api.post(`/bookings/${id}/confirm-payment`, paymentData),

  updateStatus: (id: string, status: string) =>
    api.patch(`/bookings/${id}/status`, { status }),
}


export const wilayasApi = {
  getAll: () => api.get('/wilayas'),

  getByCode: (code: number) => api.get(`/wilayas/${code}`),

  search: (query: string) => api.get('/wilayas/search', { params: { q: query } }),

  getPopular: () => api.get('/wilayas/popular'),
}

export const vehiclesApi = {
  getMyVehicles: () => api.get('/vehicles/my-vehicles'),

  create: (data: CreateVehicleRequest) => api.post('/vehicles', data),

  update: (id: string, data: UpdateVehicleRequest) => api.put(`/vehicles/${id}`, data),

  delete: (id: string) => api.delete(`/vehicles/${id}`),
  uploadImage: (formData: FormData) => api.post('/vehicles/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}

export const paymentsApi = {
  getMethods: () => api.get('/payments/methods'),

  process: (data: ProcessPaymentRequest) => api.post('/payments/process', data),

  createIntent: (data: CreatePaymentIntentRequest) => api.post('/payments/intent', data),

  refund: (bookingId: string, reason: string) =>
    api.post(`/payments/refund/${bookingId}`, { reason }),
}

export const reviewsApi = {
  create: (data: CreateReviewRequest) => api.post('/reviews', data),

  getByUser: (userId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/user/${userId}`, { params }),

  getCanReview: (bookingId: string) =>
    api.get(`/reviews/can-review/${bookingId}`),
}

export const chatApi = {
  getChats: () => api.get('/chats'),

  getMessages: (chatId: string, params?: { page?: number; limit?: number }) =>
    api.get(`/chats/${chatId}/messages`, { params }),

  sendMessage: (chatId: string, content: string, type?: string) =>
    api.post(`/chats/${chatId}/messages`, { content, type }),

  markAsRead: (chatId: string) =>
    api.post(`/chats/${chatId}/read`),

  initiate: (targetUserId: string) =>
    api.post('/chats/initiate', { targetUserId }),
}

export const userApi = {
  updateProfile: (data: UpdateProfileRequest) => api.put('/users/profile', data),

  uploadAvatar: (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.put('/users/password', data),

  getNotifications: (params?: { page?: number; limit?: number }) =>
    api.get('/users/notifications', { params }),

  markNotificationAsRead: (id: string) =>
    api.post(`/users/notifications/${id}/read`),

  submitVerification: (data: {
    identityCardFrontUrl?: string
    identityCardBackUrl?: string
    licenseFrontUrl?: string
    licenseBackUrl?: string
  }) => api.post('/users/verification/submit', data),

  uploadVerificationDocs: (formData: FormData) =>
    api.post('/users/upload-docs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

export const driverApi = {
  getStats: () => api.get('/driver/stats'),
  getTransactions: () => api.get('/driver/transactions'),
}

export const adminApi = {
  getStats: () => api.get('/admin/stats'),

  getUsers: (params?: { query?: string; role?: string; limit?: number; offset?: number }) =>
    api.get('/admin/users', { params }),

  updateUserRole: (id: string, role: string) =>
    api.patch(`/admin/users/${id}/role`, { role }),

  verifyUser: (id: string) =>
    api.patch(`/admin/users/${id}/verify`),

  getVehicles: (params?: { status?: string }) =>
    api.get('/admin/vehicles', { params }),

  verifyVehicle: (id: string) =>
    api.patch(`/admin/vehicles/${id}/verify`),

  rejectVehicle: (id: string) =>
    api.patch(`/admin/vehicles/${id}/reject`),

  getTrips: (params?: { status?: string }) =>
    api.get('/admin/trips', { params }),
}

export default api
