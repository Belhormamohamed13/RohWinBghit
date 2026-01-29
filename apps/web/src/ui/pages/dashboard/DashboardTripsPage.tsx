import { Link } from "react-router-dom";

import { useGetMyTripsQuery } from "../../../store/api/myTripsApi";

export function DashboardTripsPage() {
  const { data, isLoading, isError } = useGetMyTripsQuery();
  const trips = data?.data ?? [];

  return (
    <div className="container-page py-8">
      <h1 className="text-xl font-semibold text-slate-900">Mes trajets (conducteur)</h1>

      {isLoading && <p className="mt-4 text-sm text-slate-600">Chargement de vos trajets…</p>}
      {isError && (
        <p className="mt-4 text-sm text-red-700">
          Impossible de charger vos trajets.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {trips.map((t) => (
          <div
            key={t._id}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-800"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="font-semibold">
                  {t.departureCity} → {t.arrivalCity}
                </div>
                <div className="text-xs text-slate-600">
                  Départ {new Date(t.departureAt).toLocaleString()}
                </div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <div>
                  {t.seatsAvailable} / {t.seatsTotal} places libres
                </div>
                <div className="mt-1 font-semibold text-brand-green">
                  {t.pricePerSeat.toFixed(0)} DZD / place
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
              <div>
                Statut:{" "}
                <span className="font-medium">
                  {t.status === "published"
                    ? "Publié"
                    : t.status === "cancelled"
                      ? "Annulé"
                      : t.status === "completed"
                        ? "Terminé"
                        : t.status}
                </span>
              </div>
              <Link className="text-brand-blue hover:underline" to={`/trips/${t._id}`}>
                Voir le trajet
              </Link>
            </div>
          </div>
        ))}

        {!isLoading && !isError && trips.length === 0 && (
          <p className="text-sm text-slate-600">
            Vous n&apos;avez pas encore publié de trajet.
          </p>
        )}
      </div>
    </div>
  );
}

