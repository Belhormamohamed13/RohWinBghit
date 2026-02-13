import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tripsApi, wilayasApi } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    MapPin,
    Calendar,
    Users,
    ChevronDown,
    Star,
    Clock,
    Car,
    CheckCircle,
    Zap,
    Navigation,
    ArrowRight,
    LucideIcon
} from 'lucide-react';

const Results = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('earliest');

    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const date = searchParams.get('date');
    const seats = searchParams.get('seats');

    const [searchFilters, setSearchFilters] = useState({
        fromWilayaId: from || '',
        toWilayaId: to || '',
        date: date || '',
        seats: seats ? parseInt(seats) : 1
    });

    // Update form when URL params change (e.g. navigation)
    useEffect(() => {
        setSearchFilters({
            fromWilayaId: from || '',
            toWilayaId: to || '',
            date: date || '',
            seats: seats ? parseInt(seats) : 1
        });
    }, [from, to, date, seats]);

    const { data: results, isLoading } = useQuery({
        queryKey: ['trips-results', from, to, date, seats],
        queryFn: async () => {
            const response = await tripsApi.search({
                fromWilayaId: from ? parseInt(from) : undefined,
                toWilayaId: to ? parseInt(to) : undefined,
                date: date || undefined,
                seats: seats ? parseInt(seats) : undefined
            });
            return response.data.data;
        }
    });

    const { data: wilayas } = useQuery({
        queryKey: ['wilayas'],
        queryFn: async () => {
            const response = await wilayasApi.getAll();
            return response.data.data;
        }
    });

    const getWilayaName = (code: string | number | null) => {
        if (!code) return '---';
        return wilayas?.find((w: any) => w.code === parseInt(code.toString()))?.name || code;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#08110b] pb-20 selection:bg-primary/30">
            {/* Quick Search Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-20 z-40 transition-all shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const params = new URLSearchParams();
                            if (searchFilters.fromWilayaId) params.append('from', searchFilters.fromWilayaId);
                            if (searchFilters.toWilayaId) params.append('to', searchFilters.toWilayaId);
                            if (searchFilters.date) params.append('date', searchFilters.date);
                            if (searchFilters.seats) params.append('seats', searchFilters.seats.toString());
                            navigate(`/trips/results?${params.toString()}`);
                        }}
                        className="flex flex-col lg:flex-row items-center gap-4"
                    >
                        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Departure */}
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                                <div className="absolute top-2 left-10 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">Départ</div>
                                <select
                                    value={searchFilters.fromWilayaId}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, fromWilayaId: e.target.value })}
                                    className="w-full h-14 pl-10 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-primary/20 outline-none pt-4 transition-all appearance-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <option value="">Sélectionner</option>
                                    {wilayas?.map((w: any) => (
                                        <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Destination */}
                            <div className="relative group">
                                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                                <div className="absolute top-2 left-10 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">Destination</div>
                                <select
                                    value={searchFilters.toWilayaId}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, toWilayaId: e.target.value })}
                                    className="w-full h-14 pl-10 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-primary/20 outline-none pt-4 transition-all appearance-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    <option value="">Sélectionner</option>
                                    {wilayas?.map((w: any) => (
                                        <option key={w.code} value={w.code}>{w.code} - {w.name}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>

                            {/* Date */}
                            <div className="relative group">
                                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                                <div className="absolute top-2 left-10 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">Date</div>
                                <input
                                    type="date"
                                    value={searchFilters.date}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                                    className="w-full h-14 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-primary/20 outline-none pt-4 transition-all hover:bg-slate-100 dark:hover:bg-slate-700"
                                />
                            </div>

                            {/* Seats */}
                            <div className="relative group">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-primary transition-colors pointer-events-none" />
                                <div className="absolute top-2 left-10 text-[8px] font-black text-slate-400 uppercase tracking-widest pointer-events-none">Passagers</div>
                                <select
                                    value={searchFilters.seats}
                                    onChange={(e) => setSearchFilters({ ...searchFilters, seats: parseInt(e.target.value) })}
                                    className="w-full h-14 pl-10 pr-8 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-wider focus:ring-2 focus:ring-primary/20 outline-none pt-4 transition-all appearance-none cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num} Place{num > 1 ? 's' : ''}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full lg:w-auto bg-primary text-slate-900 h-14 px-8 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
                        >
                            <Search className="w-4 h-4" />
                            <span>Rechercher</span>
                        </button>
                    </form>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12 flex flex-col lg:grid lg:grid-cols-[280px,1fr] gap-12">
                {/* Filters Sidebar */}
                <aside className="hidden lg:block space-y-10">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase mb-8">Filtres</h3>
                        <div className="space-y-10">
                            {/* Price Range */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-primary" /> Prix Max (DZD)
                                </p>
                                <input type="range" className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary" />
                                <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase">
                                    <span>200 DZD</span>
                                    <span>5000 DZD</span>
                                </div>
                            </div>

                            {/* Departure Time */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                    <Clock className="w-3 h-3 text-primary" /> Heure de départ
                                </p>
                                <div className="flex flex-col gap-2">
                                    {['Matin', 'Après-midi', 'Soir'].map((time) => (
                                        <label key={time} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-slate-900/50 rounded-2xl cursor-pointer group transition-all">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-800 text-primary focus:ring-primary/20 bg-white dark:bg-slate-900" />
                                            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-primary transition-colors">{time}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                                    <Zap className="w-3 h-3 text-primary" /> Équipements
                                </p>
                                <div className="flex flex-col gap-2">
                                    {['Climatisation', 'Non-fumeur', 'Musique', 'Animaux autorisés'].map((item) => (
                                        <label key={item} className="flex items-center gap-3 p-3 hover:bg-white dark:hover:bg-slate-900/50 rounded-2xl cursor-pointer group transition-all">
                                            <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 dark:border-slate-800 text-primary focus:ring-primary/20 bg-white dark:bg-slate-900" />
                                            <span className="text-[11px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-primary transition-colors">{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="text-[10px] font-black text-primary uppercase tracking-widest italic pl-3 hover:underline">Réinitialiser les filtres</button>
                </aside>

                {/* Listing Section */}
                <section className="space-y-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                                {isLoading ? 'Recherche...' : `${results?.length || 0} trajets disponibles`}
                            </h1>
                            <p className="text-[11px] text-slate-500 font-black uppercase tracking-widest italic mt-2">
                                {getWilayaName(from || '')} → {getWilayaName(to || '')}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Trier par :</span>
                            <div className="relative group">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest text-primary outline-none focus:ring-4 focus:ring-primary/5 cursor-pointer pr-12"
                                >
                                    <option value="earliest">DÉPART PLUS TÔT</option>
                                    <option value="cheapest">MOINS CHER</option>
                                    <option value="rating">MEILLEUR NOTE</option>
                                </select>
                                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-40 flex flex-col items-center gap-8">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Indexation des liaisons satellite...</p>
                        </div>
                    ) : (results === undefined || results.length === 0) ? (
                        <div className="py-40 bg-white dark:bg-slate-900/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 text-center space-y-8">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex items-center justify-center mx-auto">
                                <Search className="w-10 h-10 text-slate-300" />
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase">Signal Radio Silencieux</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] max-w-sm mx-auto">Aucun trajet ne correspond à vos critères pour le moment. Essayez d'ajuster vos filtres.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            <AnimatePresence mode="popLayout">
                                {results?.map((trip: any) => (
                                    <motion.div
                                        key={trip.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="bg-white dark:bg-slate-900/40 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 shadow-soft hover:shadow-elevated hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 cursor-pointer group flex flex-col lg:grid lg:grid-cols-[1.2fr,2fr,1fr] gap-10 lg:gap-14"
                                        onClick={() => navigate(`/trips/${trip.id}`)}
                                    >
                                        {/* Driver Profile */}
                                        <div className="flex lg:flex-col lg:items-center justify-center gap-8 text-center border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 pb-8 lg:pb-0 lg:pr-10">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-900 group-hover:scale-105 transition-transform"
                                                    style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=${trip.driver_name || 'Driver'}&background=2bee6c&color=102216&bold=true)` }}
                                                ></div>
                                                <div className="absolute -bottom-1 -right-1 bg-primary text-slate-900 w-8 h-8 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                            </div>
                                            <div className="text-left lg:text-center flex-1">
                                                <h4 className="text-xl font-black text-slate-900 dark:text-white italic uppercase tracking-tight leading-none group-hover:text-primary transition-colors">{trip.driver_name || 'Pilot Lambda'}</h4>
                                                <div className="flex items-center lg:justify-center gap-2 mt-3 text-orange-500">
                                                    <Star className="w-4 h-4 fill-current shrink-0" />
                                                    <span className="text-[11px] font-black tracking-widest">{trip.driver_rating || '4.8'}</span>
                                                    <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic flex items-center gap-1">
                                                        <Zap className="w-3 h-3 text-slate-200" /> ({trip.trips_count || 120} avis)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Journey Overview */}
                                        <div className="py-6 lg:py-4 space-y-12">
                                            <div className="grid grid-cols-2 gap-2 relative">
                                                <div className="flex flex-col items-start gap-4 flex-1">
                                                    <div className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                                                        {new Date(trip.departure_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1 italic">
                                                        <span className="text-slate-900 dark:text-white">{trip.from_city || getWilayaName(trip.from_wilaya_id)}</span>
                                                        <span className="text-[8px] opacity-70">Centre Ville</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end gap-4 flex-1 text-right">
                                                    <div className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter">
                                                        {new Date(new Date(trip.departure_time).getTime() + 4 * 60 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex flex-col gap-1 italic">
                                                        <span className="text-slate-900 dark:text-white">{trip.to_city || getWilayaName(trip.to_wilaya_id)}</span>
                                                        <span className="text-[8px] opacity-70">Terminal Bus</span>
                                                    </div>
                                                </div>

                                                {/* Visual Line */}
                                                <div className="absolute top-[1.1rem] left-1/4 right-1/4 h-0.5 bg-slate-100 dark:bg-slate-800">
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800 text-[8px] font-black text-slate-400 italic flex items-center gap-1.5 uppercase transition-all group-hover:text-primary">
                                                        <Car className="w-2.5 h-2.5" /> 4h 00m
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Amenities Tags */}
                                            <div className="flex flex-wrap gap-6 pt-4 border-t border-slate-50 dark:border-slate-800/50 opacity-40 group-hover:opacity-100 transition-opacity">
                                                <AmenityIcon icon={Zap} label="A/C" />
                                                <AmenityIcon icon={CheckCircle} label="Fumeur" />
                                                <AmenityIcon icon={Users} label="Musique" />
                                                <div className="flex-1"></div>
                                                <span className="text-[9px] font-black text-slate-400 italic uppercase tracking-widest border-l border-slate-100 dark:border-slate-800 pl-6 h-4 flex items-center">
                                                    {trip.vehicle_model || 'VW Golf'} • {trip.vehicle_color || 'Noire'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Price and CTA */}
                                        <div className="flex lg:flex-col items-center justify-between lg:justify-center gap-6 lg:pl-10">
                                            <div className="text-right flex lg:flex-col items-baseline lg:items-center gap-2">
                                                <span className="text-4xl font-black text-slate-900 dark:text-white italic tracking-tighter">{trip.price_per_seat}</span>
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">DZD / Place</span>
                                            </div>

                                            <div className={`flex items-center gap-2 mt-2 px-6 py-2 rounded-2xl ${trip.available_seats === 0 ? 'bg-red-500/10 border border-red-500/20' : 'bg-primary/10 border border-primary/20'}`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${trip.available_seats === 0 ? 'bg-red-500' : 'bg-primary animate-pulse'}`}></span>
                                                <span className={`text-[10px] font-black uppercase tracking-widest italic ${trip.available_seats === 0 ? 'text-red-500' : 'text-primary'}`}>
                                                    {trip.available_seats === 0 ? 'COMPLET' : `${trip.available_seats} places libres`}
                                                </span>
                                            </div>

                                            <button
                                                disabled={trip.available_seats === 0}
                                                className={`hidden lg:flex w-full font-black py-4 px-6 rounded-2xl transition-all items-center justify-center gap-3 shadow-xl uppercase tracking-widest text-[10px] mt-4 ${trip.available_seats === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 text-slate-900 shadow-primary/10'}`}
                                            >
                                                {trip.available_seats === 0 ? 'COMPLET' : 'Réserver'}
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}

                    {/* Footer Extra Message */}
                    {!isLoading && results && results.length > 0 && (
                        <div className="mt-16 text-center space-y-6">
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] italic">Vous avez atteint la limite de l'horizon</p>
                            <button className="inline-flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-10 py-5 rounded-[2rem] text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:border-primary/50 transition-all">
                                Activer une alerte de recherche
                                <ArrowRight className="w-4 h-4 text-primary" />
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

const AmenityIcon = ({ icon: Icon, label }: { icon: LucideIcon, label: string }) => (
    <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-slate-400" />
        <span className="text-[9px] font-black text-slate-400/0 group-hover:text-slate-400 uppercase tracking-widest transition-all italic">{label}</span>
    </div>
);

export default Results;
