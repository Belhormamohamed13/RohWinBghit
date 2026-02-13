import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tripsApi, reviewsApi } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import {
    Calendar,
    Clock,
    Car,
    CheckCircle,
    Star,
    ShieldCheck,
    ArrowLeft,
    ArrowRight,
    Plus,
    Minus,
    MessageCircle,
    Info,
    Smartphone,
    Navigation,
    MapPin,
    Fuel,
    Timer,
    Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Simulated Distance Matrix (Approximate defaults for popular routes)
const getRouteStats = (from: string, to: string) => {
    const route = `${from}-${to}`.toLowerCase();
    const stats: Record<string, { distance: string; duration: string }> = {
        'alger-constantine': { distance: '390 km', duration: '4h 30m' },
        'imama-adrar': { distance: '1,200 km', duration: '14h 20m' },
        'tlemcen-oran': { distance: '140 km', duration: '1h 50m' },
        'alger-oran': { distance: '400 km', duration: '4h 45m' },
    };
    return stats[route] || { distance: 'Calculé...', duration: 'Estimé...' };
};

const Details = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [seats, setSeats] = useState(1);

    const { data: trip, isLoading } = useQuery({
        queryKey: ['trip-details', id],
        queryFn: async () => {
            const response = await tripsApi.getById(id as string);
            return response.data.data;
        }
    });

    const { data: reviews } = useQuery({
        queryKey: ['reviews', trip?.driver_id],
        enabled: !!trip?.driver_id,
        queryFn: async () => {
            const response = await reviewsApi.getByUser(trip.driver_id);
            return response.data.data;
        }
    });

    const routeStats = trip ? getRouteStats(trip.from_city, trip.to_city) : { distance: '--', duration: '--' };

    const handleBooking = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/trips/${id}` } });
            return;
        }
        navigate(`/passenger/booking/checkout?tripId=${id}&seats=${seats}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[#08110b]">
                <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
                    <Zap className="absolute inset-0 m-auto text-primary animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.5em] animate-pulse">SYNCHRONISATION DES COORDONNÉES...</p>
                    <p className="text-xs text-primary/40 mt-2 font-medium italic">Préparation de votre itinéraire RohWin</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#08110b]">
                <div className="w-32 h-32 bg-red-500/10 rounded-full flex items-center justify-center mb-8 border border-red-500/20">
                    <MapPin className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-4xl font-black text-white mb-4 uppercase italic tracking-tighter">Trajet Introuvable</h1>
                <p className="text-slate-500 mb-8 font-medium italic">Ce voyage a peut-être été annulé ou déplacé.</p>
                <button onClick={() => navigate(-1)} className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-slate-900 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center gap-3">
                    <ArrowLeft className="w-4 h-4" /> Retour aux résultats
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#08110b] pb-32 selection:bg-primary selection:text-slate-900">
            {/* Header / Navigation Overlay */}
            <div className="px-6 py-8 max-w-7xl mx-auto flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                    <div className="w-10 h-10 border border-slate-800 rounded-2xl flex items-center justify-center group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Retour
                </button>
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link to="/passenger/" className="hover:text-primary transition-colors italic">Accueil</Link>
                    <span className="opacity-30">/</span>
                    <Link to="/passenger/trips/results" className="hover:text-primary transition-colors italic">Recherche</Link>
                    <span className="opacity-30">/</span>
                    <span className="text-white italic">{trip.from_city} → {trip.to_city}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr,400px] gap-12">
                    {/* Left Section: Core Info & Visualization */}
                    <div className="space-y-12">
                        {/* Title Card */}
                        <div className="relative overflow-hidden bg-slate-900/40 rounded-[3rem] p-12 border border-slate-800 shadow-2xl">
                            <div className="absolute top-0 right-0 p-32 bg-primary/10 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-6 animate-pulse">EN LIGNE & DISPONIBLE</span>
                                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
                                    {trip.from_city} <span className="text-primary not-italic">➤</span> {trip.to_city}
                                </h2>
                                <div className="flex flex-wrap gap-8 mt-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-primary/50 transition-all">
                                            <Calendar className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Date du départ</p>
                                            <p className="text-sm font-black text-white tracking-tight uppercase italic">{format(new Date(trip.departure_time), 'EEEE d MMMM', { locale: fr })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group hover:border-primary/50 transition-all">
                                            <Clock className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Heure prévue</p>
                                            <p className="text-sm font-black text-white tracking-tight uppercase italic">{format(new Date(trip.departure_time), 'HH:mm')} ACCEPTE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Route Intelligence Map Map */}
                        <div className="bg-slate-900/40 rounded-[4rem] overflow-hidden border border-slate-800 shadow-elevated group">
                            <div className="p-10 flex items-center justify-between border-b border-slate-800/50">
                                <div>
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
                                        <Navigation className="text-primary w-6 h-6 animate-bounce" />
                                        Intelligence Itinéraire
                                    </h3>
                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 italic">ANALYSE DU TRAJET EN TEMPS RÉEL</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-slate-800/80 px-5 py-3 rounded-2xl text-center border border-white/5 min-w-[100px] hover:border-primary/20 transition-all">
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1 leading-none">DISTANCE</p>
                                        <p className="text-sm font-black text-white italic leading-none">{routeStats.distance}</p>
                                    </div>
                                    <div className="bg-slate-800/80 px-5 py-3 rounded-2xl text-center border border-white/5 min-w-[100px] hover:border-primary/20 transition-all">
                                        <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-1 leading-none">TEMPS ESTIMÉ</p>
                                        <p className="text-sm font-black text-white italic leading-none">{routeStats.duration}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[450px] bg-slate-950/80 flex items-center justify-center overflow-hidden">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #13ec6d 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                                {/* Simulated Route Visualization */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-4/5 h-2/3 flex flex-col items-center justify-between">
                                        {/* Start Point */}
                                        <div className="absolute left-0 top-0 text-center -translate-x-1/2 -translate-y-1/2 group">
                                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center animate-pulse border border-primary relative z-20 shadow-[0_0_30px_rgba(19,236,109,0.3)]">
                                                <div className="w-6 h-6 bg-primary rounded-full border-4 border-slate-900 group-hover:scale-125 transition-transform duration-500"></div>
                                            </div>
                                            <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl relative z-30 group-hover:border-primary/30 transition-all">
                                                <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1 italic">DÉPART</p>
                                                <p className="text-xs font-black text-white tracking-tight uppercase italic whitespace-nowrap">{trip.from_city}</p>
                                            </div>
                                        </div>

                                        {/* End Point */}
                                        <div className="absolute right-0 bottom-0 text-center translate-x-1/2 translate-y-1/2 group">
                                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 relative z-20 group-hover:bg-primary/5 transition-all">
                                                <div className="w-6 h-6 bg-white rounded-full border-4 border-slate-900 group-hover:bg-primary group-hover:scale-125 transition-all duration-500"></div>
                                            </div>
                                            <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl relative z-30 group-hover:border-primary/30 transition-all">
                                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">ARRIVÉE</p>
                                                <p className="text-xs font-black text-white tracking-tight uppercase italic whitespace-nowrap">{trip.to_city}</p>
                                            </div>
                                        </div>

                                        {/* Path SVG */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#13ec6d" stopOpacity="0.8" />
                                                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                                                </linearGradient>
                                            </defs>
                                            <path
                                                d="M 10,20 C 30,20 20,80 90,80"
                                                fill="none"
                                                stroke="url(#routeGradient)"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                                className="animate-[dash_20s_linear_infinite]"
                                            />
                                            <path
                                                d="M 10,20 C 30,20 20,80 90,80"
                                                fill="none"
                                                stroke="url(#routeGradient)"
                                                strokeWidth="0.5"
                                                strokeLinecap="round"
                                                strokeOpacity="0.3"
                                            />
                                            {/* Moving Dot */}
                                            <circle r="1" fill="#13ec6d">
                                                <animateMotion dur="6s" repeatCount="indefinite" path="M 10,20 C 30,20 20,80 90,80" />
                                            </circle>
                                        </svg>

                                        {/* Environment Icons */}
                                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 opacity-20 hover:opacity-100 transition-opacity">
                                            <div className="bg-slate-900 p-4 border border-white/5 rounded-3xl flex items-center gap-4">
                                                <Fuel className="text-primary w-5 h-5" />
                                                <div className="text-left">
                                                    <p className="text-[8px] text-slate-500 font-black tracking-widest leading-none">CONSOMMATION</p>
                                                    <p className="text-xs font-black text-white tracking-tighter mt-1 italic">~ 7.2L / 100km</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Overlay Controls */}
                                <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                                    <button className="w-12 h-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-2xl">
                                        <Plus className="text-slate-400 w-5 h-5" />
                                    </button>
                                    <button className="w-12 h-12 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all shadow-2xl">
                                        <Minus className="text-slate-400 w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Steps Card */}
                        <div className="bg-slate-900/40 rounded-[3rem] p-12 border border-slate-800 shadow-soft relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">Étapes du Logistique</h3>
                                <div className="flex gap-2">
                                    <Timer className="text-primary w-4 h-4" />
                                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">{routeStats.duration} total</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-16">
                                <div className="space-y-12">
                                    <div className="relative pl-10">
                                        <div className="absolute left-[13px] top-6 bottom-[-48px] w-[2px] bg-slate-800 border-dashed border-l-2"></div>
                                        <div className="absolute left-0 top-0 w-7 h-7 bg-primary/20 rounded-xl border border-primary flex items-center justify-center shadow-[0_0_15px_rgba(19,236,109,0.2)]">
                                            <div className="w-2.5 h-2.5 bg-primary rounded-sm"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-primary font-black uppercase tracking-[0.2em] italic">DÉPART CONFIRMÉ</p>
                                            <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none italic">{trip.from_city}</h4>
                                            <p className="text-xs text-slate-500 font-medium italic leading-relaxed">Rassemblement au point central. Vérification des bagages et test de connectivité.</p>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-0 w-7 h-7 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                                            <Navigation className="text-slate-400 w-3.5 h-3.5" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] italic">ESCALE TECHNIQUE</p>
                                            <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none italic">Autoroute Est-Ouest</h4>
                                            <p className="text-xs text-slate-500 font-medium italic leading-relaxed">Pause café de 15 minutes prévue après 2 heures de conduite.</p>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-0 w-7 h-7 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center">
                                            <MapPin className="text-slate-400 w-3.5 h-3.5" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] italic">ARRIVÉE ESTIMÉE</p>
                                            <h4 className="text-xl font-black text-white tracking-tight uppercase leading-none italic">{trip.to_city}</h4>
                                            <p className="text-xs text-slate-500 font-medium italic leading-relaxed">Dépose à la gare centrale. Fin du trajet RohWin.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between group-hover:border-primary/20 transition-all duration-500">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center"><Info className="text-primary w-5 h-5" /></div>
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Consignes Conducteur</p>
                                        </div>
                                        <p className="text-sm text-slate-500 italic font-medium leading-[1.8] px-2">
                                            "Je privilégie les arrêts aux stations Naftal pour plus de confort. Le véhicule est équipé de climatisation individuelle et de prises USB à l'arrière."
                                        </p>
                                    </div>
                                    <div className="pt-8 flex flex-wrap gap-3">
                                        {['A/C', 'USB', 'WIFI'].map(tag => (
                                            <span key={tag} className="text-[8px] font-black italic uppercase tracking-widest text-[#13ec6d] bg-[#13ec6d]/10 px-4 py-1.5 rounded-lg border border-[#13ec6d]/20">
                                                • {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Driver Section */}
                        <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/5 shadow-2xl overflow-hidden relative group">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                                <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-primary blur-[40px] opacity-20 animate-pulse"></div>
                                    <img
                                        src={trip.avatar_url || `https://ui-avatars.com/api/?name=${trip.driver_name || 'Driver'}&background=13ec6d&color=102216&bold=true`}
                                        className="w-40 h-40 rounded-[3rem] object-cover ring-8 ring-white/5 relative z-10 border-2 border-primary/20 transition-transform group-hover:scale-105"
                                        alt="Pilot"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-slate-950 px-4 py-2 rounded-2xl font-black text-[9px] uppercase tracking-widest border-4 border-slate-900 shadow-xl z-20">VÉRIFIÉ ✓</div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                                        <div>
                                            <h4 className="text-3xl font-black text-white italic tracking-tighter uppercase leading-none mb-4">{trip.driver_name || 'Pilot Anonyme'}</h4>
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-white/5">
                                                    <Star className="w-4 h-4 fill-primary text-primary" />
                                                    <span className="text-base font-black text-white italic tracking-tighter">{trip.driver_rating || '4.9'}</span>
                                                </div>
                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-l border-white/10 pl-4 italic">{reviews?.length || 122} Missions Réussies</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/passenger/messages/${trip.driver_id}`)}
                                            className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95 mx-auto md:mx-0 shadow-lg"
                                        >
                                            <MessageCircle className="w-4 h-4 text-primary" />
                                            Contacter le conducteur
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10 mt-12 bg-black/20 p-8 rounded-[3rem] border border-white/5">
                                        <div className="space-y-4">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] italic mb-4">VÉHICULE DE SERVICE</p>
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner group-hover:rotate-6 transition-transform">
                                                    <Car className="text-primary w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-white italic tracking-tighter leading-none">{trip.vehicle_name || 'Berline Premium'}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 italic">Classé Sécurité A+ • Clim</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] italic mb-4">CERTIFICATIONS</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['DOCS_OK', 'CAR_VERIFIED', 'PRO_PILOT'].map(badge => (
                                                    <span key={badge} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500 text-[8px] font-black uppercase tracking-[0.1em] border border-green-500/20">{badge}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Grid */}
                        <div className="space-y-10">
                            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase ml-6 leading-none">Intelligence Sociale <span className="text-slate-600">/ Avis</span></h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                {(reviews && reviews.length > 0) ? reviews.map((review: any) => (
                                    <div key={review.id} className="p-10 rounded-[3.5rem] border border-white/5 bg-slate-900/40 relative overflow-hidden group hover:border-primary/20 transition-all duration-500">
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-to-br from-primary/30 to-slate-800 flex items-center justify-center border border-primary/20 shadow-xl overflow-hidden ring-4 ring-slate-900">
                                                    <span className="text-lg font-black text-white italic">{review.reviewer_name?.[0] || 'P'}</span>
                                                </div>
                                                <div>
                                                    <span className="font-black text-white uppercase tracking-tight italic block leading-none">{review.reviewer_name || 'Alpha Passanger'}</span>
                                                    <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest mt-2 block leading-none italic">{format(new Date(review.created_at), 'MMMM yyyy', { locale: fr })}</span>
                                                </div>
                                            </div>
                                            <div className="flex bg-slate-950/80 px-3 py-1.5 rounded-xl border border-white/5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-slate-700'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-400 italic font-medium leading-relaxed relative z-10 p-2 border-l border-primary/10">"{review.comment}"</p>
                                        <div className="absolute top-0 right-0 p-32 bg-primary/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 p-16 text-center bg-slate-900/40 rounded-[4rem] border border-dashed border-slate-800">
                                        <MessageCircle className="w-12 h-12 text-slate-800 mx-auto mb-6 animate-pulse" />
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic mb-2">SCANNING MISSION HISTORY...</p>
                                        <p className="text-xs text-slate-600 font-medium italic">Aucun avis trouvé dans cette session.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Premium Checkout Widget */}
                    <aside className="relative">
                        <div className="sticky top-32 space-y-8">
                            {/* Booking Card */}
                            <div className="bg-slate-900/60 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-40 bg-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 group-hover:scale-125"></div>

                                <div className="relative z-10">
                                    <div className="flex items-baseline justify-between mb-12">
                                        <div>
                                            <span className="text-6xl font-black text-primary italic tracking-tighter shadow-sm">{trip.price_per_seat}</span>
                                            <span className="text-xl font-black ml-3 text-white italic opacity-80 underline decoration-primary/40 decoration-4 underline-offset-8">DZD</span>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">PER MISSION</span>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Seat Selector */}
                                        <div className="bg-slate-950/80 p-6 rounded-[2.5rem] border border-white/5 space-y-6 group-hover:border-primary/20 transition-all">
                                            <div className="flex justify-between items-center px-4">
                                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] italic">MISSION SEATS</span>
                                                <span className="text-xs font-black text-primary italic uppercase tracking-widest">{trip.available_seats} MAX</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-black/20 rounded-3xl p-3 border border-white/5">
                                                <button
                                                    onClick={() => setSeats(Math.max(1, seats - 1))}
                                                    className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center hover:bg-slate-800 hover:text-primary transition-all active:scale-90 shadow-xl"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-4xl font-black text-white italic tracking-tighter">{seats}</span>
                                                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest mt-1">SIÈGES</span>
                                                </div>
                                                <button
                                                    onClick={() => setSeats(Math.min(trip.available_seats, seats + 1))}
                                                    className="w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center hover:bg-slate-800 hover:text-primary transition-all active:scale-90 shadow-xl"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Display */}
                                        <div className="flex items-center justify-between px-8 py-4 bg-primary/5 rounded-2xl border border-primary/20">
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">PRIX TOTAL MISSIONS</span>
                                            <span className="text-2xl font-black text-white italic tracking-tight leading-none">{(seats * trip.price_per_seat).toLocaleString()} <span className="text-xs">DZD</span></span>
                                        </div>

                                        <button
                                            disabled={trip.available_seats === 0}
                                            onClick={handleBooking}
                                            className={`w-full font-black py-8 rounded-[2.5rem] shadow-[0_25px_60px_rgba(19,236,109,0.2)] transition-all active:scale-[0.96] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px] h-20 ${trip.available_seats === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-white/5' : 'bg-primary hover:bg-[#10cc00] text-slate-950 group-hover:translate-y-[-4px] group-hover:shadow-[0_40px_80px_rgba(19,236,109,0.3)]'}`}
                                        >
                                            {trip.available_seats === 0 ? 'STATUS : COMPLET' : 'INITIER LA RÉSERVATION'}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>

                                        {/* Security Notice */}
                                        <div className="p-8 bg-black/20 rounded-[2.5rem] border border-dashed border-white/5 flex gap-5 items-start">
                                            <ShieldCheck className="w-7 h-7 text-primary shrink-0 opacity-60" />
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest italic mb-2 leading-tight">Protocole Cash Flow</p>
                                                <p className="text-[9px] text-slate-500 font-bold leading-relaxed uppercase tracking-widest italic">Aucun prélèvement numérique. Transaction physique effectuée à l'embarquement.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Checklist */}
                            <div className="bg-slate-900/40 p-12 rounded-[4rem] border border-white/5 shadow-2xl space-y-8 group/features">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-white uppercase tracking-widest italic">Assurance Voyage</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1 animate-pulse">PROTECTION ROHWIN ACTIVÉE</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                                        <Smartphone className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-black text-white uppercase tracking-widest italic">Support Prioritaire</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight mt-1 italic">ASSISTANCE 24/7 EN DIRECT</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dash {
                    to {
                        stroke-dashoffset: -1000;
                    }
                }
                .animate-dash {
                    animation: dash 20s linear infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            ` }} />
        </div>
    );
};

export default Details;
