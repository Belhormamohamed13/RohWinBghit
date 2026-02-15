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
            <div className="min-h-screen text-white p-6 md:p-10 animate-fade-in font-body">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="font-bebas text-5xl tracking-wide text-accent-teal mb-2">
                            MY TRIPS
                        </h1>
                        <p className="text-white/60 font-almarai text-lg">
                            Manage your published and completed trips
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/driver/publish')}
                        className="flex items-center gap-3 bg-accent-teal text-night-900 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Publish Trip
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {['Upcoming', 'Completed', 'Cancelled'].map((tab, idx) => (
                        <button
                            key={tab}
                            className={`px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${idx === 0
                                ? 'bg-accent-teal text-night-900 border-accent-teal shadow-glow'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-accent-teal/20 hover:text-accent-teal hover:border-accent-teal/30'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {trips && trips.length > 0 ? (
                    <div className="grid gap-6">
                        {trips.map((trip: any) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl hover:border-accent-teal/50 hover:bg-accent-teal/5 transition-all group cursor-pointer"
                                onClick={() => navigate(`/driver/trips/${trip.id}/manage`)}
                            >
                                <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8">
                                    <div className="flex-1">
                                        {/* Trip Header: Date & Status */}
                                        <div className="flex flex-wrap justify-between items-start mb-6 gap-4">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2 text-accent-teal mb-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span className="font-jetbrains text-sm uppercase tracking-wider font-bold">
                                                        {DateUtil.getTripDateDisplay(trip.departure_time)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-jetbrains text-xs">
                                                        {DateUtil.formatTime(trip.departure_time)}
                                                    </span>
                                                </div>
                                            </div>

                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest glass-effect border ${trip.status === 'active' || trip.status === 'scheduled' ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/20' :
                                                trip.status === 'completed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {trip.status === 'active' || trip.status === 'scheduled' ? 'Scheduled' :
                                                    trip.status === 'completed' ? 'Completed' : 'Cancelled'}
                                            </span>
                                        </div>

                                        {/* Route Visual */}
                                        <div className="relative pl-8 border-l border-white/10 ml-2 space-y-8">
                                            <div className="relative">
                                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-night-900 bg-accent-teal shadow-glow"></div>
                                                <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">From</p>
                                                <h3 className="text-2xl font-bebas tracking-wide text-white">{getWilayaName(trip.from_wilaya_id)}</h3>
                                                <p className="text-sm text-white/60">{trip.from_city}</p>
                                            </div>
                                            <div className="relative">
                                                <div className="absolute -left-[41px] top-1 w-5 h-5 rounded-full border-4 border-night-900 bg-white shadow-lg"></div>
                                                <p className="text-xs font-mono text-white/40 uppercase tracking-widest mb-1">To</p>
                                                <h3 className="text-2xl font-bebas tracking-wide text-white">{getWilayaName(trip.to_wilaya_id)}</h3>
                                                <p className="text-sm text-white/60">{trip.to_city}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Section: Stats & Action */}
                                    <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-6 lg:pl-10 lg:border-l lg:border-white/5 min-w-[200px]">
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 font-mono">Estimated Earnings</p>
                                            <p className="text-3xl font-bebas tracking-wide text-accent-teal">
                                                {(Number(trip.price_per_seat) * (trip.total_seats || 3)).toLocaleString()} <span className="text-xs text-white/40 font-sans">DZD</span>
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 font-mono">Seats</p>
                                            <div className={`flex items-center gap-2 justify-end ${trip.available_seats === 0 ? 'text-red-400' : 'text-white'}`}>
                                                <Users className="w-4 h-4" />
                                                <span className="font-mono font-bold">{trip.available_seats} / {trip.total_seats || 3} left</span>
                                            </div>
                                        </div>

                                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 group-hover:bg-accent-teal group-hover:text-night-900 group-hover:border-accent-teal transition-all">
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-white/5 backdrop-blur-md rounded-[2rem] border border-dashed border-white/10 mx-auto max-w-2xl px-12">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/10">
                            <AlertCircle className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-3xl font-bebas text-white mb-3 tracking-wide">NO TRIPS FOUND</h3>
                        <p className="text-white/60 font-body mb-10 max-w-md mx-auto">
                            You haven't published any trips yet. Share your journey and start earning today.
                        </p>
                        <button
                            onClick={() => navigate('/driver/publish')}
                            className="bg-accent-teal text-night-900 px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
                        >
                            Publish First Trip
                        </button>
                    </div>
                )}
            </div>
        </DriverLayout>
    );
};

export default MyTrips
