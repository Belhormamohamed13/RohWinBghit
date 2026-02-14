import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const History: React.FC = () => {
    const navigate = useNavigate();
    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['bookings-history'],
        queryFn: async () => {
            const response = await bookingsApi.getMyBookings(); // Adjust this if you have a specific history endpoint
            return response.data.data.filter((b: any) => b.status === 'completed' || b.status === 'cancelled');
        }
    });

    const bookings = bookingsData || [];

    return (
        <div className="max-w-7xl mx-auto py-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                    Historique des <span className="text-primary italic">Voyages</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 leading-relaxed max-w-2xl">
                    Retrouvez ici tous vos trajets terminés ou annulés.
                </p>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Chargement...</p>
                    </div>
                ) : bookings.length > 0 ? bookings.map((booking: any) => (
                    <div key={booking.id} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white dark:border-slate-800 overflow-hidden hover:shadow-elevated transition-all group">
                        <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
                            {/* Trip Info */}
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${booking.status === 'completed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                                        }`}>
                                        {booking.status === 'completed' ? 'Terminé' : 'Annulé'}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">
                                        {format(new Date(booking.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{booking.trip?.from_city}</h3>
                                    <span className="material-symbols-outlined text-slate-400">arrow_forward</span>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{booking.trip?.to_city}</h3>
                                </div>
                                <p className="text-sm text-slate-500 mt-2">
                                    Conducteur: {booking.trip?.driver?.first_name} {booking.trip?.driver?.last_name}
                                </p>
                            </div>

                            {/* Price & Action */}
                            <div className="text-right">
                                <p className="text-2xl font-black text-primary">{parseFloat(booking.total_price).toLocaleString()} DZD</p>
                                <button
                                    onClick={() => navigate(`/passenger/trips/${booking.trip_id}`)}
                                    className="mt-4 px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                                >
                                    Voir détails
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-20 text-center bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <span className="material-symbols-outlined text-slate-300 text-5xl mb-4">history</span>
                        <p className="text-slate-500 font-medium">Aucun historique disponible.</p>
                    </div>
                )}
            </div>

        </div>
    );
};

export default History;
