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
    Map,
    Users
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

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

    const handleBooking = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: `/trips/${id}` } });
            return;
        }
        navigate(`/passenger/booking/checkout?tripId=${id}&seats=${seats}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-slate-50 dark:bg-[#08110b]">
                <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">Chargement du plan de vol...</p>
            </div>
        );
    }

    if (!trip) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#08110b]">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4 uppercase italic">Trajet Introuvable</h1>
                <Link to="/" className="text-primary font-black uppercase tracking-widest flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#08110b] pb-32">
            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-3 mb-10 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link to="/" className="hover:text-primary transition-colors italic">Accueil</Link>
                    <span className="opacity-30">/</span>
                    <Link to="/trips/results" className="hover:text-primary transition-colors italic">Recherche</Link>
                    <span className="opacity-30">/</span>
                    <span className="text-slate-900 dark:text-white italic">{trip.from_city} → {trip.to_city}</span>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[1fr,380px] gap-12">
                    {/* Left Section */}
                    <div className="space-y-12">
                        {/* Header */}
                        <div className="bg-white dark:bg-slate-900/40 rounded-[3rem] p-10 border border-slate-100 dark:border-slate-800 shadow-soft">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">
                                {trip.from_city} <span className="text-primary">→</span> {trip.to_city}
                            </h2>
                            <div className="flex flex-wrap gap-8 mt-8">
                                <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] italic">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    {format(new Date(trip.departure_time), 'EEEE d MMMM', { locale: fr })}
                                </div>
                                <div className="flex items-center gap-3 text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] italic">
                                    <Clock className="w-4 h-4 text-primary" />
                                    {format(new Date(trip.departure_time), 'HH:mm')} Departure
                                </div>
                            </div>
                        </div>

                        {/* Map or Image */}
                        <div className="rounded-[3rem] overflow-hidden group shadow-elevated border-8 border-white dark:border-slate-900">
                            <div className="h-80 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=1200"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                    alt="Itinerary"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                <div className="absolute bottom-10 left-10 flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                                        <Map className="w-6 h-6 text-primary" />
                                    </div>
                                    <p className="text-white font-black uppercase italic tracking-widest text-sm">Visualisation de l'itinéraire Alger-Constantine</p>
                                </div>
                            </div>
                        </div>

                        {/* Journey Stats */}
                        <div className="bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-soft">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase mb-10">Détails du Trajet</h3>
                            <div className="relative pl-12 space-y-16">
                                {/* Vertical Line */}
                                <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-slate-100 dark:bg-slate-800"></div>

                                {/* Departure */}
                                <div className="relative">
                                    <div className="absolute -left-[12px] top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-primary z-10"></div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none">{trip.from_city}</p>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Point de rendez-vous : Place des Martyrs</p>
                                    </div>
                                </div>

                                {/* Arrival */}
                                <div className="relative">
                                    <div className="absolute -left-[12px] top-1 w-6 h-6 rounded-full bg-white dark:bg-slate-900 border-4 border-slate-300 dark:border-slate-700 z-10"></div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none">{trip.to_city}</p>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Point d'arrivée : Gare Routière Centrale</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Driver & Vehicle */}
                        <div className="bg-white dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-soft">
                            <div className="flex items-center gap-8 mb-12">
                                <div className="relative">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-900"
                                        style={{ backgroundImage: `url(https://ui-avatars.com/api/?name=${trip.driver_name || 'Driver'}&background=2bee6c&color=102216&bold=true)` }}
                                    ></div>
                                    <div className="absolute -bottom-1 -right-1 bg-primary text-slate-900 w-8 h-8 rounded-2xl flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-xl">
                                        <CheckCircle className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase leading-none mb-4">{trip.driver_name || 'Pilot Lambda'}</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2 text-orange-500 text-sm font-black tracking-widest">
                                            <Star className="w-4 h-4 fill-current" />
                                            {trip.driver_rating || '4.8'}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic border-l border-slate-200 dark:border-slate-800 pl-4">{reviews?.length || 0} avis vérifiés</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <p className="text-slate-500 dark:text-slate-400 font-medium italic leading-relaxed">
                                        "Conducteur prudent, non-fumeur, et toujours ponctuel. Je fais ce trajet chaque semaine pour le travail. Au plaisir de vous avoir à bord !"
                                    </p>
                                    <div className="flex flex-wrap gap-3">
                                        {['Non-fumeur', 'Sans animaux', 'Expérimenté'].map(tag => (
                                            <span key={tag} className="px-5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] flex items-center gap-6 border border-slate-100 dark:border-slate-700">
                                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-lg border border-slate-200/50 dark:border-slate-800">
                                        <Car className="w-8 h-8 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight italic leading-none truncate">Renault Symbol (2021)</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2 italic">Blanche • A/C • Chargeur USB</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tighter uppercase ml-4">Avis des passagers</h3>
                            <div className="grid gap-6">
                                {(reviews && reviews.length > 0) ? reviews.map((review: any) => (
                                    <div key={review.id} className="p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/30">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center font-black text-primary italic">
                                                    {review.reviewer_name?.[0] || 'P'}
                                                </div>
                                                <div>
                                                    <span className="font-black text-slate-900 dark:text-white uppercase tracking-tight italic block leading-none">{review.reviewer_name || 'Passager'}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 block leading-none">{format(new Date(review.created_at), 'MMMM yyyy', { locale: fr })}</span>
                                                </div>
                                            </div>
                                            <div className="flex text-orange-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 italic font-medium leading-relaxed">{review.comment}</p>
                                    </div>
                                )) : (
                                    <div className="p-12 text-center bg-white dark:bg-slate-900/30 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                                        <MessageCircle className="w-10 h-10 text-slate-200 dark:text-slate-800 mx-auto mb-4" />
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Aucun avis disponible pour le moment.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section / Booking Widget */}
                    <aside>
                        <div className="sticky top-32 space-y-6">
                            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl p-10 rounded-[4rem] border border-white dark:border-slate-800 shadow-elevated">
                                <div className="flex items-baseline justify-between mb-10">
                                    <div>
                                        <span className="text-4xl font-black text-primary italic tracking-tighter">{trip.price_per_seat}</span>
                                        <span className="text-lg font-black ml-2 text-slate-900 dark:text-white italic">DZD</span>
                                    </div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">par place</span>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center justify-between p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic ml-3">PLACES</span>
                                        <div className="flex items-center gap-6 pr-3">
                                            <button
                                                onClick={() => setSeats(Math.max(1, seats - 1))}
                                                className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="text-xl font-black text-slate-900 dark:text-white italic">{seats}</span>
                                            <button
                                                onClick={() => setSeats(Math.min(trip.available_seats, seats + 1))}
                                                className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-all active:scale-95"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 px-6 py-3 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 rounded-2xl">
                                        <Users className="w-5 h-5 text-red-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">{trip.available_seats} places restantes</span>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        className="w-full bg-primary hover:bg-primary/90 text-slate-900 font-black py-6 rounded-[2rem] shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                                    >
                                        Réserver maintenant
                                        <ArrowRight className="w-5 h-5" />
                                    </button>

                                    <div className="flex gap-4 p-4 mt-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                                        <Info className="w-5 h-5 text-slate-400 shrink-0" />
                                        <p className="text-[9px] text-slate-400 font-black leading-relaxed uppercase tracking-widest italic">Aucun paiement requis aujourd'hui. Vous payez le conducteur en espèces lors du trajet.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Badge */}
                            <div className="bg-white/40 dark:bg-slate-900/40 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-green-500/10 rounded-2xl flex items-center justify-center">
                                        <ShieldCheck className="w-5 h-5 text-green-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Protection Réservation Sécurisée</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                                        <Smartphone className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Support Mobile 24/7</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Details;
