import { useSearchParams, Link } from "react-router-dom";

import { useSearchTripsQuery } from "../../../store/api/tripsApi";
import type { TripDto } from "../../../types/api";

export function SearchResultsPage() {
  const [params] = useSearchParams();
  const from = params.get("from") ?? "";
  const to = params.get("to") ?? "";
  const date = params.get("date") ?? "";
  const seats = Number(params.get("seats") ?? "1");

  const { data, isLoading, isError } = useSearchTripsQuery(
    { from, to, date: date || undefined, seats },
    { skip: !from || !to }
  );

  const trips = data?.data ?? [];

  const renderTripCard = (trip: TripDto) => (
    <div
      key={trip._id}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-200" aria-hidden="true" />
          <div>
            <div className="text-sm font-semibold text-slate-900">{trip.departureCity} → {trip.arrivalCity}</div>
            <div className="text-xs text-slate-600">Conducteur • Avis à venir</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-brand-green">
            {trip.pricePerSeat.toFixed(0)} DZD
          </div>
          <div className="text-xs text-slate-500">par place</div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-3">
        <div className="text-sm text-slate-700">
          <div className="text-xs font-semibold uppercase text-slate-500">Départ</div>
          <div>{new Date(trip.departureAt).toLocaleString()}</div>
        </div>
        <div className="text-sm text-slate-700">
          <div className="text-xs font-semibold uppercase text-slate-500">Arrivée estimée</div>
          <div>{trip.arrivalEstimateAt ? new Date(trip.arrivalEstimateAt).toLocaleString() : "—"}</div>
        </div>
        <div className="text-sm text-slate-700">
          <div className="text-xs font-semibold uppercase text-slate-500">Places</div>
          <div>{trip.seatsAvailable} / {trip.seatsTotal} disponibles</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-600 truncate">
          {trip.description || "Trajet ajouté sur RohWinBghit"}
        </div>
        <Link
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          to={`/trips/${trip._id}`}
        >
          Voir détails
        </Link>
      </div>
    </div>
  );

  return (
    <div className="container-page py-10">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-slate-900">Résultats</h2>
        <p className="text-sm text-slate-600">
          Recherche: <span className="font-medium">{from || "—"}</span> →{" "}
          <span className="font-medium">{to || "—"}</span> •{" "}
          <span className="font-medium">{date || "—"}</span> •{" "}
          <span className="font-medium">{seats}</span> place(s)
        </p>
      </div>

      <div className="mt-8 grid gap-4">
        {isLoading && <div className="text-sm text-slate-600">Chargement des trajets…</div>}
        {isError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Impossible de charger les trajets. Veuillez réessayer.
          </div>
        )}
        {!isLoading && !isError && trips.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
            Aucun trajet trouvé pour cette recherche. Essayez une autre date ou ajustez vos filtres.
          </div>
        )}
        {trips.map(renderTripCard)}
      </div>
    </div>
  );
}

