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
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 font-body">
                <div className="w-24 h-24 relative">
                    <div className="absolute inset-0 border-4 border-sand-300/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-sand-300 rounded-full animate-spin"></div>
                    <Zap className="absolute inset-0 m-auto text-sand-300 animate-pulse" />
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.5em] animate-pulse">SYNCHRONISATION DES COORDONNÉES...</p>
                    <p className="text-xs text-sand-300/60 mt-2 font-mono italic">Préparation de votre itinéraire RohWin</p>
                </div>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 font-body">
                <div className="w-32 h-32 bg-accent-red/10 rounded-full flex items-center justify-center mb-8 border border-accent-red/20 shadow-glow">
                    <MapPin className="w-12 h-12 text-accent-red" />
                </div>
                <h1 className="text-4xl font-display text-text-primary mb-4 uppercase italic tracking-wide">Trajet Introuvable</h1>
                <p className="text-text-muted mb-8 font-medium">Ce voyage a peut-être été annulé ou déplacé.</p>
                <button onClick={() => navigate(-1)} className="bg-sand-300/10 text-sand-300 border border-sand-300/20 hover:bg-sand-300 hover:text-night-900 px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center gap-3">
                    <ArrowLeft className="w-4 h-4" /> Retour aux résultats
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 selection:bg-sand-300 selection:text-night-900 font-body text-text-primary">
            {/* Header / Navigation Overlay */}
            <div className="px-6 py-8 max-w-7xl mx-auto flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary transition-colors">
                    <div className="w-10 h-10 border border-border rounded-xl flex items-center justify-center group-hover:border-sand-300/40 group-hover:bg-sand-300/5 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    Retour
                </button>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-text-muted font-mono">
                    <Link to="/passenger/" className="hover:text-sand-300 transition-colors">Accueil</Link>
                    <span className="opacity-30">/</span>
                    <Link to="/passenger/trips/results" className="hover:text-sand-300 transition-colors">Recherche</Link>
                    <span className="opacity-30">/</span>
                    <span className="text-text-primary">{trip.from_city} → {trip.to_city}</span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:grid lg:grid-cols-[1fr,400px] gap-12">
                    {/* Left Section: Core Info & Visualization */}
                    <div className="space-y-12">
                        {/* Title Card */}
                        <div className="relative overflow-hidden bg-night-800/60 rounded-[2.5rem] p-12 border border-border shadow-card backdrop-blur-md">
                            <div className="absolute top-0 right-0 p-32 bg-sand-300/5 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-teal/10 text-accent-teal border border-accent-teal/20 text-[9px] font-bold uppercase tracking-[0.2em] mb-6 animate-pulse">EN LIGNE & DISPONIBLE</span>
                                <h2 className="text-5xl md:text-6xl font-display text-text-primary tracking-wide uppercase leading-none">
                                    {trip.from_city} <span className="text-sand-300">➤</span> {trip.to_city}
                                </h2>
                                <div className="flex flex-wrap gap-8 mt-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-night-900 border border-border flex items-center justify-center group hover:border-sand-300/50 transition-all">
                                            <Calendar className="w-5 h-5 text-sand-300 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1 font-mono">Date du départ</p>
                                            <p className="text-sm font-bold text-text-primary tracking-tight uppercase">{format(new Date(trip.departure_time), 'EEEE d MMMM', { locale: fr })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-night-900 border border-border flex items-center justify-center group hover:border-sand-300/50 transition-all">
                                            <Clock className="w-5 h-5 text-sand-300 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-text-dim font-bold uppercase tracking-widest mb-1 font-mono">Heure prévue</p>
                                            <p className="text-sm font-bold text-text-primary tracking-tight uppercase">{format(new Date(trip.departure_time), 'HH:mm')} ACCEPTE</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Route Intelligence Map Map */}
                        <div className="bg-night-800/60 rounded-[3rem] overflow-hidden border border-border shadow-soft group">
                            <div className="p-10 flex items-center justify-between border-b border-border/50">
                                <div>
                                    <h3 className="text-xl font-display text-text-primary tracking-wide uppercase flex items-center gap-3">
                                        <Navigation className="text-sand-300 w-6 h-6 animate-bounce" />
                                        Intelligence Itinéraire
                                    </h3>
                                    <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.3em] mt-1 font-mono">ANALYSE DU TRAJET EN TEMPS RÉEL</p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-night-900/80 px-5 py-3 rounded-xl text-center border border-border min-w-[100px] hover:border-sand-300/30 transition-all">
                                        <p className="text-[8px] text-text-dim font-bold uppercase tracking-widest mb-1 leading-none font-mono">DISTANCE</p>
                                        <p className="text-sm font-bold text-text-primary italic leading-none">{routeStats.distance}</p>
                                    </div>
                                    <div className="bg-night-900/80 px-5 py-3 rounded-xl text-center border border-border min-w-[100px] hover:border-sand-300/30 transition-all">
                                        <p className="text-[8px] text-text-dim font-bold uppercase tracking-widest mb-1 leading-none font-mono">TEMPS ESTIMÉ</p>
                                        <p className="text-sm font-bold text-text-primary italic leading-none">{routeStats.duration}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative h-[450px] bg-night-950 flex items-center justify-center overflow-hidden">
                                {/* Grid Pattern */}
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #d4a855 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                                {/* Simulated Route Visualization */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="relative w-4/5 h-2/3 flex flex-col items-center justify-between">
                                        {/* Start Point */}
                                        <div className="absolute left-0 top-0 text-center -translate-x-1/2 -translate-y-1/2 group">
                                            <div className="w-16 h-16 bg-sand-300/10 rounded-full flex items-center justify-center animate-pulse border border-sand-300 relative z-20 shadow-glow">
                                                <div className="w-6 h-6 bg-sand-300 rounded-full border-4 border-night-900 group-hover:scale-125 transition-transform duration-500"></div>
                                            </div>
                                            <div className="mt-4 p-3 bg-night-800 border border-border rounded-xl shadow-card relative z-30 group-hover:border-sand-300/30 transition-all">
                                                <p className="text-[8px] font-bold text-sand-300 uppercase tracking-widest mb-1 font-mono">DÉPART</p>
                                                <p className="text-xs font-bold text-text-primary tracking-tight uppercase whitespace-nowrap">{trip.from_city}</p>
                                            </div>
                                        </div>

                                        {/* End Point */}
                                        <div className="absolute right-0 bottom-0 text-center translate-x-1/2 translate-y-1/2 group">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center border border-white/10 relative z-20 group-hover:bg-sand-300/5 transition-all">
                                                <div className="w-6 h-6 bg-text-primary rounded-full border-4 border-night-900 group-hover:bg-sand-300 group-hover:scale-125 transition-all duration-500"></div>
                                            </div>
                                            <div className="mt-4 p-3 bg-night-800 border border-border rounded-xl shadow-card relative z-30 group-hover:border-sand-300/30 transition-all">
                                                <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest mb-1 font-mono">ARRIVÉE</p>
                                                <p className="text-xs font-bold text-text-primary tracking-tight uppercase whitespace-nowrap">{trip.to_city}</p>
                                            </div>
                                        </div>

                                        {/* Path SVG */}
                                        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                                            <defs>
                                                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                    <stop offset="0%" stopColor="#d4a855" stopOpacity="0.8" />
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
                                            <circle r="1" fill="#d4a855">
                                                <animateMotion dur="6s" repeatCount="indefinite" path="M 10,20 C 30,20 20,80 90,80" />
                                            </circle>
                                        </svg>

                                        {/* Environment Icons */}
                                        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 opacity-60 hover:opacity-100 transition-opacity">
                                            <div className="bg-night-900 p-4 border border-border rounded-2xl flex items-center gap-4">
                                                <Fuel className="text-sand-300 w-5 h-5" />
                                                <div className="text-left">
                                                    <p className="text-[8px] text-text-dim font-bold tracking-widest leading-none font-mono">CONSOMMATION</p>
                                                    <p className="text-xs font-bold text-text-primary tracking-tighter mt-1 italic">~ 7.2L / 100km</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Map Overlay Controls */}
                                <div className="absolute bottom-8 right-8 flex flex-col gap-3">
                                    <button className="w-12 h-12 bg-night-900 border border-border rounded-xl flex items-center justify-center hover:bg-night-800 transition-all shadow-card">
                                        <Plus className="text-text-muted w-5 h-5" />
                                    </button>
                                    <button className="w-12 h-12 bg-night-900 border border-border rounded-xl flex items-center justify-center hover:bg-night-800 transition-all shadow-card">
                                        <Minus className="text-text-muted w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Itinerary Steps Card */}
                        <div className="bg-night-800/40 rounded-[2.5rem] p-12 border border-border shadow-soft relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-display text-text-primary tracking-wide uppercase leading-none">Étapes du Logistique</h3>
                                <div className="flex gap-2">
                                    <Timer className="text-sand-300 w-4 h-4" />
                                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest font-mono">{routeStats.duration} total</span>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-16">
                                <div className="space-y-12">
                                    <div className="relative pl-10">
                                        <div className="absolute left-[13px] top-6 bottom-[-48px] w-[2px] bg-night-700 border-dashed border-l-2"></div>
                                        <div className="absolute left-0 top-0 w-7 h-7 bg-sand-300/20 rounded-lg border border-sand-300 flex items-center justify-center shadow-glow">
                                            <div className="w-2.5 h-2.5 bg-sand-300 rounded-sm"></div>
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-sand-300 font-bold uppercase tracking-[0.2em] font-mono">DÉPART CONFIRMÉ</p>
                                            <h4 className="text-xl font-bold text-text-primary tracking-tight uppercase leading-none">{trip.from_city}</h4>
                                            <p className="text-xs text-text-muted font-medium leading-relaxed">Rassemblement au point central. Vérification des bagages et test de connectivité.</p>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-0 w-7 h-7 bg-night-900 rounded-lg border border-border flex items-center justify-center">
                                            <Navigation className="text-text-dim w-3.5 h-3.5" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.2em] font-mono">ESCALE TECHNIQUE</p>
                                            <h4 className="text-xl font-bold text-text-primary tracking-tight uppercase leading-none">Autoroute Est-Ouest</h4>
                                            <p className="text-xs text-text-muted font-medium leading-relaxed">Pause café de 15 minutes prévue après 2 heures de conduite.</p>
                                        </div>
                                    </div>

                                    <div className="relative pl-10">
                                        <div className="absolute left-0 top-0 w-7 h-7 bg-night-900 rounded-lg border border-border flex items-center justify-center">
                                            <MapPin className="text-text-dim w-3.5 h-3.5" />
                                        </div>
                                        <div className="space-y-3">
                                            <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.2em] font-mono">ARRIVÉE ESTIMÉE</p>
                                            <h4 className="text-xl font-bold text-text-primary tracking-tight uppercase leading-none">{trip.to_city}</h4>
                                            <p className="text-xs text-text-muted font-medium leading-relaxed">Dépose à la gare centrale. Fin du trajet RohWin.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-night-900/50 p-8 rounded-[2rem] border border-border flex flex-col justify-between group-hover:border-sand-300/30 transition-all duration-500">
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-night-800 flex items-center justify-center border border-border"><Info className="text-sand-300 w-5 h-5" /></div>
                                            <p className="text-[10px] font-bold text-text-primary uppercase tracking-widest font-mono">Consignes Conducteur</p>
                                        </div>
                                        <p className="text-sm text-text-muted italic font-medium leading-[1.8] px-2">
                                            "Je privilégie les arrêts aux stations Naftal pour plus de confort. Le véhicule est équipé de climatisation individuelle et de prises USB à l'arrière."
                                        </p>
                                    </div>
                                    <div className="pt-8 flex flex-wrap gap-3">
                                        {['A/C', 'USB', 'WIFI'].map(tag => (
                                            <span key={tag} className="text-[8px] font-bold font-mono uppercase tracking-widest text-accent-teal bg-accent-teal/10 px-4 py-1.5 rounded-lg border border-accent-teal/20">
                                                • {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Driver Section */}
                        <div className="bg-night-800/40 backdrop-blur-3xl p-12 rounded-[3.5rem] border border-border shadow-card overflow-hidden relative group">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
                                <div className="relative shrink-0">
                                    <div className="absolute inset-0 bg-sand-300 blur-[40px] opacity-10 animate-pulse"></div>
                                    <img
                                        src={trip.avatar_url || `https://ui-avatars.com/api/?name=${trip.driver_name || 'Driver'}&background=d4a855&color=0a0b0e&bold=true`}
                                        className="w-40 h-40 rounded-[2.5rem] object-cover ring-8 ring-night-900 relative z-10 border-2 border-sand-300/30 transition-transform group-hover:scale-105"
                                        alt="Pilot"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-sand-300 text-night-900 px-4 py-2 rounded-xl font-bold text-[9px] uppercase tracking-widest border-4 border-night-900 shadow-xl z-20">VÉRIFIÉ ✓</div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                                        <div>
                                            <h4 className="text-3xl font-display text-text-primary tracking-wide uppercase leading-none mb-4">{trip.driver_name || 'Pilot Anonyme'}</h4>
                                            <div className="flex items-center justify-center md:justify-start gap-4">
                                                <div className="flex items-center gap-2 bg-night-900 px-4 py-2 rounded-xl border border-border">
                                                    <Star className="w-4 h-4 fill-sand-300 text-sand-300" />
                                                    <span className="text-base font-bold text-text-primary tracking-tight">{trip.driver_rating || '4.9'}</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest border-l border-border pl-4 font-mono">{reviews?.length || 122} Missions Réussies</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/passenger/messages/${trip.driver_id}`)}
                                            className="bg-night-900 hover:bg-night-700 text-text-primary px-8 py-4 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all border border-border flex items-center justify-center gap-3 active:scale-95 mx-auto md:mx-0 shadow-lg"
                                        >
                                            <MessageCircle className="w-4 h-4 text-sand-300" />
                                            Contacter le conducteur
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10 mt-12 bg-night-900/50 p-8 rounded-[2.5rem] border border-border">
                                        <div className="space-y-4">
                                            <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.2em] font-mono mb-4">VÉHICULE DE SERVICE</p>
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 bg-night-900 rounded-2xl flex items-center justify-center border border-border shadow-inner group-hover:rotate-6 transition-transform">
                                                    <Car className="text-sand-300 w-8 h-8" />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-text-primary tracking-tight leading-none">{trip.vehicle_name || 'Berline Premium'}</p>
                                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-2 font-mono">Classé Sécurité A+ • Clim</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-[9px] text-text-dim font-bold uppercase tracking-[0.2em] font-mono mb-4">CERTIFICATIONS</p>
                                            <div className="flex flex-wrap gap-2">
                                                {['DOCS_OK', 'CAR_VERIFIED', 'PRO_PILOT'].map(badge => (
                                                    <span key={badge} className="px-3 py-1.5 rounded-lg bg-accent-teal/10 text-accent-teal text-[8px] font-bold uppercase tracking-[0.1em] border border-accent-teal/20">{badge}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Review Grid */}
                        <div className="space-y-10">
                            <h3 className="text-3xl font-display text-text-primary tracking-wide uppercase ml-6 leading-none">Intelligence Sociale <span className="text-text-dim font-sans text-xl">/ Avis</span></h3>
                            <div className="grid md:grid-cols-2 gap-8">
                                {(reviews && reviews.length > 0) ? reviews.map((review: any) => (
                                    <div key={review.id} className="p-10 rounded-[3rem] border border-border bg-night-800/40 relative overflow-hidden group hover:border-sand-300/30 transition-all duration-500">
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sand-300/30 to-night-700 flex items-center justify-center border border-sand-300/20 shadow-xl overflow-hidden ring-4 ring-night-900">
                                                    <span className="text-lg font-black text-text-primary">{review.reviewer_name?.[0] || 'P'}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-text-primary uppercase tracking-tight block leading-none">{review.reviewer_name || 'Alpha Passanger'}</span>
                                                    <span className="text-[8px] text-text-dim font-bold uppercase tracking-widest mt-2 block leading-none font-mono">{format(new Date(review.created_at), 'MMMM yyyy', { locale: fr })}</span>
                                                </div>
                                            </div>
                                            <div className="flex bg-night-950/80 px-3 py-1.5 rounded-lg border border-border">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-2.5 h-2.5 ${i < review.rating ? 'fill-sand-300 text-sand-300' : 'text-night-600'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-text-muted italic font-medium leading-relaxed relative z-10 p-2 border-l border-sand-300/20">"{review.comment}"</p>
                                        <div className="absolute top-0 right-0 p-32 bg-sand-300/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                )) : (
                                    <div className="col-span-2 p-16 text-center bg-night-800/40 rounded-[3.5rem] border border-dashed border-border">
                                        <MessageCircle className="w-12 h-12 text-night-600 mx-auto mb-6 animate-pulse" />
                                        <p className="text-[10px] font-bold text-text-dim uppercase tracking-[0.4em] mb-2 font-mono">SCANNING MISSION HISTORY...</p>
                                        <p className="text-xs text-text-muted font-medium italic">Aucun avis trouvé dans cette session.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section: Premium Checkout Widget */}
                    <aside className="relative">
                        <div className="sticky top-32 space-y-8">
                            {/* Booking Card */}
                            <div className="bg-night-800/60 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-border shadow-elevated relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-40 bg-sand-300/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 group-hover:scale-125"></div>

                                <div className="relative z-10">
                                    <div className="flex items-baseline justify-between mb-12">
                                        <div>
                                            <span className="text-6xl font-display text-sand-300 tracking-tighter shadow-sm">{trip.price_per_seat}</span>
                                            <span className="text-xl font-black ml-3 text-text-primary opacity-80 underline decoration-sand-300/40 decoration-4 underline-offset-8">DZD</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-text-dim uppercase tracking-[0.3em] font-mono">PER SEAT</span>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Seat Selector */}
                                        <div className="bg-night-900/80 p-6 rounded-[2rem] border border-border space-y-6 group-hover:border-sand-300/20 transition-all">
                                            <div className="flex justify-between items-center px-4">
                                                <span className="text-[9px] font-bold text-text-dim uppercase tracking-[0.4em] font-mono">SEATS</span>
                                                <span className="text-xs font-bold text-sand-300 italic uppercase tracking-widest">{trip.available_seats} MAX</span>
                                            </div>
                                            <div className="flex items-center justify-between bg-black/20 rounded-2xl p-3 border border-border">
                                                <button
                                                    onClick={() => setSeats(Math.max(1, seats - 1))}
                                                    className="w-12 h-12 rounded-xl bg-night-800 border border-border flex items-center justify-center hover:bg-night-700 hover:text-sand-300 transition-all active:scale-90 shadow-lg"
                                                >
                                                    <Minus className="w-5 h-5" />
                                                </button>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-3xl font-bold text-text-primary tracking-tighter">{seats}</span>
                                                    <span className="text-[8px] font-bold text-text-dim uppercase tracking-widest mt-1">SIÈGES</span>
                                                </div>
                                                <button
                                                    onClick={() => setSeats(Math.min(trip.available_seats, seats + 1))}
                                                    className="w-12 h-12 rounded-xl bg-night-800 border border-border flex items-center justify-center hover:bg-night-700 hover:text-sand-300 transition-all active:scale-90 shadow-lg"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Total Display */}
                                        <div className="flex items-center justify-between px-8 py-4 bg-sand-300/5 rounded-xl border border-sand-300/20">
                                            <span className="text-[10px] font-bold text-sand-300 uppercase tracking-widest leading-none font-mono">PRIX TOTAL</span>
                                            <span className="text-2xl font-bold text-text-primary tracking-tight leading-none">{(seats * trip.price_per_seat).toLocaleString()} <span className="text-xs">DZD</span></span>
                                        </div>

                                        <button
                                            disabled={trip.available_seats === 0}
                                            onClick={handleBooking}
                                            className={`w-full font-bold py-8 rounded-[2rem] shadow-glow transition-all active:scale-[0.96] flex items-center justify-center gap-4 uppercase tracking-[0.2em] text-[11px] h-20 ${trip.available_seats === 0 ? 'bg-night-700 text-text-dim cursor-not-allowed border border-border' : 'btn btn-primary hover:shadow-lg hover:-translate-y-1'}`}
                                        >
                                            {trip.available_seats === 0 ? 'STATUS : COMPLET' : 'INITIER LA RÉSERVATION'}
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                        </button>

                                        {/* Security Notice */}
                                        <div className="p-8 bg-black/20 rounded-[2rem] border border-dashed border-border/50 flex gap-5 items-start">
                                            <ShieldCheck className="w-7 h-7 text-sand-300 shrink-0 opacity-60" />
                                            <div>
                                                <p className="text-[10px] font-bold text-text-primary uppercase tracking-widest italic mb-2 leading-tight">Protocole Cash Flow</p>
                                                <p className="text-[9px] text-text-dim font-bold leading-relaxed uppercase tracking-widest font-mono">Aucun prélèvement numérique. Transaction physique effectuée à l'embarquement.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Feature Checklist */}
                            <div className="bg-night-800/40 p-12 rounded-[3.5rem] border border-border shadow-card space-y-8 group/features">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-accent-teal/10 rounded-xl flex items-center justify-center border border-accent-teal/20 group-hover:scale-110 transition-transform">
                                        <CheckCircle className="w-6 h-6 text-accent-teal" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-text-primary uppercase tracking-widest">Assurance Voyage</p>
                                        <p className="text-[9px] text-text-dim font-bold uppercase tracking-tight mt-1 animate-pulse font-mono">PROTECTION ROHWIN ACTIVÉE</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-accent-blue/10 rounded-xl flex items-center justify-center border border-accent-blue/20 group-hover:scale-110 transition-transform">
                                        <Smartphone className="w-6 h-6 text-accent-blue" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-xs font-bold text-text-primary uppercase tracking-widest">Support Prioritaire</p>
                                        <p className="text-[9px] text-text-dim font-bold uppercase tracking-tight mt-1 font-mono">ASSISTANCE 24/7 EN DIRECT</p>
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
