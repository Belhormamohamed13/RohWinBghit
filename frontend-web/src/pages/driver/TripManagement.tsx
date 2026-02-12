import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tripsApi, bookingsApi, wilayasApi } from '../../services/api';
import DriverLayout from '../../components/layout/DriverLayout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DateUtil from '../../utils/dateUtil';
import { toast } from 'react-hot-toast';
import {
    Users,
    CheckCircle2,
    XCircle,
    MessageSquare,
    ChevronLeft,
    MapPin,
    Calendar,
    AlertCircle
} from 'lucide-react';

const TripManagement = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: trip, isLoading: tripLoading } = useQuery({
        queryKey: ['trip-manage', id],
        queryFn: async () => {
            const response = await tripsApi.getById(id!);
            return response.data.data;
        },
        enabled: !!id
    });

    const { data: bookings, isLoading: bookingsLoading } = useQuery({
        queryKey: ['trip-bookings', id],
        queryFn: async () => {
            const response = await bookingsApi.getByTrip(id!);
            return response.data.data;
        },
        enabled: !!id
    });

    const { data: wilayas } = useQuery({
        queryKey: ['wilayas'],
        queryFn: async () => {
            const response = await wilayasApi.getAll();
            return response.data.data;
        }
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ bookingId, status }: { bookingId: string, status: string }) =>
            bookingsApi.updateStatus(bookingId, status),
        onSuccess: (_, variables) => {
            toast.success(`Réservation ${variables.status === 'confirmed' ? 'acceptée' : 'refusée'}`);
            queryClient.invalidateQueries({ queryKey: ['trip-bookings', id] });
            queryClient.invalidateQueries({ queryKey: ['trip-manage', id] });
        },
        onError: () => {
            toast.error('Erreur lors de la mise à jour');
        }
    });

    if (tripLoading || bookingsLoading) return <LoadingSpinner fullScreen />;
    if (!trip) return <div className="text-center py-20">Trajet non trouvé</div>;

    const getWilayaName = (code: number) => {
        return wilayas?.find((w: any) => w.code === code)?.name || code;
    };

    return (
        <DriverLayout>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-slate-500 hover:text-slate-900 mb-8 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    <span>Retour à mes trajets</span>
                </button>

                {/* Trip Overview Header */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-soft mb-10">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">
                                Gestion du <span className="text-primary">Trajet</span>
                            </h1>
                            <div className="flex flex-wrap gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {getWilayaName(trip.from_wilaya_id)} → {getWilayaName(trip.to_wilaya_id)}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {DateUtil.getTripDateDisplay(trip.departure_time)} à {DateUtil.formatTime(trip.departure_time)}
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400">
                                    <Users className="w-4 h-4 text-primary" />
                                    {trip.available_seats} / {trip.total_seats} places disponibles
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end justify-center">
                            <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${trip.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {trip.status === 'active' ? 'EN LIGNE' : 'ANNULÉ'}
                            </span>
                            <p className="mt-2 text-2xl font-black text-primary italic">{trip.price_per_seat} DZD <span className="text-xs text-slate-400 font-normal">/ place</span></p>
                            <button
                                onClick={async () => {
                                    // The provided snippet was malformed. Reverting to original logic for cancellation prompt.
                                    const reason = window.prompt('Raison de l\'annulation (vos passagers seront informés) :');
                                    if (reason) {
                                        try {
                                            await tripsApi.cancel(trip.id, reason);
                                            toast.success('Trajet annulé');
                                            navigate('/driver/my-trips');
                                        } catch (error) {
                                            toast.error('Erreur lors de l\'annulation');
                                        }
                                    }
                                }}
                                className="mt-6 text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                            >
                                Annuler le trajet
                            </button>
                        </div>
                    </div>
                </div>


                {/* Reservations List */}
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary">group</span>
                    Réservations reçues
                </h2>

                <div className="space-y-6">
                    {bookings && bookings.length > 0 ? (
                        bookings.map((booking: any) => (
                            <div key={booking.id} className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-soft hover:shadow-elevated transition-all overflow-hidden relative">
                                {booking.status === 'pending' && <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500"></div>}
                                {booking.status === 'confirmed' && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div>}

                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6">
                                        <div className="relative">
                                            <img
                                                src={booking.passenger?.avatar_url || `https://ui-avatars.com/api/?name=${booking.passenger?.first_name}+${booking.passenger?.last_name}&background=random`}
                                                alt="Passenger"
                                                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-slate-900 dark:text-white">
                                                {booking.passenger?.first_name} {booking.passenger?.last_name}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs font-bold text-slate-500">{booking.num_seats} place(s)</span>
                                                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-xs font-black text-primary uppercase">{parseFloat(booking.total_price).toLocaleString()} DZD</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 items-center">
                                        <div className="mr-4 flex gap-2">
                                            <button
                                                onClick={() => navigate(`/driver/messages/${booking.passenger_id}`)}
                                                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
                                                title="Envoyer un message"
                                            >
                                                <span className="material-symbols-outlined text-sm font-black">chat</span>
                                            </button>
                                            <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                    'bg-red-50 text-red-700 border-red-200'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'ACCEPTÉE' :
                                                    booking.status === 'pending' ? 'EN ATTENTE' :
                                                        booking.status === 'rejected' ? 'REFUSÉE' : 'ANNULÉE'}
                                            </span>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: 'confirmed' })}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-slate-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    Accepter
                                                </button>
                                                <button
                                                    onClick={() => updateStatusMutation.mutate({ bookingId: booking.id, status: 'rejected' })}
                                                    disabled={updateStatusMutation.isPending}
                                                    className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-all border border-red-100"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                    Refuser
                                                </button>
                                            </>
                                        )}

                                        <button
                                            onClick={() => navigate(`/chat/${booking.passenger_id}`)}
                                            className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-200 transition-all"
                                        >
                                            <MessageSquare className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500 font-black italic uppercase tracking-widest">Aucune réservation pour ce trajet</p>
                        </div>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
};

export default TripManagement;
