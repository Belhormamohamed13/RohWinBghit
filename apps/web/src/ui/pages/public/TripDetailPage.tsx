import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGetTripByIdQuery, usePublishTripMutation, useCloseTripMutation } from "../../../store/api/tripsApi";
import {
  useAcceptBookingMutation,
  useCancelBookingMutation,
  useCreateBookingMutation,
  useGetBookingsForTripQuery,
  useGetMyBookingsQuery,
  useRejectBookingMutation
} from "../../../store/api/bookingsApi";
import { useMeQuery } from "../../../store/api/usersApi";
import { TripMessagesPanel } from "../../components/TripMessagesPanel";

export function TripDetailPage() {
  const { tripId } = useParams();
  const [seatCount, setSeatCount] = useState(1);
  const [message, setMessage] = useState("");

  const { data: meData } = useMeQuery();
  const me = meData?.data;

  const { data, isLoading, isError } = useGetTripByIdQuery(tripId ?? "", {
    skip: !tripId
  });
  const [createBooking, createState] = useCreateBookingMutation();
  const [acceptBooking, acceptState] = useAcceptBookingMutation();
  const [rejectBooking, rejectState] = useRejectBookingMutation();
  const [cancelBooking, cancelState] = useCancelBookingMutation();

  const [publishTrip, publishState] = usePublishTripMutation();
  const [closeTrip, closeState] = useCloseTripMutation();

  const trip = data?.data;

  const { data: myBookingsData } = useGetMyBookingsQuery(undefined, { skip: !me });
  const myBookingForTrip = useMemo(() => {
    const bookings = myBookingsData?.data ?? [];
    return bookings.find((b) =>
      typeof b.trip === "string" ? b.trip === tripId : b.trip._id === tripId
    );
  }, [myBookingsData, tripId]);

  const isDriver = !!(me && trip && me.id === String(trip.driver));

  const { data: tripBookingsData } = useGetBookingsForTripQuery(tripId ?? "", {
    skip: !tripId || !me || !isDriver
  });
  const pendingBookings = (tripBookingsData?.data ?? []).filter((b) => b.status === "pending");

  async function handleBooking() {
    if (!tripId) return;
    try {
      await createBooking({ tripId, seatCount, passengerMessage: message }).unwrap();
    } catch {
      // errors surfaced via createState
    }
  }

  async function handleAccept(bookingId: string) {
    try {
      await acceptBooking(bookingId).unwrap();
    } catch {
      // final state comes from sockets
    }
  }
  async function handleReject(bookingId: string) {
    try {
      await rejectBooking(bookingId).unwrap();
    } catch {
      // final state comes from sockets
    }
  }
  async function handleCancel(bookingId: string) {
    try {
      await cancelBooking(bookingId).unwrap();
    } catch {
      // final state comes from sockets
    }
  }

  async function handlePublishTrip() {
    if (!tripId) return;
    try {
      await publishTrip(tripId).unwrap();
    } catch {
      // final state comes from sockets
    }
  }
  async function handleCloseTrip() {
    if (!tripId) return;
    try {
      await closeTrip(tripId).unwrap();
    } catch {
      // final state comes from sockets
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
                  {trip.status === "closed" && "Trajet fermé (plus de réservation)."}
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

            {isDriver && (
              <div className="mt-6 rounded-2xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900">Gestion conducteur</div>
                  <div className="flex gap-2">
                    <button
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                      disabled={trip.status !== "draft" || publishState.isLoading}
                      onClick={handlePublishTrip}
                    >
                      Publier
                    </button>
                    <button
                      className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-60"
                      disabled={trip.status !== "published" || closeState.isLoading}
                      onClick={handleCloseTrip}
                    >
                      Fermer
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Demandes en attente
                  </div>
                  {pendingBookings.length === 0 ? (
                    <div className="mt-2 text-sm text-slate-600">Aucune demande en attente.</div>
                  ) : (
                    <div className="mt-2 space-y-2">
                      {pendingBookings.map((b) => (
                        <div
                          key={b._id}
                          className="flex items-center justify-between rounded-xl bg-slate-50 p-3 text-sm"
                        >
                          <div>
                            <div className="font-medium text-slate-900">
                              {b.seatCount} place(s) • {b.totalAmount.toFixed(0)} DZD
                            </div>
                            {b.passengerMessage && (
                              <div className="mt-1 text-xs text-slate-600 line-clamp-2">
                                “{b.passengerMessage}”
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="rounded-xl bg-brand-green px-3 py-2 text-xs font-semibold text-white hover:bg-brand-green-dark disabled:opacity-60"
                              disabled={trip.status !== "published" || acceptState.isLoading}
                              onClick={() => handleAccept(b._id)}
                            >
                              Accepter
                            </button>
                            <button
                              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white disabled:opacity-60"
                              disabled={trip.status !== "published" || rejectState.isLoading}
                              onClick={() => handleReject(b._id)}
                            >
                              Refuser
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <TripMessagesPanel tripId={tripId!} driverId={String(trip.driver)} />
          </section>

          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-slate-900">Réserver</div>
              <div className="mt-2 text-xs text-slate-600">
                Vous paierez après acceptation (Cash ou simulation CIB/BaridiMob).
              </div>

              <div className="mt-4 grid gap-3">
                {myBookingForTrip && (
                  <div className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                    Statut de votre réservation:{" "}
                    <span className="font-semibold">{myBookingForTrip.status}</span>
                    {(myBookingForTrip.status === "pending" || myBookingForTrip.status === "accepted") && (
                      <div className="mt-2">
                        <button
                          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-white disabled:opacity-60"
                          disabled={cancelState.isLoading}
                          onClick={() => handleCancel(myBookingForTrip._id)}
                        >
                          Annuler ma réservation
                        </button>
                      </div>
                    )}
                  </div>
                )}

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
                  disabled={
                    trip.seatsAvailable === 0 ||
                    trip.status !== "published" ||
                    !!myBookingForTrip ||
                    createState.isLoading
                  }
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

