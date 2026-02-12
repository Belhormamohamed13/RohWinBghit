# RohWinBghit - Multi-Platform Ecosystem

![RohWinBghit Logo](https://via.placeholder.com/150x150/10b981/ffffff?text=RWB)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue)](https://reactnative.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

**RohWinBghit** (روح وين بغيت - "Go Where You Want" in Algerian dialect) is the first comprehensive carpooling and transportation platform built specifically for the Algerian market.

## 🚀 Features

### Core Functionality
- 🚗 **Multi-Modal Booking**: Covoiturage (carpooling), Bus, and Train reservations
- 🔐 **Biometric Security**: Face ID verification for drivers
- 💰 **Dynamic Pricing**: AI-powered surge pricing based on demand/supply
- 💳 **Multiple Payment Methods**: CIB, Edahabia, Cash, Stripe, PayPal
- 💬 **Real-time Chat**: WebSocket-based messaging between passengers and drivers
- 📍 **Live Tracking**: GPS tracking for trips
- 🎫 **QR Code Tickets**: Digital tickets with QR verification

### Security & Compliance
- AES-256-GCM encryption for sensitive data
- JWT authentication with refresh tokens
- GDPR-compliant data handling
- PCI-DSS ready payment processing

## 📁 Project Structure

```
rohwinbghit/
├── 📂 backend/                    # 🖥️ Backend API (Node.js/Express)
│   ├── src/
│   │   ├── config/               # Database & app configuration
│   │   ├── controllers/          # MVC Controllers
│   │   ├── middleware/           # Auth, validation, error handling
│   │   ├── models/               # Database models
│   │   ├── routes/               # API routes
│   │   ├── services/             # Business logic
│   │   │   └── patterns/         # Design patterns
│   │   │       ├── pricing/      # Pricing strategies
│   │   │       ├── payment/      # Payment strategies
│   │   │       └── notification/ # Notification observers
│   │   ├── utils/                # Utility functions
│   │   └── validators/           # Input validation
│   ├── migrations/               # Database migrations
│   └── tests/                    # Test suites
│
├── 📂 frontend-web/               # 🌐 React Web Application
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── services/             # API services
│   │   ├── store/                # Zustand state management
│   │   └── utils/                # Utilities
│   └── public/                   # Static assets
│
└── 📂 frontend-mobile/            # 📱 React Native Mobile App
    ├── src/
    │   ├── screens/              # Screen components
    │   ├── navigation/           # Navigation configuration
    │   ├── components/           # Reusable components
    │   ├── store/                # State management
    │   └── constants/            # Theme, colors, config
    └── assets/                   # Images, fonts
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Authentication**: JWT + bcrypt
- **Encryption**: AES-256-GCM
- **Real-time**: Socket.io
- **Payment**: Stripe, PayPal SDK
- **Notifications**: Firebase Cloud Messaging, SendGrid, Twilio

### Frontend Web
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Maps**: Leaflet / React-Leaflet
- **Animations**: Framer Motion

### Frontend Mobile
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **Maps**: React Native Maps
- **Storage**: AsyncStorage

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 14+
- Redis (optional, for caching)

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and API keys

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed

# Start development server
npm run dev
```

### Web Frontend Setup

```bash
cd frontend-web

# Install dependencies
npm install

# Start development server
npm run dev
```

### Mobile App Setup

```bash
cd frontend-mobile

# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts (passengers, drivers, admins)
- `vehicles` - Driver vehicles with encrypted license plates
- `trips` - Published trips/rides
- `bookings` - Trip reservations
- `reviews` - User ratings and reviews
- `wilayas` - Algerian provinces with coordinates
- `routes` - Popular routes with distance/duration
- `payments` - Payment transactions
- `chats` - Chat messages

## 🔐 Security Features

### Data Encryption
- License plates encrypted with AES-256-GCM
- Sensitive PII encrypted at rest
- Secure key management with environment variables

### Authentication
- JWT access tokens (15 min expiry)
- Refresh tokens (7 day expiry)
- Password hashing with bcrypt (12 rounds)

### Payment Security
- PCI-DSS compliant payment processing
- 3D Secure for card payments
- Webhook signature verification

## 🎯 Design Patterns Implemented

### Backend Patterns
1. **Repository Pattern** - Data access abstraction
2. **Strategy Pattern** - Pricing and payment strategies
3. **Factory Pattern** - Payment method creation
4. **Observer Pattern** - Notification system
5. **MVC Architecture** - Clean separation of concerns

### Frontend Patterns
1. **Component Composition** - Reusable UI components
2. **Custom Hooks** - Logic reuse
3. **State Management** - Zustand stores
4. **Optimistic UI** - Immediate feedback

## 🌍 Algerian Market Features

### Localized Payment Methods
- **CIB** (Carte Interbancaire) - Algerian bank cards
- **Edahabia** - Algerian postal service cards
- **Cash** - Pay driver directly
- **Stripe/PayPal** - International cards

### Geography
- All 58 Algerian wilayas (provinces)
- Coordinates for distance calculation
- Popular routes database

### Language Support
- French (primary)
- Arabic (secondary)
- English (optional)

## 📱 Mobile App Features

### Native Capabilities
- **Face ID / Touch ID** - Biometric authentication
- **Push Notifications** - Trip updates, messages
- **GPS Tracking** - Real-time location sharing
- **Offline Support** - Cached trip data
- **QR Code Scanning** - Ticket verification

## 🧪 Testing

```bash
# Backend tests
npm test

# Web frontend tests
npm run test

# Mobile tests
npm run test
```

## 📈 Performance Optimization

### Backend
- Database query optimization with indexes
- Redis caching for frequently accessed data
- Rate limiting to prevent abuse
- Compression middleware

### Frontend
- Code splitting and lazy loading
- Image optimization
- Service worker for offline support
- Debounced search inputs

## 🚀 Deployment

### Backend (Production)
```bash
# Build
npm run build

# Start production server
npm start
```

### Web (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy dist/ folder
```

### Mobile (App Stores)
```bash
# Build for production
expo build:android
expo build:ios

# Or use EAS
eas build --platform all
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Algerian tech community for feedback and support
- Open source contributors
- Beta testers across all 58 wilayas

## 📞 Contact

- **Email**: contact@rohwinbghit.com
- **Website**: https://rohwinbghit.com
- **Twitter**: [@RohWinBghit](https://twitter.com/rohwinbghit)
- **Facebook**: [RohWinBghit](https://facebook.com/rohwinbghit)

---

<p align="center">
  <strong>Made with ❤️ in Algeria</strong>
</p>
<p align="center">
  🇩🇿 روح وين بغيت - Go Where You Want 🇩🇿
</p>


```
rohwinbghit
├─ .DS_Store
├─ README.md
├─ backend
│  ├─ .DS_Store
│  ├─ .env
│  ├─ .env.example
│  ├─ backend
│  ├─ checkTrips.js
│  ├─ knexfile.js
│  ├─ migrations
│  │  ├─ 20260211151843_initial_schema.js
│  │  ├─ 20260211155410_add_image_and_condition_to_vehicles.js
│  │  ├─ 20260211165853_update_trips_and_vehicles_schema.js
│  │  ├─ 20260211193200_fix_missing_trip_columns.js
│  │  └─ 20260211235032_add_verification_fields_to_users.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ seeds
│  │  └─ 01_wilayas.js
│  ├─ src
│  │  ├─ .DS_Store
│  │  ├─ config
│  │  │  └─ database.js
│  │  ├─ models
│  │  │  ├─ Booking.model.js
│  │  │  ├─ Review.model.js
│  │  │  ├─ Route.model.js
│  │  │  ├─ Trip.model.js
│  │  │  ├─ User.model.js
│  │  │  ├─ Vehicle.model.js
│  │  │  └─ Wilaya.model.js
│  │  ├─ server.js
│  │  ├─ services
│  │  │  ├─ email.service.js
│  │  │  ├─ encryption.service.js
│  │  │  └─ patterns
│  │  │     ├─ notification
│  │  │     │  ├─ email.observer.js
│  │  │     │  ├─ push.observer.js
│  │  │     │  └─ sms.observer.js
│  │  │     ├─ payment
│  │  │     │  ├─ cash.strategy.js
│  │  │     │  ├─ cib.strategy.js
│  │  │     │  ├─ edahabia.strategy.js
│  │  │     │  ├─ payment.factory.js
│  │  │     │  ├─ paypal.strategy.js
│  │  │     │  └─ stripe.strategy.js
│  │  │     └─ pricing
│  │  │        ├─ dynamic.pricing.js
│  │  │        ├─ index.js
│  │  │        └─ standard.pricing.js
│  │  └─ utils
│  │     ├─ date.util.js
│  │     ├─ jwt.util.js
│  │     └─ response.util.js
│  ├─ update_admin.js
│  └─ uploads
│     └─ vehicles
│        ├─ vehicle-1770826050420-319347981.jpeg
│        └─ vehicle-1770844731441-69507039.jpeg
├─ frontend-mobile
│  ├─ .expo
│  │  ├─ README.md
│  │  └─ devices.json
│  ├─ App.tsx
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ constants
│  │  │  └─ theme.ts
│  │  ├─ navigation
│  │  │  └─ AppNavigator.tsx
│  │  ├─ screens
│  │  │  ├─ OnboardingScreen.tsx
│  │  │  ├─ SplashScreen.tsx
│  │  │  ├─ auth
│  │  │  │  ├─ LoginScreen.tsx
│  │  │  │  └─ RegisterScreen.tsx
│  │  │  ├─ main
│  │  │  │  ├─ HomeScreen.tsx
│  │  │  │  ├─ MessagesScreen.tsx
│  │  │  │  ├─ SearchScreen.tsx
│  │  │  │  └─ TripsScreen.tsx
│  │  │  └─ passenger
│  │  │     └─ TicketScreen.tsx
│  │  └─ store
│  │     └─ authStore.ts
│  └─ tsconfig.json
└─ frontend-web
   ├─ dist
   │  ├─ assets
   │  │  ├─ Checkout-DdfZd-PK.js
   │  │  ├─ Checkout-DdfZd-PK.js.map
   │  │  ├─ Confirmation-B2CsNFnA.js
   │  │  ├─ Confirmation-B2CsNFnA.js.map
   │  │  ├─ Dashboard-CKyjzW_r.js
   │  │  ├─ Dashboard-CKyjzW_r.js.map
   │  │  ├─ Details-DTf9TEer.js
   │  │  ├─ Details-DTf9TEer.js.map
   │  │  ├─ ForgotPassword-DN9tI7XM.js
   │  │  ├─ ForgotPassword-DN9tI7XM.js.map
   │  │  ├─ Home-Bxwj3z5S.js
   │  │  ├─ Home-Bxwj3z5S.js.map
   │  │  ├─ Inbox-BYxj6OYy.js
   │  │  ├─ Inbox-BYxj6OYy.js.map
   │  │  ├─ Login-84q3FhpO.js
   │  │  ├─ Login-84q3FhpO.js.map
   │  │  ├─ MyBookings-CVvZ2rbZ.js
   │  │  ├─ MyBookings-CVvZ2rbZ.js.map
   │  │  ├─ MyTrips-D2Z3TtaQ.js
   │  │  ├─ MyTrips-D2Z3TtaQ.js.map
   │  │  ├─ MyVehicles-DJ1Q0w-Y.js
   │  │  ├─ MyVehicles-DJ1Q0w-Y.js.map
   │  │  ├─ NotFound-HXEi4CUB.js
   │  │  ├─ NotFound-HXEi4CUB.js.map
   │  │  ├─ Profile-D-IFzcSm.js
   │  │  ├─ Profile-D-IFzcSm.js.map
   │  │  ├─ PublishTrip-C4LXfPXa.js
   │  │  ├─ PublishTrip-C4LXfPXa.js.map
   │  │  ├─ Register-CsyiBRSq.js
   │  │  ├─ Register-CsyiBRSq.js.map
   │  │  ├─ ResetPassword-B5748TZF.js
   │  │  ├─ ResetPassword-B5748TZF.js.map
   │  │  ├─ Results-p60dwXWF.js
   │  │  ├─ Results-p60dwXWF.js.map
   │  │  ├─ Search-n65wFUsI.js
   │  │  ├─ Search-n65wFUsI.js.map
   │  │  ├─ UsersManagement-BKzRexei.js
   │  │  ├─ UsersManagement-BKzRexei.js.map
   │  │  ├─ alert-circle-BRB791Ae.js
   │  │  ├─ alert-circle-BRB791Ae.js.map
   │  │  ├─ api-e8fner6b.js
   │  │  ├─ api-e8fner6b.js.map
   │  │  ├─ arrow-left-an2L5SVN.js
   │  │  ├─ arrow-left-an2L5SVN.js.map
   │  │  ├─ arrow-right-DOORWBuz.js
   │  │  ├─ arrow-right-DOORWBuz.js.map
   │  │  ├─ calendar-CAy_8Z9E.js
   │  │  ├─ calendar-CAy_8Z9E.js.map
   │  │  ├─ check-circle-C4ul45EE.js
   │  │  ├─ check-circle-C4ul45EE.js.map
   │  │  ├─ clock-BlqPMwHy.js
   │  │  ├─ clock-BlqPMwHy.js.map
   │  │  ├─ fr-qQOHpMn9.js
   │  │  ├─ fr-qQOHpMn9.js.map
   │  │  ├─ index-7qAxXIiF.js
   │  │  ├─ index-7qAxXIiF.js.map
   │  │  ├─ index-D1G0zhnf.css
   │  │  ├─ info-C-S1y8Gf.js
   │  │  ├─ info-C-S1y8Gf.js.map
   │  │  ├─ lock-Cvh-Aeah.js
   │  │  ├─ lock-Cvh-Aeah.js.map
   │  │  ├─ motion-Bb8VJbUu.js
   │  │  ├─ motion-Bb8VJbUu.js.map
   │  │  ├─ shield-BrMg9Chg.js
   │  │  ├─ shield-BrMg9Chg.js.map
   │  │  ├─ types-9BXKseSZ.js
   │  │  ├─ types-9BXKseSZ.js.map
   │  │  ├─ useMutation-CIlZLu9s.js
   │  │  ├─ useMutation-CIlZLu9s.js.map
   │  │  ├─ useQuery-C88oDNNs.js
   │  │  ├─ useQuery-C88oDNNs.js.map
   │  │  ├─ users-tbM1H_jt.js
   │  │  └─ users-tbM1H_jt.js.map
   │  └─ index.html
   ├─ index.html
   ├─ package-lock.json
   ├─ package.json
   ├─ postcss.config.js
   ├─ src
   │  ├─ App.tsx
   │  ├─ components
   │  │  ├─ common
   │  │  │  ├─ LoadingSpinner.tsx
   │  │  │  └─ ProtectedRoute.tsx
   │  │  ├─ layout
   │  │  │  ├─ AdminLayout.tsx
   │  │  │  ├─ DriverLayout.tsx
   │  │  │  ├─ Footer.tsx
   │  │  │  ├─ Layout.tsx
   │  │  │  ├─ Navbar.tsx
   │  │  │  ├─ PassengerLayout.tsx
   │  │  │  └─ PassengerSpaceLayout.tsx
   │  │  └─ trips
   │  │     └─ TripMap.tsx
   │  ├─ constants
   │  │  └─ wilayaCoords.ts
   │  ├─ index.css
   │  ├─ main.tsx
   │  ├─ pages
   │  │  ├─ Home.tsx
   │  │  ├─ NotFound.tsx
   │  │  ├─ admin
   │  │  │  ├─ Dashboard.tsx
   │  │  │  ├─ TripsMonitoring.tsx
   │  │  │  ├─ UsersManagement.tsx
   │  │  │  └─ VehiclesVerification.tsx
   │  │  ├─ auth
   │  │  │  ├─ ForgotPassword.tsx
   │  │  │  ├─ Login.tsx
   │  │  │  ├─ Register.tsx
   │  │  │  └─ ResetPassword.tsx
   │  │  ├─ booking
   │  │  │  ├─ Checkout.tsx
   │  │  │  └─ Confirmation.tsx
   │  │  ├─ chat
   │  │  │  └─ Inbox.tsx
   │  │  ├─ driver
   │  │  │  ├─ DriverDashboard.tsx
   │  │  │  ├─ History.tsx
   │  │  │  ├─ MyTrips.tsx
   │  │  │  ├─ MyVehicles.tsx
   │  │  │  ├─ PublishTrip.tsx
   │  │  │  ├─ Settings.tsx
   │  │  │  ├─ TripManagement.tsx
   │  │  │  ├─ Verification.tsx
   │  │  │  └─ Wallet.tsx
   │  │  ├─ passenger
   │  │  │  ├─ Favorites.tsx
   │  │  │  ├─ Inbox.tsx
   │  │  │  ├─ MyBookings.tsx
   │  │  │  ├─ PassengerDashboard.tsx
   │  │  │  ├─ PassengerSpace.tsx
   │  │  │  ├─ Profile.tsx
   │  │  │  ├─ Reviews.tsx
   │  │  │  ├─ SearchTrips.tsx
   │  │  │  └─ Spending.tsx
   │  │  └─ trips
   │  │     ├─ Details.tsx
   │  │     ├─ Results.tsx
   │  │     └─ Search.tsx
   │  ├─ services
   │  │  └─ api.ts
   │  ├─ store
   │  │  └─ authStore.ts
   │  ├─ types
   │  │  └─ index.ts
   │  ├─ utils
   │  │  └─ dateUtil.ts
   │  └─ vite-env.d.ts
   ├─ tailwind.config.js
   ├─ tsconfig.json
   ├─ tsconfig.node.json
   └─ vite.config.ts

```# RohWinBghit
