import { Link } from "react-router-dom";

import { useGetMyBookingsQuery } from "../../../store/api/bookingsApi";

export function DashboardBookingsPage() {
  const { data, isLoading, isError } = useGetMyBookingsQuery();
  const bookings = data?.data ?? [];

  return (
    <div className="container-page py-8">
      <h1 className="text-xl font-semibold text-slate-900">Mes réservations</h1>

      {isLoading && <p className="mt-4 text-sm text-slate-600">Chargement des réservations…</p>}
      {isError && (
        <p className="mt-4 text-sm text-red-700">
          Impossible de charger vos réservations.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {bookings.map((b) => {
          const trip =
            typeof b.trip === "string"
              ? null
              : b.trip;
          const statusLabel =
            b.status === "pending"
              ? "En attente"
              : b.status === "accepted"
                ? "Acceptée"
                : b.status === "rejected"
                  ? "Refusée"
                  : b.status === "cancelled"
                    ? "Annulée"
                    : "Terminée";

          const statusColor =
            b.status === "pending"
              ? "bg-amber-100 text-amber-800"
              : b.status === "accepted"
                ? "bg-emerald-100 text-emerald-800"
                : b.status === "rejected" || b.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-slate-100 text-slate-800";

          return (
            <div
              key={b._id}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-semibold">
                    {trip
                      ? `${trip.departureCity} → ${trip.arrivalCity}`
                      : "Trajet RohWinBghit"}
                  </div>
                  {trip && (
                    <div className="text-xs text-slate-600">
                      Départ {new Date(trip.departureAt).toLocaleString()}
                    </div>
                  )}
                </div>
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusColor}`}>
                  {statusLabel}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                <div>
                  {b.seatCount} place(s) • {b.totalAmount.toFixed(0)} DZD
                </div>
                {trip && (
                  <Link
                    className="text-brand-blue hover:underline"
                    to={`/trips/${typeof b.trip === "string" ? b.trip : b.trip._id}`}
                  >
                    Voir le trajet
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {!isLoading && !isError && bookings.length === 0 && (
          <p className="text-sm text-slate-600">Vous n&apos;avez pas encore de réservation.</p>
        )}
      </div>
    </div>
  );
}

