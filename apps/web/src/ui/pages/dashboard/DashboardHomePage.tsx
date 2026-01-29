import { Link } from "react-router-dom";

import { useMeQuery } from "../../../store/api/usersApi";
import { useGetMyBookingsQuery } from "../../../store/api/bookingsApi";
import { useGetMyTripsQuery } from "../../../store/api/myTripsApi";

export function DashboardHomePage() {
  const { data: meData } = useMeQuery();
  const me = meData?.data;

  const { data: bookingsData } = useGetMyBookingsQuery();
  const activeBookings =
    bookingsData?.data?.filter((b) => b.status === "pending" || b.status === "accepted") ?? [];

  const { data: myTripsData } = useGetMyTripsQuery();
  const upcomingTrips = myTripsData?.data ?? [];

  return (
    <div className="container-page py-8">
      <h1 className="text-2xl font-semibold text-slate-900">
        Bienvenue, {me?.firstName ?? ""}
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Gérez vos réservations, trajets et messages RohWinBghit.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Réservations actives
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {activeBookings.length}
          </div>
          <Link
            className="mt-3 inline-block text-sm text-brand-blue hover:underline"
            to="/dashboard/bookings"
          >
            Voir mes réservations
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Mes trajets (conducteur)
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">
            {upcomingTrips.length}
          </div>
          <Link
            className="mt-3 inline-block text-sm text-brand-blue hover:underline"
            to="/dashboard/trips"
          >
            Voir mes trajets
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Messages
          </div>
          <div className="mt-2 text-2xl font-semibold text-slate-900">—</div>
          <Link
            className="mt-3 inline-block text-sm text-brand-blue hover:underline"
            to="/dashboard/messages"
          >
            Accéder aux messages
          </Link>
        </div>
      </div>
    </div>
  );
}

