import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { tripsApi, wilayasApi } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import DriverLayout from '../../components/layout/DriverLayout';
import {
    Calendar,
    Clock,
    Users,
    ChevronRight,
    Plus,
    AlertCircle
} from 'lucide-react';
import DateUtil from '../../utils/dateUtil';

const MyTrips = () => {
    const navigate = useNavigate()

    const { data: trips, isLoading: tripsLoading } = useQuery({
        queryKey: ['my-trips'],
        queryFn: async () => {
            const response = await tripsApi.getMyTrips()
            return response.data.data
        },
    })

    const { data: wilayas } = useQuery({
        queryKey: ['wilayas'],
        queryFn: async () => {
            const response = await wilayasApi.getAll()
            return response.data.data
        },
    })

    if (tripsLoading) return <LoadingSpinner fullScreen />

    const getWilayaName = (code: number) => {
        return wilayas?.find((w: any) => w.code === code)?.name || code
    }

    return (
        <DriverLayout>
            <div className="animate-fade-in">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight italic">Mes Trajets</h1>
                        <p className="mt-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">GÉREZ VOS TRAJETS PUBLIÉS ET VOS RÉSERVATIONS</p>
                    </div>
                    <button
                        onClick={() => navigate('/driver/publish')}
                        className="flex items-center gap-3 bg-[#13ec6d] text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec6d]/20 hover:scale-[1.03] active:scale-95 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Publier un trajet
                    </button>
                </div>

                {trips && trips.length > 0 ? (
                    <div className="grid gap-8">
                        {trips.map((trip: any) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-soft hover:shadow-elevated transition-all group overflow-hidden"
                                onClick={() => navigate(`/driver/trips/${trip.id}/manage`)}
                            >
                                <div className="p-8">
                                    <div className="flex flex-col lg:flex-row justify-between items-stretch gap-10">
                                        <div className="flex-1 space-y-8">
                                            {/* Route Display */}
                                            <div className="flex gap-8 items-center pt-2">
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full border-2 border-[#13ec6d]"></div>
                                                    <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-700 border-dashed border-l-2"></div>
                                                    <div className="w-3 h-3 rounded-full bg-[#13ec6d]"></div>
                                                </div>
                                                <div className="flex flex-col gap-8">
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">DÉPART</p>
                                                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{getWilayaName(trip.from_wilaya_id)} - {trip.from_city}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">ARRIVÉE</p>
                                                        <p className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{getWilayaName(trip.to_wilaya_id)} - {trip.to_city}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info Chips */}
                                            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                                                    <Calendar className="w-4 h-4 text-[#13ec6d]" />
                                                    {DateUtil.getTripDateDisplay(trip.departure_time)}
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl">
                                                    <Clock className="w-4 h-4 text-[#13ec6d]" />
                                                    {DateUtil.formatTime(trip.departure_time)}
                                                </div>
                                                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl ${trip.available_seats === 0 ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500'}`}>
                                                    <Users className={`w-4 h-4 ${trip.available_seats === 0 ? 'text-red-500' : 'text-[#13ec6d]'}`} />
                                                    {trip.available_seats === 0 ? 'COMPLET' : `${trip.available_seats} places libres`}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 py-6 lg:py-4 lg:pl-12 lg:border-l lg:border-dashed lg:border-slate-200 dark:lg:border-slate-800 min-w-[200px]">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">REVENU TOTAL</p>
                                                <p className="text-3xl font-black text-[#13ec6d] tracking-tighter italic">
                                                    {(Number(trip.price_per_seat) * (trip.total_seats || trip.available_seats)).toLocaleString()} <span className="text-sm font-normal text-slate-400 not-italic ml-1">DZD</span>
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${trip.status === 'active' ? 'bg-[#13ec6d]/10 text-[#13ec6d] border-[#13ec6d]/20' :
                                                    trip.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-red-500/10 text-red-500 border-red-500/20'
                                                    }`}>
                                                    {trip.status === 'active' ? 'En ligne' :
                                                        trip.status === 'completed' ? 'Terminé' : 'Annulé'}
                                                </span>
                                                <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                                    <ChevronRight className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 mx-auto max-w-2xl px-12">
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <AlertCircle className="w-12 h-12 text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight italic">Aucun trajet trouvé</h3>
                        <p className="text-slate-500 font-medium italic mb-10">
                            Vous n'avez pas encore publié de trajet. Partagez votre voyage pour commencer à gagner.
                        </p>
                        <button
                            onClick={() => navigate('/driver/publish')}
                            className="bg-[#13ec6d] text-slate-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec6d]/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Publier mon premier trajet
                        </button>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
};

export default MyTrips
