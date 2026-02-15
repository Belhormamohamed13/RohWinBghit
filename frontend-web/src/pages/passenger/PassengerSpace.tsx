import React, { lazy, Suspense } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import PassengerSpaceLayout from '../../components/layout/PassengerSpaceLayout';
import BookingCheckout from '../booking/Checkout';

// Sub-views
const SearchTripsView = lazy(() => import('./SearchTrips'));
const BookingsView = lazy(() => import('./MyBookings'));
const FavoritesView = lazy(() => import('./Favorites'));
const SpendingView = lazy(() => import('./Spending'));
const ProfileView = lazy(() => import('./Profile'));
const ChatView = lazy(() => import('../chat/Chat'));
const TripResults = lazy(() => import('../trips/Results'));
const TripDetails = lazy(() => import('../trips/Details'));
const BookingConfirmation = lazy(() => import('../booking/Confirmation'));
const HistoryView = lazy(() => import('./History'));

const PassengerSpace: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Determine active tab from URL
    const getActiveTab = () => {
        const path = location.pathname.split('/').filter(Boolean);
        // If we are deep into a sub-module, identify the root tab
        if (path.includes('trips') || path.includes('booking') || path.includes('search')) return 'search';
        if (path.includes('bookings')) return 'bookings';
        if (path.includes('spending') || path.includes('wallet')) return 'spending';
        if (path.includes('messages')) return 'messages';
        if (path.includes('profile')) return 'profile';
        if (path.includes('favorites')) return 'favorites';
        return 'search';
    };

    const activeTab = getActiveTab();

    const handleTabChange = (tab: string) => {
        const paths: Record<string, string> = {
            search: '/passenger/search',
            bookings: '/passenger/bookings',
            spending: '/passenger/spending',
            messages: '/passenger/messages',
            profile: '/passenger/profile',
            favorites: '/passenger/favorites',
            history: '/passenger/history'
        };
        const path = paths[tab];
        if (path) {
            navigate(path);
        }
    };

    return (
        <PassengerSpaceLayout activeTab={activeTab} onTabChange={handleTabChange}>
            <Suspense fallback={<div className="flex items-center justify-center p-20 animate-pulse text-primary font-black uppercase tracking-[0.4em]">Chargement de la vue...</div>}>
                <Routes>
                    <Route index element={<SearchTripsView />} />
                    <Route path="search" element={<SearchTripsView />} />
                    <Route path="trips">
                        <Route path="results" element={<TripResults />} />
                        <Route path=":id" element={<TripDetails />} />
                    </Route>

                    <Route path="booking/checkout" element={<BookingCheckout />} />
                    <Route path="booking/confirmation" element={<BookingConfirmation />} />

                    <Route path="bookings" element={<BookingsView />} />
                    <Route path="profile" element={<ProfileView />} />
                    <Route path="spending" element={<SpendingView />} />
                    <Route path="messages" element={<ChatView noLayout={true} />} /> {/* Added messages route */}
                    <Route path="messages/:userId" element={<ChatView noLayout={true} />} />
                    <Route path="favorites" element={<FavoritesView />} />
                    <Route path="history" element={<HistoryView />} />

                    {/* Catch unknown sub-paths and redirect to search within passenger space */}
                    <Route path="*" element={<Navigate to="/passenger/search" replace />} />
                </Routes>
            </Suspense>
        </PassengerSpaceLayout>

    );
};

export default PassengerSpace;
