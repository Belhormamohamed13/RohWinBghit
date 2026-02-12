import React, { useState } from 'react';
import DriverLayout from '../../components/layout/DriverLayout';
import {
    Search,
    Download,
    ChevronRight,
    CheckCircle2,
    MapPin,
    Users,
    Info,
    Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tripsApi, driverApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TripHistory: React.FC = () => {
    const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

    const { data: historyData, isLoading: isLoadingHistory } = useQuery({
        queryKey: ['trip-history'],
        queryFn: async () => {
            const response = await tripsApi.getMyTrips({ limit: 50 });
            return response.data.data;
        }
    });

    const { data: stats } = useQuery({
        queryKey: ['driver-stats'],
        queryFn: async () => {
            const response = await driverApi.getStats();
            return response.data.data;
        }
    });

    const trips = historyData?.trips || [];
    const selectedTrip = trips.find((t: any) => t.id === selectedTripId) || trips[0];

    return (
        <DriverLayout>
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Historique des trajets</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium italic">Consultez et gérez vos trajets passés.</p>
                </div>
                <button className="bg-[#13ec6d] hover:bg-[#10cc00] text-white font-black py-3 px-8 rounded-2xl flex items-center gap-2 transition-all shadow-xl shadow-[#13ec6d]/20 active:scale-95 uppercase tracking-widest text-xs">
                    <Download size={18} />
                    Exporter relevés
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Trajets terminés</span>
                        <div className="bg-[#13ec6d]/10 p-3 rounded-2xl group-hover:scale-110 transition-transform"><CheckCircle2 className="text-[#13ec6d]" size={20} /></div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats?.totalTrips || trips.length}</div>
                    <div className="text-[10px] text-green-500 mt-2 font-black uppercase tracking-wider bg-green-500/10 px-2 py-1 rounded inline-block">+12% vs mois dernier</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Revenus Totaux</span>
                        <div className="bg-[#13ec6d]/10 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Download className="text-[#13ec6d]" size={20} /></div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats?.totalRevenue || '0'} <span className="text-sm font-medium text-slate-500 tracking-normal ml-1">DZD</span></div>
                    <div className="text-[10px] text-[#13ec6d] mt-2 font-black uppercase tracking-wider bg-[#13ec6d]/10 px-2 py-1 rounded inline-block">Top 5% Chauffeurs</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Note moyenne</span>
                        <div className="bg-[#13ec6d]/10 p-3 rounded-2xl group-hover:scale-110 transition-transform"><Users className="text-[#13ec6d]" size={20} /></div>
                    </div>
                    <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{stats?.avgRating || '0.0'}</div>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => <CheckCircle2 key={i} size={14} fill={i < Math.floor(stats?.avgRating || 0) ? "#f59e0b" : "transparent"} stroke={i < Math.floor(stats?.avgRating || 0) ? "#f59e0b" : "#cbd5e1"} />)}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm mb-10 flex flex-wrap gap-6 items-center">
                <div className="flex-1 min-w-[240px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl focus:ring-2 focus:ring-[#13ec6d]/50 text-sm font-bold"
                        placeholder="Rechercher une destination..."
                        type="text"
                    />
                </div>
                <div className="flex gap-4">
                    <select className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#13ec6d]/50 py-4 pl-4 pr-10 appearance-none cursor-pointer">
                        <option>30 derniers jours</option>
                        <option>3 derniers mois</option>
                    </select>
                    <select className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[#13ec6d]/50 py-4 pl-4 pr-10 appearance-none cursor-pointer">
                        <option>Tous les status</option>
                        <option>Complété</option>
                        <option>Annulé</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Table Section */}
                <div className="flex-1">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
                        {isLoadingHistory ? (
                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#13ec6d]" size={40} /></div>
                        ) : trips.length === 0 ? (
                            <div className="py-20 text-center font-bold text-slate-400 italic">Aucun trajet trouvé.</div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <tr>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Itinéraire</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Date & Heure</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Places</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Gains</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Statut</th>
                                        <th className="px-8 py-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                    {trips.map((trip: any) => (
                                        <tr
                                            key={trip.id}
                                            onClick={() => setSelectedTripId(trip.id)}
                                            className={`hover:bg-[#13ec6d]/5 cursor-pointer group transition-all duration-300 ${selectedTripId === trip.id ? 'bg-[#13ec6d]/5' : ''}`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-sm text-slate-900 dark:text-white">{trip.from_city}</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-[2px] w-4 bg-[#13ec6d]/40"></div>
                                                        <span className="text-[10px] text-[#13ec6d] font-black tracking-widest">TO</span>
                                                    </div>
                                                    <span className="font-black text-sm text-slate-900 dark:text-white">{trip.to_city}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-sm font-black text-slate-900 dark:text-white capitalize">
                                                    {format(new Date(trip.departure_time), 'dd MMM yyyy', { locale: fr })}
                                                </div>
                                                <div className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
                                                    {format(new Date(trip.departure_time), 'HH:mm')}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="inline-flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl w-10 h-10 text-xs font-black">
                                                    {trip.total_seats - trip.available_seats}/{trip.total_seats}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-black text-slate-900 dark:text-white tracking-tight">{(trip.total_seats - trip.available_seats) * trip.price_per_seat} DZD</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest ${trip.status === 'completed'
                                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                    : trip.status === 'cancelled'
                                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                    }`}>
                                                    {trip.status === 'completed' ? 'Complété' : trip.status === 'cancelled' ? 'Annulé' : 'Actif'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <ChevronRight className={`text-slate-300 group-hover:text-[#13ec6d] group-hover:translate-x-1 transition-all ${selectedTripId === trip.id ? 'text-[#13ec6d] translate-x-1' : ''}`} size={24} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Selected Trip Detail Panel */}
                <div className="w-full lg:w-[420px]">
                    {selectedTrip ? (
                        <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-[0_40px_100px_rgba(0,0,0,0.1)] overflow-hidden sticky top-32 group-hover:border-[#13ec6d]/20 transition-all">
                            <div className="bg-gradient-to-r from-[#13ec6d] to-[#10cc00] p-8 text-white relative">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Info size={120} />
                                </div>
                                <div className="relative z-10">
                                    <h3 className="font-black uppercase tracking-[0.2em] text-[10px] mb-2 opacity-80">Résumé du trajet</h3>
                                    <div className="flex justify-between items-end">
                                        <div className="text-2xl font-black tracking-tight">{selectedTrip.from_city} → {selectedTrip.to_city}</div>
                                        <span className="text-[10px] bg-black/20 px-3 py-1 rounded-full font-black uppercase tracking-widest">#{selectedTrip.id.split('-')[0]}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-10">
                                <div className="flex items-center gap-6 mb-10">
                                    <div className="relative">
                                        <div className="w-[3px] h-16 bg-slate-100 dark:bg-slate-800 absolute left-[15px] top-6"></div>
                                        <div className="flex flex-col gap-10 relative z-10">
                                            <div className="bg-[#13ec6d] rounded-full p-2 shadow-[0_0_10px_#13ec6d]"><MapPin className="text-white" size={16} /></div>
                                            <div className="bg-slate-900 dark:bg-white rounded-full p-2 shadow-xl"><MapPin className="dark:text-slate-900 text-white" size={16} /></div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-8">
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">Départ</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{selectedTrip.from_city}</p>
                                            <p className="text-[11px] text-slate-500 font-bold">{format(new Date(selectedTrip.departure_time), 'HH:mm')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em] mb-1">Arrivée</p>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{selectedTrip.to_city}</p>
                                            <p className="text-[11px] text-slate-500 font-bold">~ {stats?.avgDuration || '2h 15m'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-slate-50 dark:border-slate-800/50 pt-8 mb-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenus Trajet</h4>
                                        <span className="text-[10px] bg-[#13ec6d]/10 text-[#13ec6d] px-2 py-1 rounded font-black">Payé</span>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 space-y-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-bold">Recettes brutes</span>
                                            <span className="font-black text-slate-900 dark:text-white">{(selectedTrip.total_seats - selectedTrip.available_seats) * selectedTrip.price_per_seat} DZD</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-bold">Frais RohWin (5%)</span>
                                            <span className="font-black text-red-500">-{((selectedTrip.total_seats - selectedTrip.available_seats) * selectedTrip.price_per_seat * 0.05).toFixed(0)} DZD</span>
                                        </div>
                                        <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                            <span className="text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">Gain Net</span>
                                            <span className="text-2xl font-black text-[#13ec6d]">{((selectedTrip.total_seats - selectedTrip.available_seats) * selectedTrip.price_per_seat * 0.95).toFixed(0)} DZD</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-black rounded-2xl hover:border-[#13ec6d]/40 hover:text-[#13ec6d] transition-all text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 active:scale-95">
                                    <Info size={16} />
                                    Signaler un problème
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] p-10 text-center text-slate-400 font-bold italic">
                            Sélectionnez un trajet pour voir les détails
                        </div>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
};

export default TripHistory;
