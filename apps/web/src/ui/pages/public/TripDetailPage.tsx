import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGetTripByIdQuery } from "../../../store/api/tripsApi";
import { useCreateBookingMutation } from "../../../store/api/bookingsApi";
import { TripMessagesPanel } from "../../components/TripMessagesPanel";

export function TripDetailPage() {
  const { tripId } = useParams();
  const [seatCount, setSeatCount] = useState(1);
  const [message, setMessage] = useState("");

  const { data, isLoading, isError } = useGetTripByIdQuery(tripId ?? "", {
    skip: !tripId
  });
  const [createBooking, createState] = useCreateBookingMutation();

  const trip = data?.data;

  async function handleBooking() {
    if (!tripId) return;
    try {
      await createBooking({ tripId, seatCount, passengerMessage: message }).unwrap();
    } catch {
      // errors surfaced via createState
    }
  }

  return (
    <div className="container-page py-10">
      <nav className="text-xs text-slate-500">
        <Link className="hover:text-slate-900" to="/">
          Accueil
        </Link>{" "}
        <span aria-hidden="true">›</span>{" "}
        <Link className="hover:text-slate-900" to="/search">
          Recherche
        </Link>{" "}
        <span aria-hidden="true">›</span> Détails
      </nav>

      {isLoading && <div className="mt-6 text-sm text-slate-600">Chargement du trajet…</div>}
      {isError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Impossible de charger ce trajet.
        </div>
      )}

      {trip && (
        <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_360px]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {trip.departureCity} → {trip.arrivalCity}
                </h1>
                <div className="mt-1 text-sm text-slate-600">
                  Départ {new Date(trip.departureAt).toLocaleString()}
                  {trip.arrivalEstimateAt && (
                    <> • Arrivée estimée {new Date(trip.arrivalEstimateAt).toLocaleString()}</>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-semibold text-brand-green">
                  {trip.pricePerSeat.toFixed(0)} DZD
                </div>
                <div className="text-xs text-slate-500">par place</div>
                <div className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                  {trip.seatsAvailable} / {trip.seatsTotal} places disponibles
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Itinéraire
                </div>
                <div className="mt-3 grid gap-3 text-sm text-slate-700">
                  <div>
                    <div className="text-xs text-slate-500">Départ</div>
                    <div className="font-medium text-slate-900">
                      {trip.departureCity} • {new Date(trip.departureAt).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Arrivée</div>
                    <div className="font-medium text-slate-900">
                      {trip.arrivalCity}
                      {trip.arrivalEstimateAt && (
                        <> • {new Date(trip.arrivalEstimateAt).toLocaleString()}</>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Statut
                </div>
                <div className="mt-3 text-sm text-slate-700">
                  {trip.status === "published" && "Trajet ouvert aux réservations."}
                  {trip.status === "cancelled" && "Trajet annulé."}
                  {trip.status === "completed" && "Trajet terminé."}
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Description
              </div>
              <p className="mt-2 text-sm text-slate-700">
                {trip.description || "Trajet publié sur RohWinBghit."}
              </p>
            </div>

            <TripMessagesPanel tripId={tripId!} driverId={String(trip.driver)} />
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Réserver</div>
              <div className="mt-2 text-xs text-slate-600">
                Vous paierez après acceptation (Cash ou simulation CIB/BaridiMob).
              </div>

              <div className="mt-4 grid gap-3">
                <label className="text-xs font-semibold text-slate-600">Nombre de places</label>
                <select
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                  value={seatCount}
                  onChange={(e) => setSeatCount(Number(e.target.value))}
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n} disabled={n > trip.seatsAvailable}>
                      {n}
                    </option>
                  ))}
                </select>

                <label className="mt-2 text-xs font-semibold text-slate-600">
                  Message au conducteur (optionnel)
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-blue"
                  placeholder="Ex: Bonjour, je serai au point de départ à 07:55."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />

                {createState.isError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                    Impossible d&apos;envoyer la demande de réservation.
                  </div>
                )}

                <button
                  className="mt-2 rounded-xl bg-brand-green px-4 py-3 text-sm font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
                  disabled={trip.seatsAvailable === 0 || createState.isLoading}
                  onClick={handleBooking}
                >
                  {createState.isLoading ? "Envoi en cours…" : "Envoyer la demande"}
                </button>

                <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  Prix total estimé:{" "}
                  <span className="font-semibold text-slate-900">
                    {(trip.pricePerSeat * seatCount).toFixed(0)} DZD
                  </span>
                </div>

                {createState.isSuccess && (
                  <div className="rounded-xl bg-green-50 p-3 text-xs text-green-700">
                    Demande envoyée. Statut: en attente d&apos;acceptation par le conducteur.
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

