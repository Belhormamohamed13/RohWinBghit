/**
 * RohWinBghit Backend Server
 * Main entry point for the Express API
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const knex = require('knex');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import configuration
const dbConfig = require('./config/database');

// Import utilities
const ResponseUtil = require('./utils/response.util');
const JWTUtil = require('./utils/jwt.util');

// Import models
const UserModel = require('./models/User.model');
const TripModel = require('./models/Trip.model');
const BookingModel = require('./models/Booking.model');
const ReviewModel = require('./models/Review.model');
const VehicleModel = require('./models/Vehicle.model');
const WilayaModel = require('./models/Wilaya.model');
const RouteModel = require('./models/Route.model');
const ChatModel = require('./models/Chat.model');

// ============================================
// App Setup
// ============================================
const app = express();
const httpServer = createServer(app);

// Database connection
const db = knex(dbConfig);

// Initialize models
const userModel = new UserModel(db);
const tripModel = new TripModel(db);
const bookingModel = new BookingModel(db);
const reviewModel = new ReviewModel(db);
const vehicleModel = new VehicleModel(db);
const wilayaModel = new WilayaModel(db);
const routeModel = new RouteModel(db);
const chatModel = new ChatModel(db);

// ============================================
// Middleware
// ============================================

// Security headers
app.use(helmet());

// CORS - Production-safe configuration
const corsOptions = {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Configure origin based on environment
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
    // In production, only allow explicitly configured origins
    if (allowedOrigins.length === 0) {
        console.warn('WARNING: Running in production without CORS_ORIGIN set - requests will be blocked');
    }
    corsOptions.origin = allowedOrigins.length > 0 ? allowedOrigins : false;
} else {
    // In development, allow localhost origins
    corsOptions.origin = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:19006'];
}

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: { success: false, message: 'Too many requests, please try again later.' },
    skip: (req) => {
        // Skip rate limiting for chat polling and booking updates
        return req.originalUrl.includes('/api/chats') || req.originalUrl.includes('/api/bookings');
    }
});
app.use('/api/', limiter);

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dir = 'uploads/general/';
        if (file.fieldname.includes('vehicle')) dir = 'uploads/vehicles/';
        if (file.fieldname.includes('identity') || file.fieldname.includes('license')) dir = 'uploads/verifications/';

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only images are allowed!"));
    }
});

// ============================================
// Auth Middleware
// ============================================
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return ResponseUtil.unauthorized(res, 'Access token required');
        }

        const token = authHeader.split(' ')[1];

        // Check if token is blacklisted
        if (JWTUtil.isBlacklisted(token)) {
            return ResponseUtil.unauthorized(res, 'Token has been revoked');
        }

        const decoded = JWTUtil.verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return ResponseUtil.unauthorized(res, 'Invalid or expired token');
    }
};

const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];

            // Check if token is blacklisted
            if (!JWTUtil.isBlacklisted(token)) {
                req.user = JWTUtil.verifyAccessToken(token);
            }
        }
    } catch (error) {
        // Token invalid, continue without auth
    }
    next();
};

// ============================================
// API Routes
// ============================================
const apiPrefix = process.env.API_PREFIX || '/api';

// Health check
app.get('/', (req, res) => {
    ResponseUtil.success(res, {
        name: 'RohWinBghit API',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString()
    }, 'API is running');
});

app.get(`${apiPrefix}/health`, (req, res) => {
    ResponseUtil.success(res, { status: 'healthy' }, 'Server is healthy');
});

// ============================================
// AUTH ROUTES
// ============================================
const authRouter = express.Router();

// POST /api/auth/register
authRouter.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, phone, password, role } = req.body;

        if (!email || !password || !firstName || !lastName) {
            return ResponseUtil.badRequest(res, 'Missing required fields: firstName, lastName, email, password');
        }

        // Check if user already exists
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            return ResponseUtil.conflict(res, 'User with this email already exists');
        }

        const user = await userModel.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role: role || 'passenger'
        });

        const tokens = JWTUtil.generateTokenPair(user);

        ResponseUtil.created(res, { user, ...tokens }, 'Registration successful');
    } catch (error) {
        console.error('Registration error:', error);
        ResponseUtil.error(res, 'Registration failed: ' + error.message);
    }
});

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return ResponseUtil.badRequest(res, 'Email and password are required');
        }

        const user = await userModel.findByEmail(email);
        if (!user) {
            return ResponseUtil.unauthorized(res, 'Invalid email or password');
        }

        const isPasswordValid = await userModel.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return ResponseUtil.unauthorized(res, 'Invalid email or password');
        }

        await userModel.updateLastLogin(user.id);

        const sanitizedUser = userModel.sanitize(user);
        const tokens = JWTUtil.generateTokenPair(sanitizedUser);

        ResponseUtil.success(res, { user: sanitizedUser, ...tokens }, 'Login successful');
    } catch (error) {
        console.error('Login error:', error);
        ResponseUtil.error(res, 'Login failed: ' + error.message);
    }
});

// POST /api/auth/refresh
authRouter.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return ResponseUtil.badRequest(res, 'Refresh token is required');
        }

        const decoded = JWTUtil.verifyRefreshToken(refreshToken);
        const user = await userModel.findById(decoded.userId);

        if (!user) {
            return ResponseUtil.unauthorized(res, 'User not found');
        }

        const tokens = JWTUtil.generateTokenPair(user);
        ResponseUtil.success(res, tokens, 'Token refreshed successfully');
    } catch (error) {
        console.error('Token refresh error:', error);
        ResponseUtil.unauthorized(res, 'Invalid refresh token');
    }
});

// GET /api/auth/me
authRouter.get('/me', authenticate, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);
        if (!user) {
            return ResponseUtil.notFound(res, 'User not found');
        }
        ResponseUtil.success(res, { user }, 'User profile retrieved');
    } catch (error) {
        console.error('Get profile error:', error);
        ResponseUtil.error(res, 'Failed to get profile');
    }
});

// POST /api/auth/forgot-password
authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        // In production, send a reset email
        ResponseUtil.success(res, null, 'If the email exists, a password reset link has been sent');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to process forgot password request');
    }
});

// POST /api/auth/reset-password
authRouter.post('/reset-password', async (req, res) => {
    try {
        const { token, password } = req.body;
        // In production, verify token and update password
        ResponseUtil.success(res, null, 'Password reset successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to reset password');
    }
});

// POST /api/auth/logout
authRouter.post('/logout', authenticate, (req, res) => {
    try {
        // Get the token from authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            // Blacklist the token
            JWTUtil.blacklist(token);
        }
        ResponseUtil.success(res, null, 'Logged out successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Logout failed');
    }
});

app.use(`${apiPrefix}/auth`, authRouter);

// ============================================
// TRIPS ROUTES
// ============================================
const tripsRouter = express.Router();

// GET /api/trips/search
tripsRouter.get('/search', optionalAuth, async (req, res) => {
    try {
        const { fromWilayaId, toWilayaId, date, seats, page = 1, limit = 20 } = req.query;

        // Base query with official "Engineer Level" visibility rules
        let query = db('trips')
            .join('users', 'trips.driver_id', 'users.id')
            .select(
                'trips.*',
                db.raw("users.first_name || ' ' || users.last_name as driver_name"),
                'users.avatar_url',
                'users.is_verified as driver_verified',
                'users.status as driver_status'
            )
            .where({
                'trips.status': 'active', // Only show active trips
                'users.is_active': true,   // Driver must be active
            })
            .whereIn('users.status', ['active', 'verified']) // Driver must not be suspended
            .where('trips.departure_time', '>', new Date()); // Not yet departed (Rule 9)

        if (fromWilayaId) query = query.where('trips.from_wilaya_id', fromWilayaId);
        if (toWilayaId) query = query.where('trips.to_wilaya_id', toWilayaId);
        if (date) query = query.whereRaw('DATE(trips.departure_time) = ?', [date]);

        // We REMOVE the available_seats check here to allow "FULL" trips to be visible (Mode Complet mais visible)
        // We will mark them as full in the logic or frontend.

        // Create a count query by cloning the base query and clearing conflicting selects
        const totalResult = await query.clone()
            .clearSelect() // Critical for Postgres count
            .clearOrder()
            .count('* as count')
            .first();

        const trips = await query
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit))
            .orderBy('trips.departure_time', 'asc');

        // Add display flags for the frontend (Rule 6)
        const enrichedTrips = trips.map(trip => ({
            ...trip,
            displayStatus: trip.available_seats > 0 ? 'VISIBLE & BOOKABLE' : 'VISIBLE BUT FULL'
        }));

        ResponseUtil.paginated(res, enrichedTrips, {
            page: parseInt(page),
            limit: parseInt(limit),
            total: parseInt(totalResult?.count || 0)
        });
    } catch (error) {
        console.error('Trip search error:', error);
        ResponseUtil.error(res, 'Failed to search trips: ' + error.message);
    }
});

// GET /api/trips/my-trips
tripsRouter.get('/my-trips', authenticate, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        let query = db('trips').where('driver_id', req.user.userId);
        if (status) query = query.where({ status });

        const trips = await query
            .limit(parseInt(limit))
            .offset((parseInt(page) - 1) * parseInt(limit))
            .orderBy('created_at', 'desc');

        ResponseUtil.success(res, trips, 'My trips retrieved');
    } catch (error) {
        console.error('Get my trips error:', error);
        ResponseUtil.error(res, 'Failed to get trips');
    }
});

// GET /api/trips/:id
tripsRouter.get('/:id', optionalAuth, async (req, res) => {
    try {
        const trip = await db('trips')
            .select('trips.*', db.raw("users.first_name || ' ' || users.last_name as driver_name"), 'users.avatar_url', 'users.phone as driver_phone', 'users.is_verified as driver_verified')
            .join('users', 'trips.driver_id', 'users.id')
            .where({ 'trips.id': req.params.id })
            .first();

        if (!trip) {
            return ResponseUtil.notFound(res, 'Trip not found');
        }
        ResponseUtil.success(res, trip, 'Trip retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get trip');
    }
});

// POST /api/trips
tripsRouter.post('/', authenticate, async (req, res) => {
    try {
        const tripData = {
            ...req.body,
            driverId: req.user.userId,
        };

        const trip = await tripModel.create(tripData);
        ResponseUtil.created(res, trip, 'Trip created successfully');
    } catch (error) {
        console.error('Create trip error:', error);
        ResponseUtil.error(res, 'Failed to create trip: ' + error.message);
    }
});

// PUT /api/trips/:id
tripsRouter.put('/:id', authenticate, async (req, res) => {
    try {
        const [trip] = await db('trips')
            .where({ id: req.params.id, driver_id: req.user.userId })
            .update({ ...req.body, updated_at: new Date() })
            .returning('*');

        if (!trip) {
            return ResponseUtil.notFound(res, 'Trip not found or unauthorized');
        }
        ResponseUtil.success(res, trip, 'Trip updated successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to update trip');
    }
});

// DELETE /api/trips/:id
tripsRouter.delete('/:id', authenticate, async (req, res) => {
    try {
        const deleted = await db('trips')
            .where({ id: req.params.id, driver_id: req.user.userId })
            .del();

        if (!deleted) {
            return ResponseUtil.notFound(res, 'Trip not found or unauthorized');
        }
        ResponseUtil.success(res, null, 'Trip deleted successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to delete trip');
    }
});

// POST /api/trips/:id/cancel
tripsRouter.post('/:id/cancel', authenticate, async (req, res) => {
    try {
        const [trip] = await db('trips')
            .where({ id: req.params.id, driver_id: req.user.userId })
            .update({ status: 'cancelled', cancel_reason: req.body.reason, updated_at: new Date() })
            .returning('*');

        if (!trip) {
            return ResponseUtil.notFound(res, 'Trip not found or unauthorized');
        }
        ResponseUtil.success(res, trip, 'Trip cancelled successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to cancel trip');
    }
});

app.use(`${apiPrefix}/trips`, tripsRouter);

// ============================================
// BOOKINGS ROUTES
// ============================================
const bookingsRouter = express.Router();

// POST /api/bookings
bookingsRouter.post('/', authenticate, async (req, res) => {
    try {
        const { trip_id, num_seats = 1 } = req.body;

        // 1. Check if trip exists and has enough seats
        const trip = await db('trips').where({ id: trip_id }).first();
        if (!trip) {
            return ResponseUtil.notFound(res, 'Trip not found');
        }

        // We check against available_seats. Even for pending bookings, 
        // it's good to know if there's any chance.
        if (trip.available_seats < num_seats) {
            return ResponseUtil.badRequest(res, 'Not enough seats available on this trip');
        }

        const bookingData = {
            ...req.body,
            passenger_id: req.user.userId,
            num_seats: num_seats,
            status: 'pending',
            created_at: new Date(),
            updated_at: new Date()
        };

        const [booking] = await db('bookings').insert(bookingData).returning('*');
        ResponseUtil.created(res, booking, 'Booking created successfully');
    } catch (error) {
        console.error('Create booking error:', error);
        ResponseUtil.error(res, 'Failed to create booking: ' + error.message);
    }
});

// GET /api/bookings/my-bookings
bookingsRouter.get('/my-bookings', authenticate, async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const bookings = await bookingModel.findByPassengerIdWithDetails(req.user.userId, {
            status,
            page: parseInt(page),
            limit: parseInt(limit)
        });

        ResponseUtil.success(res, bookings, 'My bookings retrieved');
    } catch (error) {
        console.error('Get my-bookings error:', error);
        ResponseUtil.error(res, 'Failed to get bookings');
    }
});

// GET /api/bookings/trip/:tripId
bookingsRouter.get('/trip/:tripId', authenticate, async (req, res) => {
    try {
        const trip = await db('trips').where({ id: req.params.tripId }).first();
        if (!trip) {
            return ResponseUtil.notFound(res, 'Trip not found');
        }

        // Ensure the requester is the driver or an admin
        if (trip.driver_id !== req.user.userId && req.user.role !== 'admin') {
            return ResponseUtil.unauthorized(res, 'Only the driver can see bookings for this trip');
        }

        const bookings = await bookingModel.findByTripId(req.params.tripId);
        ResponseUtil.success(res, bookings, 'Trip bookings retrieved');
    } catch (error) {
        console.error('Get trip bookings error:', error);
        ResponseUtil.error(res, 'Failed to get trip bookings');
    }
});

// GET /api/bookings/:id
bookingsRouter.get('/:id', authenticate, async (req, res) => {
    try {
        const booking = await db('bookings').where({ id: req.params.id }).first();
        if (!booking) {
            return ResponseUtil.notFound(res, 'Booking not found');
        }
        ResponseUtil.success(res, booking, 'Booking retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get booking');
    }
});

// POST /api/bookings/:id/cancel
bookingsRouter.post('/:id/cancel', authenticate, async (req, res) => {
    try {
        const [booking] = await db('bookings')
            .where({ id: req.params.id, passenger_id: req.user.userId })
            .update({ status: 'cancelled', cancel_reason: req.body.reason, updated_at: new Date() })
            .returning('*');

        if (!booking) {
            return ResponseUtil.notFound(res, 'Booking not found or unauthorized');
        }
        ResponseUtil.success(res, booking, 'Booking cancelled successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to cancel booking');
    }
});

// POST /api/bookings/:id/confirm-payment
bookingsRouter.post('/:id/confirm-payment', authenticate, async (req, res) => {
    try {
        const [booking] = await db('bookings')
            .where({ id: req.params.id, passenger_id: req.user.userId })
            .update({ status: 'confirmed', payment_status: 'paid', updated_at: new Date() })
            .returning('*');

        if (!booking) {
            return ResponseUtil.notFound(res, 'Booking not found or unauthorized');
        }
        ResponseUtil.success(res, booking, 'Payment confirmed');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to confirm payment');
    }
});


// PATCH /api/bookings/:id/status
bookingsRouter.patch('/:id/status', authenticate, async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;
        const validStatuses = ['confirmed', 'rejected', 'cancelled', 'completed'];

        if (!validStatuses.includes(status)) {
            return ResponseUtil.badRequest(res, 'Invalid status');
        }

        // Use a transaction to ensure seat counts and statuses are perfectly synced
        const result = await db.transaction(async (trx) => {
            // Get booking with trip details (locked for update in some DBs, but simple select here)
            const booking = await trx('bookings')
                .join('trips', 'bookings.trip_id', 'trips.id')
                .where('bookings.id', bookingId)
                .select(
                    'bookings.*',
                    'trips.driver_id',
                    'trips.available_seats',
                    'trips.total_seats'
                )
                .first();

            if (!booking) {
                throw new Error('BOOKING_NOT_FOUND');
            }

            if (booking.driver_id !== req.user.userId) {
                throw new Error('UNAUTHORIZED');
            }

            const currentStatus = booking.status;

            // If status is the same, do nothing
            if (currentStatus === status) {
                return booking;
            }

            // SEAT MANAGEMENT LOGIC
            // ---------------------

            // 1. Moving TO 'confirmed' from something else: Decrement seats
            if (status === 'confirmed' && currentStatus !== 'confirmed') {
                if (booking.available_seats < booking.num_seats) {
                    throw new Error('OVERBOOKING');
                }
                await trx('trips')
                    .where({ id: booking.trip_id })
                    .decrement('available_seats', booking.num_seats);
            }

            // 2. Moving AWAY from 'confirmed' (to rejected or cancelled): Increment seats back
            if (currentStatus === 'confirmed' && (status === 'rejected' || status === 'cancelled')) {
                // Ensure we don't exceed total_seats (safety check)
                const newAvailable = Math.min(booking.available_seats + booking.num_seats, booking.total_seats);
                await trx('trips')
                    .where({ id: booking.trip_id })
                    .update({ available_seats: newAvailable });
            }

            // Update the booking status
            const [updated] = await trx('bookings')
                .where({ id: bookingId })
                .update({
                    status: status,
                    updated_at: new Date()
                })
                .returning('*');

            return updated;
        });

        ResponseUtil.success(res, result, `Réservation ${status} avec succès`);
    } catch (error) {
        console.error('Update booking status error:', error);

        if (error.message === 'BOOKING_NOT_FOUND') return ResponseUtil.notFound(res, 'Réservation non trouvée');
        if (error.message === 'UNAUTHORIZED') return ResponseUtil.unauthorized(res, 'Seul le conducteur peut modifier ce statut');
        if (error.message === 'OVERBOOKING') return ResponseUtil.badRequest(res, 'Plus assez de places disponibles pour ce trajet');

        ResponseUtil.error(res, 'Échec de la mise à jour : ' + error.message);
    }
});

app.use(`${apiPrefix}/bookings`, bookingsRouter);


// ============================================
// WILAYAS ROUTES
// ============================================
const wilayasRouter = express.Router();

// GET /api/wilayas
wilayasRouter.get('/', async (req, res) => {
    try {
        const wilayas = await db('wilayas').orderBy('code', 'asc');
        ResponseUtil.success(res, wilayas, 'Wilayas retrieved');
    } catch (error) {
        console.error('Get wilayas error:', error);
        ResponseUtil.error(res, 'Failed to get wilayas: ' + error.message);
    }
});

// GET /api/wilayas/search
wilayasRouter.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        // Validate and sanitize input
        if (!q || typeof q !== 'string' || q.length > 100) {
            return ResponseUtil.badRequest(res, 'Invalid search query');
        }

        // Use parameterized query to prevent SQL injection
        const searchTerm = `%${q}%`;
        const wilayas = await db('wilayas')
            .where('name_fr', 'ilike', searchTerm)
            .orWhere('name_ar', 'ilike', searchTerm)
            .orderBy('code', 'asc');

        ResponseUtil.success(res, wilayas, 'Wilayas search results');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to search wilayas');
    }
});

// GET /api/wilayas/popular
wilayasRouter.get('/popular', async (req, res) => {
    try {
        const wilayas = await db('wilayas')
            .orderBy('code', 'asc')
            .limit(10);

        ResponseUtil.success(res, wilayas, 'Popular wilayas');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get popular wilayas');
    }
});

// GET /api/wilayas/:code
wilayasRouter.get('/:code', async (req, res) => {
    try {
        const wilaya = await db('wilayas').where({ code: req.params.code }).first();
        if (!wilaya) {
            return ResponseUtil.notFound(res, 'Wilaya not found');
        }
        ResponseUtil.success(res, wilaya, 'Wilaya retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get wilaya');
    }
});

app.use(`${apiPrefix}/wilayas`, wilayasRouter);

// ============================================
// VEHICLES ROUTES
// ============================================
const vehiclesRouter = express.Router();

// GET /api/vehicles/my-vehicles
vehiclesRouter.get('/my-vehicles', authenticate, async (req, res) => {
    try {
        const vehicles = await db('vehicles').where({ owner_id: req.user.userId });
        ResponseUtil.success(res, vehicles, 'Vehicles retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get vehicles');
    }
});

// POST /api/vehicles
vehiclesRouter.post('/', authenticate, async (req, res) => {
    try {
        const vehicleData = {
            ...req.body,
            owner_id: req.user.userId,
            created_at: new Date(),
            updated_at: new Date()
        };

        const [vehicle] = await db('vehicles').insert(vehicleData).returning('*');
        ResponseUtil.created(res, vehicle, 'Vehicle added successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to add vehicle: ' + error.message);
    }
});

// PUT /api/vehicles/:id
vehiclesRouter.put('/:id', authenticate, async (req, res) => {
    try {
        const [vehicle] = await db('vehicles')
            .where({ id: req.params.id, owner_id: req.user.userId })
            .update({ ...req.body, updated_at: new Date() })
            .returning('*');

        if (!vehicle) {
            return ResponseUtil.notFound(res, 'Vehicle not found or unauthorized');
        }
        ResponseUtil.success(res, vehicle, 'Vehicle updated successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to update vehicle');
    }
});

// DELETE /api/vehicles/:id
vehiclesRouter.delete('/:id', authenticate, async (req, res) => {
    try {
        const deleted = await db('vehicles')
            .where({ id: req.params.id, owner_id: req.user.userId })
            .del();

        if (!deleted) {
            return ResponseUtil.notFound(res, 'Vehicle not found or unauthorized');
        }
        ResponseUtil.success(res, null, 'Vehicle deleted successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to delete vehicle');
    }
});

// POST /api/vehicles/upload-image
vehiclesRouter.post('/upload-image', authenticate, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return ResponseUtil.badRequest(res, 'No image file uploaded');
        }
        const imageUrl = `/uploads/vehicles/${req.file.filename}`;
        ResponseUtil.success(res, { imageUrl }, 'Image uploaded successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to upload image: ' + error.message);
    }
});

app.use(`${apiPrefix}/vehicles`, vehiclesRouter);

// ============================================
// PAYMENTS ROUTES
// ============================================
const paymentsRouter = express.Router();

// GET /api/payments/methods
paymentsRouter.get('/methods', authenticate, (req, res) => {
    ResponseUtil.success(res, [
        { id: 'cib', name: 'CIB', type: 'card', available: true },
        { id: 'edahabia', name: 'Edahabia', type: 'card', available: true },
        { id: 'cash', name: 'Cash', type: 'cash', available: true },
        { id: 'stripe', name: 'Stripe', type: 'card', available: true },
        { id: 'paypal', name: 'PayPal', type: 'wallet', available: true }
    ], 'Payment methods retrieved');
});

// POST /api/payments/process
paymentsRouter.post('/process', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, { transactionId: require('uuid').v4(), status: 'processed' }, 'Payment processed');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to process payment');
    }
});

// POST /api/payments/intent
paymentsRouter.post('/intent', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, { clientSecret: 'stub_intent', intentId: require('uuid').v4() }, 'Payment intent created');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to create payment intent');
    }
});

// POST /api/payments/refund/:bookingId
paymentsRouter.post('/refund/:bookingId', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, { refundId: require('uuid').v4(), status: 'refunded' }, 'Refund processed');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to process refund');
    }
});

app.use(`${apiPrefix}/payments`, paymentsRouter);

// ============================================
// REVIEWS ROUTES
// ============================================
const reviewsRouter = express.Router();

// POST /api/reviews
reviewsRouter.post('/', authenticate, async (req, res) => {
    try {
        const reviewData = {
            ...req.body,
            reviewer_id: req.user.userId,
            created_at: new Date(),
            updated_at: new Date()
        };

        const [review] = await db('reviews').insert(reviewData).returning('*');
        ResponseUtil.created(res, review, 'Review created successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to create review: ' + error.message);
    }
});

// GET /api/reviews/user/:userId
reviewsRouter.get('/user/:userId', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const reviews = await reviewModel.findByRevieweeId(req.params.userId, {
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        ResponseUtil.success(res, reviews, 'Reviews retrieved');
    } catch (error) {
        console.error('Get reviews error:', error);
        ResponseUtil.error(res, 'Failed to get reviews');
    }
});

// GET /api/reviews/can-review/:bookingId
reviewsRouter.get('/can-review/:bookingId', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, { canReview: true }, 'Review eligibility checked');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to check review eligibility');
    }
});

app.use(`${apiPrefix}/reviews`, reviewsRouter);

// ============================================
// CHATS ROUTES
// ============================================
const chatsRouter = express.Router();

// GET /api/chats
chatsRouter.get('/', authenticate, async (req, res) => {
    try {
        const chats = await chatModel.getUserChats(req.user.userId);
        ResponseUtil.success(res, chats, 'Chats retrieved');
    } catch (error) {
        console.error('Get chats error:', error);
        ResponseUtil.error(res, 'Failed to get chats');
    }
});

// POST /api/chats/initiate
chatsRouter.post('/initiate', authenticate, async (req, res) => {
    try {
        const { targetUserId } = req.body;
        if (!targetUserId) {
            return ResponseUtil.badRequest(res, 'Target user ID required');
        }

        if (targetUserId === req.user.userId) {
            return ResponseUtil.badRequest(res, 'Cannot chat with yourself');
        }

        const chat = await chatModel.findOrCreate(req.user.userId, targetUserId);
        ResponseUtil.success(res, chat, 'Chat initiated');
    } catch (error) {
        console.error('Initiate chat error:', error);
        ResponseUtil.error(res, error.message || 'Failed to initiate chat');
    }
});

// GET /api/chats/:chatId/messages
chatsRouter.get('/:chatId/messages', authenticate, async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;
        // Verify user is participant
        const chat = await db('chats').where({ id: req.params.chatId }).first();
        if (!chat || (chat.user1_id !== req.user.userId && chat.user2_id !== req.user.userId)) {
            return ResponseUtil.notFound(res, 'Chat not found');
        }

        const messages = await chatModel.getMessages(req.params.chatId, {
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });

        ResponseUtil.success(res, messages, 'Messages retrieved');
    } catch (error) {
        console.error('Get messages error:', error);
        ResponseUtil.error(res, 'Failed to get messages');
    }
});

// POST /api/chats/:chatId/messages
chatsRouter.post('/:chatId/messages', authenticate, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return ResponseUtil.badRequest(res, 'Message content required');
        }

        const message = await chatModel.sendMessage(req.params.chatId, req.user.userId, content);
        ResponseUtil.created(res, message, 'Message sent');
    } catch (error) {
        console.error('Send message error:', error);
        ResponseUtil.error(res, 'Failed to send message');
    }
});

// POST /api/chats/:chatId/read
chatsRouter.post('/:chatId/read', authenticate, async (req, res) => {
    try {
        await chatModel.markAsRead(req.params.chatId, req.user.userId);
        ResponseUtil.success(res, null, 'Messages marked as read');
    } catch (error) {
        console.error('Mark read error:', error);
        ResponseUtil.error(res, 'Failed to mark messages as read');
    }
});

app.use(`${apiPrefix}/chats`, chatsRouter);

// ============================================
// USERS ROUTES
// ============================================
const usersRouter = express.Router();

// PUT /api/users/profile
usersRouter.put('/profile', authenticate, async (req, res) => {
    try {
        const user = await userModel.update(req.user.userId, req.body);
        ResponseUtil.success(res, { user }, 'Profile updated successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to update profile: ' + error.message);
    }
});

// POST /api/users/avatar
usersRouter.post('/avatar', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, { avatarUrl: '/uploads/default-avatar.png' }, 'Avatar uploaded');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to upload avatar');
    }
});

// PUT /api/users/password
usersRouter.put('/password', authenticate, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await userModel.findById(req.user.userId);

        // Find raw user with password
        const rawUser = await db('users').where({ id: req.user.userId }).first();
        const isValid = await userModel.comparePassword(currentPassword, rawUser.password);

        if (!isValid) {
            return ResponseUtil.badRequest(res, 'Current password is incorrect');
        }

        await userModel.update(req.user.userId, { password: newPassword });
        ResponseUtil.success(res, null, 'Password changed successfully');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to change password: ' + error.message);
    }
});

// GET /api/users/notifications
usersRouter.get('/notifications', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, [], 'Notifications retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get notifications');
    }
});

// POST /api/users/notifications/:id/read
usersRouter.post('/notifications/:id/read', authenticate, async (req, res) => {
    try {
        ResponseUtil.success(res, null, 'Notification marked as read');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to mark notification as read');
    }
});

// POST /api/users/verification/submit
usersRouter.post('/verification/submit', authenticate, async (req, res) => {
    try {
        const { identityCardFrontUrl, identityCardBackUrl, licenseFrontUrl, licenseBackUrl } = req.body;

        const user = await userModel.update(req.user.userId, {
            identity_card_front_url: identityCardFrontUrl,
            identity_card_back_url: identityCardBackUrl,
            license_front_url: licenseFrontUrl,
            license_back_url: licenseBackUrl,
            verification_status: 'pending',
            updated_at: new Date()
        });

        ResponseUtil.success(res, { user }, 'Verification documents submitted successfully');
    } catch (error) {
        console.error('Submit verification error:', error);
        ResponseUtil.error(res, 'Failed to submit verification: ' + error.message);
    }
});

// POST /api/users/upload-docs
usersRouter.post('/upload-docs', authenticate, upload.fields([
    { name: 'identity_front', maxCount: 1 },
    { name: 'identity_back', maxCount: 1 },
    { name: 'license_front', maxCount: 1 },
    { name: 'license_back', maxCount: 1 }
]), async (req, res) => {
    try {
        const urls = {};
        if (req.files['identity_front']) urls.identityCardFrontUrl = `/uploads/verifications/${req.files['identity_front'][0].filename}`;
        if (req.files['identity_back']) urls.identityCardBackUrl = `/uploads/verifications/${req.files['identity_back'][0].filename}`;
        if (req.files['license_front']) urls.licenseFrontUrl = `/uploads/verifications/${req.files['license_front'][0].filename}`;
        if (req.files['license_back']) urls.licenseBackUrl = `/uploads/verifications/${req.files['license_back'][0].filename}`;

        ResponseUtil.success(res, urls, 'Documents uploaded successfully');
    } catch (error) {
        console.error('Upload docs error:', error);
        ResponseUtil.error(res, 'Failed to upload documents: ' + error.message);
    }
});

app.use(`${apiPrefix}/users`, usersRouter);

// ============================================
// DRIVER ROUTES
// ============================================
const driverRouter = express.Router();

// GET /api/driver/stats
driverRouter.get('/stats', authenticate, async (req, res) => {
    try {
        const driverId = req.user.userId;

        // 1. Total Revenue (from confirmed bookings)
        const revenueResult = await db('bookings')
            .join('trips', 'bookings.trip_id', 'trips.id')
            .where('trips.driver_id', driverId)
            .where('bookings.status', 'confirmed')
            .select(db.raw('SUM(bookings.total_price) as total_revenue'))
            .first();

        // 2. Trip Count
        const tripsCountResult = await db('trips')
            .where('driver_id', driverId)
            .count('* as total_trips')
            .first();

        const completedTripsResult = await db('trips')
            .where('driver_id', driverId)
            .where('status', 'completed')
            .count('* as completed_trips')
            .first();

        // 3. Average Rating
        const ratingResult = await db('reviews')
            .where('reviewee_id', driverId)
            .avg('rating as avg_rating')
            .first();

        // 4. Upcoming Trips
        const upcomingTrips = await db('trips')
            .where('driver_id', driverId)
            .whereIn('status', ['active', 'scheduled'])
            .orderBy('departure_time', 'asc')
            .limit(5);

        // Enhance trips with booking info
        const enhancedTrips = await Promise.all(upcomingTrips.map(async (trip) => {
            const bookings = await db('bookings')
                .where('trip_id', trip.id)
                .select('status', 'num_seats');

            const pendingCount = bookings.filter(b => b.status === 'pending').length;
            const confirmedSeats = bookings.filter(b => b.status === 'confirmed').reduce((sum, b) => sum + b.num_seats, 0);

            return {
                ...trip,
                passengersCount: confirmedSeats,
                pendingCount: pendingCount
            };
        }));

        const totalGross = parseFloat(revenueResult?.total_revenue || 0);
        const totalNet = totalGross * 0.95;

        ResponseUtil.success(res, {
            totalRevenue: totalGross,
            totalNetRevenue: totalNet,
            totalTrips: parseInt(tripsCountResult?.total_trips || 0),
            completedTrips: parseInt(completedTripsResult?.completed_trips || 0),
            avgRating: parseFloat(ratingResult?.avg_rating || 0).toFixed(1),
            upcomingTrips: enhancedTrips
        }, 'Driver statistics retrieved');

    } catch (error) {
        console.error('Driver stats error:', error);
        ResponseUtil.error(res, 'Failed to get driver statistics: ' + error.message);
    }
});

// GET /api/driver/transactions
driverRouter.get('/transactions', authenticate, async (req, res) => {
    try {
        const driverId = req.user.userId;

        // Fetch earnings from confirmed bookings
        const earnings = await db('bookings')
            .join('trips', 'bookings.trip_id', 'trips.id')
            .where('trips.driver_id', driverId)
            .where('bookings.status', 'confirmed')
            .select(
                'bookings.id',
                'bookings.created_at as date',
                'trips.from_city',
                'trips.to_city',
                'bookings.total_price as amount',
                db.raw("'income' as type"),
                db.raw("'Covoiturage partagé' as category"),
                db.raw("'Complété' as status")
            )
            .orderBy('bookings.created_at', 'desc');

        // Since we don't have a withdrawals table yet, we just return earnings
        // Future: Fetch from a 'payouts' or 'withdrawals' table and merge

        ResponseUtil.success(res, earnings, 'Driver transactions retrieved');
    } catch (error) {
        console.error('Driver transactions error:', error);
        ResponseUtil.error(res, 'Failed to get transactions: ' + error.message);
    }
});

app.use(`${apiPrefix}/driver`, driverRouter);

// ============================================
// ADMIN ROUTES
// ============================================
const adminRouter = express.Router();

// Role check middleware
const checkRole = (roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return ResponseUtil.forbidden(res, 'Access denied: insufficient permissions');
    }
    next();
};

// GET /api/admin/stats
adminRouter.get('/stats', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const userStats = await userModel.getStatistics();
        const tripStats = await tripModel.getStatistics();

        console.log('Admin Stats - User:', userStats);
        console.log('Admin Stats - Trip:', tripStats);

        ResponseUtil.success(res, {
            users: {
                total: parseInt(userStats?.total_users || 0),
                passengers: parseInt(userStats?.passengers || 0),
                drivers: parseInt(userStats?.drivers || 0),
                admins: parseInt(userStats?.admins || 0),
                verified: parseInt(userStats?.verified_users || 0),
                new30d: parseInt(userStats?.new_users_30d || 0)
            },
            trips: {
                total: parseInt(tripStats?.total_trips || 0),
                scheduled: parseInt(tripStats?.scheduled || 0),
                inProgress: parseInt(tripStats?.in_progress || 0),
                completed: parseInt(tripStats?.completed || 0),
                cancelled: parseInt(tripStats?.cancelled || 0),
                today: parseInt(tripStats?.today_trips || 0),
                revenue: parseFloat(tripStats?.total_revenue || 0)
            },
            summary: {
                totalUsers: parseInt(userStats?.total_users || 0),
                totalTrips: parseInt(tripStats?.total_trips || 0),
                activeTrips: parseInt(tripStats?.scheduled || 0) + parseInt(tripStats?.in_progress || 0),
                revenue: parseFloat(tripStats?.total_revenue || 0)
            }
        }, 'Admin statistics retrieved');
    } catch (error) {
        console.error('Stats error:', error);
        ResponseUtil.error(res, 'Failed to get admin statistics: ' + error.message);
    }
});

// GET /api/admin/users
adminRouter.get('/users', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const { query, role, limit = 50, offset = 0 } = req.query;
        let users;

        if (query) {
            users = await userModel.search(query, { limit, offset });
        } else if (role) {
            users = await userModel.findByRole(role, { limit, offset });
        } else {
            users = await db('users')
                .select('id', 'first_name', 'last_name', 'email', 'phone', 'role', 'is_verified', 'is_active', 'created_at')
                .where({ is_active: true })
                .orderBy('created_at', 'desc')
                .limit(limit)
                .offset(offset);

            // Format users
            users = users.map(u => ({
                id: u.id,
                firstName: u.first_name,
                lastName: u.last_name,
                fullName: `${u.first_name} ${u.last_name}`,
                email: u.email,
                phone: u.phone,
                role: u.role,
                isVerified: u.is_verified,
                isActive: u.is_active,
                createdAt: u.created_at
            }));
        }

        ResponseUtil.success(res, users, 'Users retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get users: ' + error.message);
    }
});

// PATCH /api/admin/users/:id/role
adminRouter.patch('/users/:id/role', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const { role } = req.body;
        if (!['passenger', 'driver', 'admin'].includes(role)) {
            return ResponseUtil.badRequest(res, 'Invalid role');
        }

        const [user] = await db('users')
            .where({ id: req.params.id })
            .update({ role, updated_at: new Date() })
            .returning(['id', 'first_name', 'last_name', 'email', 'role']);

        ResponseUtil.success(res, user, 'User role updated');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to update user role');
    }
});

// PATCH /api/admin/users/:id/verify
adminRouter.patch('/users/:id/verify', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const [user] = await db('users')
            .where({ id: req.params.id })
            .update({ is_verified: true, email_verified_at: new Date(), updated_at: new Date() })
            .returning(['id', 'first_name', 'last_name', 'email', 'is_verified']);

        ResponseUtil.success(res, user, 'User verified');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to verify user transition');
    }
});

// GET /api/admin/vehicles
adminRouter.get('/vehicles', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        console.log('Admin Vehicles Get request - query:', req.query);
        const { status } = req.query;
        let query = db('vehicles')
            .join('users', 'vehicles.owner_id', 'users.id')
            .where('vehicles.is_active', true)
            .select(
                'vehicles.*',
                'users.first_name as owner_first_name',
                'users.last_name as owner_last_name'
            );

        if (status === 'pending') {
            query = query.where('vehicles.is_verified', false);
        }

        const vehicles = await query.orderBy('vehicles.created_at', 'desc');
        console.log(`Found ${vehicles.length} vehicles for status ${status}`);

        // Use model format for consistency
        const formatted = vehicles.map(v => {
            const f = vehicleModel.format(v);
            return {
                ...f,
                ownerName: `${v.owner_first_name} ${v.owner_last_name}`
            };
        });

        console.log('Formatted vehicles for admin:', JSON.stringify(formatted, null, 2));
        ResponseUtil.success(res, formatted, 'Vehicles retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get vehicles: ' + error.message);
    }
});

// PATCH /api/admin/vehicles/:id/verify
adminRouter.patch('/vehicles/:id/verify', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const [vehicle] = await db('vehicles')
            .where({ id: req.params.id })
            .update({ is_verified: true, verified_at: new Date(), updated_at: new Date() })
            .returning('*');

        if (!vehicle) {
            return ResponseUtil.notFound(res, 'Vehicle not found');
        }

        ResponseUtil.success(res, vehicleModel.format(vehicle), 'Vehicle verified successfully');
    } catch (error) {
        console.error('Vehicle verify error:', error);
        ResponseUtil.error(res, 'Failed to verify vehicle: ' + error.message);
    }
});

// PATCH /api/admin/vehicles/:id/reject
adminRouter.patch('/vehicles/:id/reject', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const [vehicle] = await db('vehicles')
            .where({ id: req.params.id })
            .update({
                is_verified: false,
                is_active: false, // Deactivate on reject
                updated_at: new Date()
            })
            .returning('*');

        if (!vehicle) {
            return ResponseUtil.notFound(res, 'Vehicle not found');
        }

        ResponseUtil.success(res, vehicleModel.format(vehicle), 'Vehicle rejected and deactivated');
    } catch (error) {
        console.error('Vehicle reject error:', error);
        ResponseUtil.error(res, 'Failed to reject vehicle: ' + error.message);
    }
});

// GET /api/admin/trips
adminRouter.get('/trips', authenticate, checkRole(['admin']), async (req, res) => {
    try {
        const { status } = req.query;
        let query = db('trips')
            .join('users', 'trips.driver_id', 'users.id')
            .select(
                'trips.*',
                'users.first_name as driver_name'
            );

        if (status === 'active') {
            query = query.whereIn('trips.status', ['active', 'scheduled', 'in_progress']);
        }

        const trips = await query.orderBy('trips.departure_time', 'asc');
        ResponseUtil.success(res, trips, 'Trips retrieved');
    } catch (error) {
        ResponseUtil.error(res, 'Failed to get trips: ' + error.message);
    }
});

app.use(`${apiPrefix}/admin`, adminRouter);

// ============================================
// Error Handling
// ============================================

// 404 handler
app.use((req, res) => {
    ResponseUtil.notFound(res, `Route ${req.method} ${req.url} not found`);
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    ResponseUtil.error(res,
        process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
        500
    );
});

// ============================================
// Trip Status Scheduler (Rule 5)
// ============================================
const startTripStatusScheduler = () => {
    console.log('--- ⏱️ SCHEDULER: Advanced Trip Lifecycle Active ---');

    // Check every 2 minutes
    setInterval(async () => {
        try {
            const now = new Date();

            // 🔹 Rule 5: Pass to IN_PROGRESS when departure time arrives
            const started = await db('trips')
                .where('status', 'active')
                .where('departure_time', '<=', now)
                .update({ status: 'in_progress', updated_at: now });

            if (started > 0) console.log(`[SCHEDULER] ${started} trips -> IN_PROGRESS`);

            // 🔹 Rule 10: Pass to FINISHED after a reasonable duration (e.g., 6 hours after departure)
            const finished = await db('trips')
                .whereIn('status', ['active', 'in_progress'])
                .whereRaw("departure_time + interval '6 hours' <= ?", [now])
                .update({ status: 'completed', updated_at: now });

            if (finished > 0) console.log(`[SCHEDULER] ${finished} trips -> FINISHED`);

        } catch (error) {
            console.error('[SCHEDULER] Error updating trip statuses:', error);
        }
    }, 2 * 60 * 1000);
};

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    startTripStatusScheduler(); // Start the background logic
    console.log(`
╔══════════════════════════════════════════════╗
║     🚗 RohWinBghit Backend Server 🚗        ║
║                                              ║
║  🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(25)}║
║  🔗 Port:        ${String(PORT).padEnd(25)}║
║  📡 API:         http://localhost:${PORT}/api${' '.repeat(6)}║
║                                              ║
║  روح وين بغيت - Go Where You Want           ║
╚══════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await db.destroy();
    httpServer.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT received. Shutting down...');
    await db.destroy();
    httpServer.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

module.exports = app;
