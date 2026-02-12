import { Routes, Route, useLocation, Navigate, Outlet } from 'react-router-dom'
import React, { Suspense, lazy } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'
import AdminLayout from './components/layout/AdminLayout'
import { useAuthStore } from './store/authStore'

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/auth/Login'))
const Register = lazy(() => import('./pages/auth/Register'))
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'))
const TripSearch = lazy(() => import('./pages/trips/Search'))
const TripResults = lazy(() => import('./pages/trips/Results'))
const TripDetails = lazy(() => import('./pages/trips/Details'))
const PassengerSpace = lazy(() => import('./pages/passenger/PassengerSpace'))

// Driver pages
const PublishTrip = lazy(() => import('./pages/driver/PublishTrip'))
const DriverDashboard = lazy(() => import('./pages/driver/DriverDashboard'))
const DriverVehicles = lazy(() => import('./pages/driver/MyVehicles'))
const TripHistory = lazy(() => import('./pages/driver/History'))
const DriverWallet = lazy(() => import('./pages/driver/Wallet'))
const DriverTrips = lazy(() => import('./pages/driver/MyTrips'))
const DriverVerification = lazy(() => import('./pages/driver/Verification'))
const DriverSettings = lazy(() => import('./pages/driver/Settings'))
const TripManagement = lazy(() => import('./pages/driver/TripManagement'))

const Chat = lazy(() => import('./pages/chat/Chat'));

const NotFound = lazy(() => import('./pages/NotFound'))

// Admin routes
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'))
const AdminUsers = lazy(() => import('./pages/admin/UsersManagement'))
const VehiclesVerification = lazy(() => import('./pages/admin/VehiclesVerification'))
const TripsMonitoring = lazy(() => import('./pages/admin/TripsMonitoring'))

function App() {

  const { user, isAuthenticated } = useAuthStore()
  const location = useLocation()
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    // Wait for Zustand to rehydrate from localStorage
    const checkHydration = () => {
      setIsHydrated(true)
    }
    checkHydration()
  }, [])

  if (!isHydrated) {
    return <LoadingSpinner fullScreen />
  }

  return (
    <Suspense fallback={<LoadingSpinner fullScreen />}>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Top-level redirects & Trip Views */}
          <Route path="trips/results" element={
            isAuthenticated ? <Navigate to={`/passenger/trips/results${location.search}`} replace /> : <Layout><TripResults /></Layout>
          } />
          <Route path="trips/:id" element={
            isAuthenticated ? <Navigate to={`/passenger/trips/${location.pathname.split('/').pop()}`} replace /> : <Layout><TripDetails /></Layout>
          } />

          <Route path="my-bookings" element={<Navigate to="/passenger/bookings" replace />} />
          <Route path="profile" element={<Navigate to="/passenger/profile" replace />} />

          <Route element={<Layout />}>
            <Route path="/" element={
              isAuthenticated
                ? user?.role === 'admin'
                  ? <Navigate to="/admin/dashboard" replace />
                  : user?.role === 'driver'
                    ? <Navigate to="/driver/dashboard" replace />
                    : <Navigate to="/passenger/" replace />
                : <Home />
            } />
            <Route path="login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="trips/search" element={<TripSearch />} />

            {/* Redirect legacy booking paths to passenger space if authenticated */}
            <Route path="booking/*" element={
              isAuthenticated ? <Navigate to={`/passenger${location.pathname}${location.search}`} replace /> : <Navigate to="/login" replace />
            } />
          </Route>


          {/* Dedicated Driver routes (No global Navbar) */}
          <Route element={<ProtectedRoute allowedRoles={['driver', 'admin']} />}>
            <Route path="driver">
              <Route index element={<DriverDashboard />} />
              <Route path="dashboard" element={<DriverDashboard />} />
              <Route path="wallet" element={<DriverWallet />} />
              <Route path="history" element={<TripHistory />} />
              <Route path="vehicles" element={<DriverVehicles />} />
              <Route path="my-trips" element={<DriverTrips />} />
              <Route path="trips/:id/manage" element={<TripManagement />} />
              <Route path="publish" element={<PublishTrip />} />

              <Route path="verification" element={<DriverVerification />} />
              <Route path="settings" element={<DriverSettings />} />
              <Route path="messages" element={<Chat />} />
              <Route path="messages/:userId" element={<Chat />} />
              {/* Add other driver routes here */}
            </Route>
          </Route>

          {/* Admin routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminLayout><Outlet /></AdminLayout>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="vehicles" element={<VehiclesVerification />} />
              <Route path="trips" element={<TripsMonitoring />} />
            </Route>
          </Route>

          {/* Passenger Space routes */}
          <Route element={<ProtectedRoute allowedRoles={['passenger', 'driver', 'admin']} />}>
            <Route path="passenger/*" element={<PassengerSpace />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  )
}

export default App
