import { motion } from 'framer-motion'
import {
    Map,
    Clock,
    TrendingUp,
    Search,
    Filter,
    Navigation,
    User,
    MoreVertical,
    Activity,
    ArrowRight,
    MapPin
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/api'

const TripsMonitoring = () => {
    const { data: trips, isLoading } = useQuery({
        queryKey: ['admin-active-trips'],
        queryFn: async () => {
            const response = await adminApi.getTrips({ status: 'active' })
            return response.data.data
        },
        refetchInterval: 30000 // Refresh every 30 seconds
    })

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Live Stats */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter">
                        Surveillance <span className="text-primary italic">Live</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3 italic">
                        Flux de données en temps réel des trajets actifs
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/5 rounded-2xl group">
                        <Activity className="w-5 h-5 text-primary animate-pulse" />
                        <div>
                            <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Canal Actif</p>
                            <p className="text-[8px] text-slate-500 font-bold uppercase mt-1">Rafraîchissement : 30s</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-all" />
                            <input
                                type="text"
                                placeholder="TRACKING ID / VILLE..."
                                className="pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-primary/30 outline-none transition-all w-64 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-600 shadow-elevated"
                            />
                        </div>
                        <button className="w-14 h-14 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
                        <Navigation className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse italic">Synchronisation satellite en cours...</p>
                </div>
            ) : trips?.length === 0 ? (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-32 text-center border border-white/5 shadow-elevated">
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
                        <Map className="w-10 h-10 text-slate-700" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Silience Radio</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-4">Aucun trajet actif sur le réseau pour le moment.</p>
                </div>
            ) : (
                <div className="grid gap-10">
                    {trips?.map((trip: any) => (
                        <motion.div
                            key={trip.id}
                            initial={{ opacity: 0, scale: 0.98, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/5 shadow-elevated lg:grid lg:grid-cols-4 gap-12 items-center group hover:bg-slate-800/60 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-16 bg-primary/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                            {/* Status and ID */}
                            <div className="lg:col-span-1 border-white/5 pr-8 relative z-10 flex lg:flex-col gap-6 lg:gap-8 items-center lg:items-start h-full">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/5 rounded-[1.5rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500">
                                        <Navigation className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 leading-none">STATUS SIGNAL</p>
                                        <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black bg-primary/20 text-primary border border-primary/20 uppercase tracking-[0.1em] italic">
                                            {trip.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="hidden lg:block">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2 leading-none">TRACKING ID</p>
                                    <p className="text-xs font-black text-white/40 font-mono tracking-tighter uppercase">{trip.id.substring(0, 16).replace(/(.{4})/g, '$1 ')}</p>
                                </div>
                            </div>

                            {/* Trip Visualizer */}
                            <div className="lg:col-span-2 relative z-10 py-6 lg:py-0">
                                <div className="flex items-start justify-between relative">
                                    {/* Departure */}
                                    <div className="flex flex-col items-center flex-1 max-w-[150px]">
                                        <div className="w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-900 relative z-10 mb-4 group-hover:bg-primary transition-colors"></div>
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">DEPARTURE</p>
                                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight text-center">{trip.from_city}</h4>
                                    </div>

                                    {/* Progress Line */}
                                    <div className="flex-1 px-4 mt-1.5">
                                        <div className="relative h-[2px] bg-white/5 w-full">
                                            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent opacity-30"></div>
                                            <motion.div
                                                animate={{ x: ['0%', '100%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                                className="absolute -top-4 left-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Navigation className="w-4 h-4 rotate-90" />
                                            </motion.div>
                                        </div>
                                        <div className="flex justify-center mt-6">
                                            <div className="bg-slate-900/40 px-6 py-2 rounded-xl border border-white/5 text-[10px] font-black text-primary italic uppercase tracking-widest">
                                                En Transit
                                            </div>
                                        </div>
                                    </div>

                                    {/* Destination */}
                                    <div className="flex flex-col items-center flex-1 max-w-[150px]">
                                        <div className="w-3 h-3 rounded-full bg-slate-700 border-2 border-slate-900 relative z-10 mb-4 group-hover:bg-primary transition-colors">
                                            <div className="absolute inset-0 bg-primary/40 rounded-full animate-ping"></div>
                                        </div>
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">ARRIVAL</p>
                                        <h4 className="text-xl font-black text-white italic uppercase tracking-tight text-center">{trip.to_city}</h4>
                                    </div>
                                </div>
                            </div>

                            {/* Info and Actions */}
                            <div className="lg:col-span-1 flex items-center justify-end gap-8 relative z-10 border-t lg:border-t-0 border-white/5 pt-8 lg:pt-0">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-2">DÉTAILS VOYAGE</p>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-end gap-3 text-white font-black text-xs italic tracking-tight underline decoration-primary/30 underline-offset-4">
                                            {trip.driver_name || 'Pilot Lambda'}
                                            <User className="w-3 h-3 text-primary" />
                                        </div>
                                        <div className="flex items-center justify-end gap-3 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                                            {trip.available_seats} SEATS OPEN
                                            <MapPin className="w-3 h-3 opacity-30" />
                                        </div>
                                    </div>
                                </div>

                                <button className="w-14 h-14 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center transition-all group/btn">
                                    <MoreVertical className="w-5 h-5 text-slate-500 group-hover/btn:text-white" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TripsMonitoring
