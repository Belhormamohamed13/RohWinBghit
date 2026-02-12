import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'react-hot-toast';


const MyBookings: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled'>('upcoming');

    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['my-bookings-full'],
        queryFn: async () => {
            const response = await bookingsApi.getMyBookings();
            return response.data.data;
        }
    });

    const bookings = bookingsData || [];

    const filteredBookings = bookings.filter((b: any) => {
        if (activeTab === 'upcoming') return b.status === 'confirmed' || b.status === 'pending';
        if (activeTab === 'past') return b.status === 'completed';
        if (activeTab === 'cancelled') return b.status === 'cancelled';
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto py-8 animate-fade-in pb-20">
            {/* Premium Header */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                            Mes <span className="text-primary italic">Réservations</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 leading-relaxed max-w-2xl">
                            Consultez vos prochains voyages, gérez vos réservations en attente ou explorez votre historique.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative group">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                            <input
                                type="text"
                                placeholder="Filtrer par ville..."
                                className="pl-12 pr-6 py-3.5 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-2 border-transparent rounded-[1.25rem] focus:border-primary/30 outline-none font-bold text-xs uppercase tracking-widest shadow-soft transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Premium Tabs Navigation */}
                <div className="flex gap-4 mt-12 bg-white/50 dark:bg-slate-900/20 p-2 rounded-[1.75rem] w-fit shadow-soft border border-slate-100 dark:border-slate-800/50">
                    {[
                        { id: 'upcoming', label: 'À VENIR', count: bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'pending').length },
                        { id: 'past', label: 'PASSÉES', count: bookings.filter((b: any) => b.status === 'completed').length },
                        { id: 'cancelled', label: 'ANNULÉES', count: bookings.filter((b: any) => b.status === 'cancelled').length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${activeTab === tab.id
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105'
                                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-md text-[9px] ${activeTab === tab.id ? 'bg-primary text-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings Display Grid */}
            <div className="grid grid-cols-1 gap-8">
                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-6">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Chargement des données...</p>
                    </div>
                ) : filteredBookings.length > 0 ? filteredBookings.map((booking: any) => (
                    <div key={booking.id} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-soft border border-white dark:border-slate-800 overflow-hidden hover:shadow-elevated transition-all group border-b-8 border-b-primary/40">
                        <div className="p-10">
                            <div className="flex flex-col lg:flex-row gap-12">
                                {/* Left Section: Driver Profile */}
                                <div className="flex lg:flex-col items-center lg:items-start gap-6 lg:w-56 shrink-0 relative">
                                    <div className="relative">
                                        <img
                                            src={booking.trip?.driver?.avatar_url || `https://ui-avatars.com/api/?name=${booking.trip?.driver?.first_name}+${booking.trip?.driver?.last_name}&background=2bee6c&color=fff&bold=true`}
                                            alt="Driver"
                                            className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-primary/10 shadow-xl group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-primary border-4 border-white dark:border-slate-900 rounded-2xl p-1 shadow-lg">
                                            <span className="material-symbols-outlined text-xs text-slate-900 font-black">verified</span>
                                        </div>
                                    </div>
                                    <div className="text-center lg:text-left">
                                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{booking.trip?.driver?.first_name} {booking.trip?.driver?.last_name}</h3>
                                        <div className="flex items-center justify-center lg:justify-start gap-1 text-yellow-600">
                                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                                            <p className="text-xs font-black uppercase tracking-widest mt-0.5">Note: 4.8</p>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' :
                                                booking.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' :
                                                    'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'Acceptée' :
                                                    booking.status === 'pending' ? 'En attente' :
                                                        booking.status === 'completed' ? 'Terminée' : 'Annulée'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Section: Route Information */}
                                <div className="flex-grow bg-slate-50/50 dark:bg-slate-800/20 p-8 rounded-[2rem] border border-slate-100/50 dark:border-slate-800/50 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="material-symbols-outlined text-[100px] font-light">route</span>
                                    </div>
                                    <div className="flex items-start gap-8 relative z-10">
                                        <div className="flex flex-col items-center pt-2">
                                            <div className="w-4 h-4 rounded-full border-4 border-primary shadow-sm"></div>
                                            <div className="w-1 h-20 bg-gradient-to-b from-primary to-secondary rounded-full my-1"></div>
                                            <div className="w-4 h-4 rounded-full bg-secondary shadow-sm"></div>
                                        </div>
                                        <div className="flex flex-col justify-between min-h-[140px] w-full">
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">DÉPART</p>
                                                    <p className="text-xs font-black text-primary">
                                                        {booking.trip?.departure_time ? `Aujourd'hui, ${format(new Date(booking.trip.departure_time), 'HH:mm')}` : '---'}
                                                    </p>
                                                </div>
                                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">{booking.trip?.from_city || '---'}</h4>
                                                <p className="text-xs font-bold text-slate-500 mt-1 italic">
                                                    {booking.trip?.departure_time ? format(new Date(booking.trip.departure_time), 'EEEE dd MMMM yyyy', { locale: fr }) : 'Date inconnue'}
                                                </p>
                                            </div>
                                            <div className="h-[1px] w-full bg-slate-200 dark:bg-slate-800 my-4 border-dashed border-t"></div>
                                            <div>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ARRIVÉE</p>
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1"><span className="material-symbols-outlined text-xs">timer</span> ~4h de trajet</span>
                                                </div>
                                                <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">{booking.trip?.to_city || '---'}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Financials & CTAs */}
                                <div className="flex flex-col justify-between items-end lg:w-72 shrink-0 gap-8">
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">MONTANT TOTAL</p>
                                        <p className="text-4xl font-black text-primary tracking-tighter">{parseFloat(booking.total_price).toLocaleString()} <span className="text-sm font-normal opacity-50">DZD</span></p>
                                        <div className="mt-3 flex items-center justify-end gap-2 px-4 py-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit ml-auto">
                                            <span className="material-symbols-outlined text-sm text-slate-500">group</span>
                                            <span className="text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">{booking.num_seats} SIÈGE{booking.num_seats > 1 ? 'S' : ''}</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-slate-100 dark:bg-slate-800 lg:hidden"></div>

                                    <div className="w-full space-y-3">
                                        <button
                                            onClick={() => navigate(`/passenger/messages/${booking.trip?.driver_id}`)}
                                            disabled={booking.status === 'cancelled'}
                                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 hover:scale-[1.02] disabled:opacity-30 disabled:grayscale disabled:scale-100 font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] shadow-xl"
                                        >
                                            <span className="material-symbols-outlined font-black">forum</span>
                                            Contacter
                                        </button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => navigate(`/passenger/trips/${booking.trip_id}`)}
                                                className="bg-slate-100 dark:bg-slate-800/10 hover:bg-slate-200 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-200 dark:border-slate-800"
                                            >
                                                Détails
                                            </button>

                                            {booking.status === 'completed' ? (
                                                <button
                                                    onClick={() => toast('Fonctionnalité d\'avis bientôt disponible !', { icon: '⭐' })}
                                                    className="bg-primary/10 hover:bg-primary text-primary hover:text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-primary/20"
                                                >
                                                    Laisser un avis
                                                </button>
                                            ) : booking.status !== 'cancelled' ? (
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ? des pénalités peuvent s\'appliquer selon le délai.')) {
                                                            try {
                                                                await bookingsApi.cancel(booking.id, 'Annulation par le passager');
                                                                window.location.reload();
                                                            } catch (error) {
                                                                alert('Erreur lors de l\'annulation');
                                                            }
                                                        }
                                                    }}
                                                    className="bg-red-500/10 hover:bg-red-500 hover:text-white text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border border-red-500/20"
                                                >
                                                    Annuler
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toast('Signalement envoyé au support technique.', { icon: '⚠️' })}
                                                    className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
                                                >
                                                    Support
                                                </button>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => toast('Ouverture du formulaire de litige...', { icon: '⚖️' })}
                                            className="w-full mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors"
                                        >
                                            Un problème ? Signaler le trajet
                                        </button>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center flex flex-col items-center bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-8 shadow-soft">
                            <span className="material-symbols-outlined text-slate-300 text-5xl">event_busy</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Aucun trajet à l'horizon...</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mt-4 font-medium leading-relaxed">Il semblerait que vous n'ayez aucune réservation dans cette catégorie pour le moment.</p>
                        <button
                            onClick={() => navigate('/passenger/search')}
                            className="mt-10 bg-primary text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg font-black font-black">explore</span>
                            Trouver un trajet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
