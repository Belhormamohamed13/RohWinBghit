import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { PublicLayout } from "../ui/layouts/PublicLayout";
import { AuthLayout } from "../ui/layouts/AuthLayout";
import { HomePage } from "../ui/pages/public/HomePage";
import { SearchResultsPage } from "../ui/pages/public/SearchResultsPage";
import { TripDetailPage } from "../ui/pages/public/TripDetailPage";
import { DriverPublicProfilePage } from "../ui/pages/public/DriverPublicProfilePage";
import { HowItWorksPage } from "../ui/pages/public/HowItWorksPage";
import { TrustSafetyPage } from "../ui/pages/public/TrustSafetyPage";
import { ContactPage } from "../ui/pages/public/ContactPage";
import { LegalPage } from "../ui/pages/public/LegalPage";
import { LoginPage } from "../ui/pages/auth/LoginPage };
import { RegisterPage } from "../ui/pages/auth/RegisterPage";
import { ForgotPasswordPage } from "../ui/pages/auth/ForgotPasswordPage";
import { DashboardHomePage } from "../ui/pages/dashboard/DashboardHomePage";
import { DashboardBookingsPage } from "../ui/pages/dashboard/DashboardBookingsPage";
import { DashboardTripsPage } from "../ui/pages/dashboard/DashboardTripsPage";
import { DashboardMessagesPage } from "../ui/pages/dashboard/DashboardMessagesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "search", element: <SearchResultsPage /> },
      { path: "trips/:tripId", element: <TripDetailPage /> },
      { path: "users/:userId", element: <DriverPublicProfilePage /> },
      { path: "how-it-works", element: <HowItWorksPage /> },
      { path: "trust-safety", element: <TrustSafetyPage /> },
      { path: "contact", element: <ContactPage /> },
      { path: "legal/:doc", element: <LegalPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "forgot-password", element: <ForgotPasswordPage /> }
    ]
  },
  {
    path: "/dashboard",
    element: <AuthLayout />,
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: "bookings", element: <DashboardBookingsPage /> },
      { path: "trips", element: <DashboardTripsPage /> },
      { path: "messages", element: <DashboardMessagesPage /> }
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

