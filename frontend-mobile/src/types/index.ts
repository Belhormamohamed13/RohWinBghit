// User types
export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    phone: string
    avatarUrl?: string
    role: 'passenger' | 'driver' | 'admin'
    isVerified: boolean
}

// Wilaya types
export interface Wilaya {
    code: number
    name: string
    nameAr: string
    coordinates: {
        latitude: number
        longitude: number
    }
}

// Trip types
export interface Trip {
    id: string
    driverId: string
    vehicleId: string
    from: {
        wilayaId: number
        city: string
        address?: string
        latitude?: number
        longitude?: number
    }
    to: {
        wilayaId: number
        city: string
        address?: string
        latitude?: number
        longitude?: number
    }
    departure: {
        date: string
        time: string
    }
    estimatedArrival?: string
    distance?: {
        km: number
        durationMinutes: number
    }
    seats: {
        available: number
        total: number
    }
    pricing: {
        perSeat: number
        total?: number
        strategy: 'standard' | 'dynamic'
        surgeMultiplier?: number
    }
    options: {
        luggageAllowed: boolean
        maxLuggageSize?: string
        smokingAllowed: boolean
        petsAllowed: boolean
        instantBooking: boolean
    }
    description?: string
    status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    driver?: DriverInfo
}

export interface DriverInfo {
    id: string
    firstName: string
    lastName: string
    fullName: string
    avatarUrl?: string
    phone?: string
    rating?: number
    totalTrips?: number
}

// Vehicle types
export interface Vehicle {
    id: string
    driverId: string
    make: string
    model: string
    year: number
    color: string
    licensePlate?: string
    licensePlateMasked?: string
    vehicleType: 'economy' | 'standard' | 'comfort' | 'premium' | 'luxury' | 'suv' | 'van'
    seats: number
    luggageCapacity: number
    features: {
        hasAc: boolean
        hasWifi: boolean
        allowsPets: boolean
        allowsSmoking: boolean
    }
    isVerified: boolean
}

// Booking types
export interface Booking {
    id: string
    tripId: string
    passengerId: string
    driverId: string
    seats: {
        booked: number
    }
    pricing: {
        perSeat: number
        total: number
        platformFee: number
        driverEarnings: number
    }
    locations: {
        pickup: {
            address: string
            latitude?: number
            longitude?: number
        }
        dropoff: {
            address: string
            latitude?: number
            longitude?: number
        }
    }
    luggage: {
        count: number
    }
    specialRequests?: string
    payment: {
        method: 'cib' | 'edahabia' | 'cash' | 'stripe' | 'paypal'
        status: 'pending' | 'completed' | 'refunded' | 'failed'
        transactionId?: string
        paidAt?: string
    }
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
    qrCode?: string
    trip?: Trip
    passenger?: User
    driver?: User
    createdAt: string
}

// Review types
export interface Review {
    id: string
    bookingId: string
    tripId: string
    reviewerId: string
    revieweeId: string
    reviewType: 'passenger_to_driver' | 'driver_to_passenger'
    ratings: {
        overall: number
        punctuality?: number
        cleanliness?: number
        communication?: number
        driving?: number
    }
    comment?: string
    isAnonymous: boolean
    createdAt: string
    reviewer?: User
}

// Payment types
export interface PaymentMethod {
    id: string
    name: string
    description: string
    icon: string
    requiresOnline: boolean
    supportedCurrencies: string[]
}

export interface PaymentResult {
    success: boolean
    transactionId?: string
    error?: string
    code?: string
}

// Search types
export interface SearchFilters {
    fromWilayaId?: number
    toWilayaId?: number
    date?: string
    seats?: number
    minPrice?: number
    maxPrice?: number
    vehicleType?: string
    instantBooking?: boolean
    luggageAllowed?: boolean
    petsAllowed?: boolean
}

// Chat types
export interface ChatMessage {
    id: string
    chatId: string
    senderId: string
    content: string
    type: 'text' | 'image' | 'location'
    isRead: boolean
    createdAt: string
    sender?: User
}

export interface Chat {
    id: string
    bookingId?: string
    tripId?: string
    participantIds: string[]
    lastMessage?: ChatMessage
    unreadCount: number
    createdAt: string
    participants?: User[]
}

// Notification types
export interface Notification {
    id: string
    userId: string
    type: 'booking' | 'trip' | 'payment' | 'review' | 'message' | 'system'
    title: string
    message: string
    data?: Record<string, any>
    isRead: boolean
    createdAt: string
}

// API Response types
export interface ApiResponse<T> {
    success: boolean
    message: string
    data: T
    timestamp: string
}

export interface PaginatedResponse<T> {
    data: T[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
        hasNext: boolean
        hasPrev: boolean
    }
}

// Form types
export interface LoginFormData {
    email: string
    password: string
}

export interface RegisterFormData {
    firstName: string
    lastName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
    role: 'passenger' | 'driver'
}

export interface TripPublishFormData {
    fromWilayaId: number
    fromCity: string
    fromAddress?: string
    toWilayaId: number
    toCity: string
    toAddress?: string
    departureDate: string
    departureTime: string
    availableSeats: number
    pricePerSeat: number
    vehicleId: string
    luggageAllowed: boolean
    smokingAllowed: boolean
    petsAllowed: boolean
    instantBooking: boolean
    description?: string
}

export interface BookingFormData {
    seats: number
    pickupLocation: string
    dropoffLocation: string
    luggageCount: number
    specialRequests?: string
    paymentMethod: string
}
