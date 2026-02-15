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
        <div className="max-w-7xl mx-auto py-8 animate-fade-up pb-20 font-body text-text-primary min-h-screen">
            {/* Premium Header */}
            <div className="mb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-8">
                    <div>
                        <h1 className="text-5xl font-display text-text-primary tracking-wide">
                            MES <span className="text-sand-300">RÉSERVATIONS</span>
                        </h1>
                        <p className="text-text-muted text-lg mt-2 leading-relaxed max-w-2xl font-medium">
                            Consultez vos prochains voyages, gérez vos réservations en attente ou explorez votre historique.
                        </p>
                    </div>
                </div>

                {/* Premium Tabs Navigation */}
                <div className="flex gap-4 overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                    {[
                        { id: 'upcoming', label: 'À VENIR', count: bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'pending').length },
                        { id: 'past', label: 'PASSÉES', count: bookings.filter((b: any) => b.status === 'completed').length },
                        { id: 'cancelled', label: 'ANNULÉES', count: bookings.filter((b: any) => b.status === 'cancelled').length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-8 py-4 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-3 border font-mono ${activeTab === tab.id
                                ? 'bg-sand-300 text-night-900 border-sand-300 shadow-glow scale-105'
                                : 'bg-night-800 text-text-muted border-border hover:bg-night-700 hover:text-text-primary'
                                }`}
                        >
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${activeTab === tab.id ? 'bg-night-900 text-sand-300' : 'bg-night-700 text-text-dim'}`}>
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
                    <div className="py-32 flex flex-col items-center justify-center gap-6 bg-night-800/20 rounded-[3rem] border border-dashed border-border/50">
                        <div className="relative w-16 h-16">
                            <div className="absolute inset-0 border-4 border-sand-300/20 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-sand-300 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-text-muted font-bold uppercase tracking-[0.3em] text-[10px] font-mono">Chargement des données...</p>
                    </div>
                ) : filteredBookings.length > 0 ? filteredBookings.map((booking: any) => (
                    <div key={booking.id} className="bg-night-800/60 backdrop-blur-xl rounded-[2.5rem] shadow-card border border-border overflow-hidden hover:shadow-elevated hover:border-sand-300/30 transition-all group border-b-4 border-b-sand-300/10">
                        <div className="p-10">
                            <div className="flex flex-col lg:flex-row gap-12">
                                {/* Left Section: Driver Profile */}
                                <div className="flex lg:flex-col items-center lg:items-start gap-6 lg:w-56 shrink-0 relative">
                                    <div className="relative">
                                        <img
                                            src={booking.trip?.driver?.avatar_url || `https://ui-avatars.com/api/?name=${booking.trip?.driver?.first_name || 'D'}+${booking.trip?.driver?.last_name || 'D'}&background=d4a855&color=0a0b0e&bold=true`}
                                            alt="Driver"
                                            className="w-24 h-24 rounded-[2rem] object-cover ring-4 ring-night-900 border border-sand-300/20 shadow-xl group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute -bottom-2 -right-2 bg-sand-300 text-night-900 border-4 border-night-800 rounded-xl p-1 shadow-lg">
                                            <span className="material-symbols-outlined text-xs font-bold">verified</span>
                                        </div>
                                    </div>
                                    <div className="text-center lg:text-left">
                                        <h3 className="text-xl font-display text-text-primary mb-1 tracking-wide uppercase">{booking.trip?.driver?.first_name} {booking.trip?.driver?.last_name}</h3>
                                        <div className="flex items-center justify-center lg:justify-start gap-2 text-sand-300">
                                            <span className="material-symbols-outlined text-sm fill-1">star</span>
                                            <p className="text-xs font-bold uppercase tracking-widest mt-0.5 font-mono">Note: 4.8</p>
                                        </div>
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
                                            <span className={`px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border font-mono ${booking.status === 'confirmed' ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/20' :
                                                booking.status === 'pending' ? 'bg-sand-300/10 text-sand-300 border-sand-300/20' :
                                                    'bg-accent-red/10 text-accent-red border-accent-red/20'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'Acceptée' :
                                                    booking.status === 'pending' ? 'En attente' :
                                                        booking.status === 'completed' ? 'Terminée' : 'Annulée'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center Section: Route Information */}
                                <div className="flex-grow bg-night-900/50 p-8 rounded-[2rem] border border-border relative overflow-hidden group-hover:border-sand-300/10 transition-colors">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <span className="material-symbols-outlined text-[100px] font-light text-sand-300">route</span>
                                    </div>
                                    <div className="flex items-start gap-8 relative z-10">
                                        <div className="flex flex-col items-center pt-2 h-full">
                                            <div className="w-4 h-4 rounded-full border-4 border-sand-300 shadow-glow bg-night-900"></div>
                                            <div className="w-0.5 h-24 bg-gradient-to-b from-sand-300 to-accent-teal/50 rounded-full my-1 opacity-50"></div>
                                            <div className="w-4 h-4 rounded-full border-4 border-accent-teal/50 bg-night-900 shadow-sm"></div>
                                        </div>
                                        <div className="flex flex-col justify-between min-h-[140px] w-full">
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-[0.2em] font-mono">DÉPART</p>
                                                    <p className="text-xs font-bold text-sand-300 bg-sand-300/10 px-3 py-1 rounded-lg border border-sand-300/20">
                                                        {booking.trip?.departure_time ? format(new Date(booking.trip.departure_time), 'HH:mm') : '---'}
                                                    </p>
                                                </div>
                                                <h4 className="text-3xl font-display text-text-primary tracking-wide uppercase leading-none">{booking.trip?.from_city || '---'}</h4>
                                                <p className="text-xs font-medium text-text-muted mt-2 italic flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                    {booking.trip?.departure_time ? format(new Date(booking.trip.departure_time), 'EEEE dd MMMM yyyy', { locale: fr }) : 'Date inconnue'}
                                                </p>
                                            </div>
                                            <div className="h-[1px] w-full bg-border my-6 border-dashed border-t border-border/50"></div>
                                            <div>
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="text-[9px] font-bold text-text-dim uppercase tracking-[0.2em] font-mono">ARRIVÉE</p>
                                                    <span className="text-[9px] font-bold text-text-muted flex items-center gap-1 font-mono bg-night-800 px-2 py-1 rounded border border-border"><span className="material-symbols-outlined text-[10px]">timer</span> ~4h de trajet</span>
                                                </div>
                                                <h4 className="text-3xl font-display text-text-primary tracking-wide uppercase leading-none">{booking.trip?.to_city || '---'}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section: Financials & CTAs */}
                                <div className="flex flex-col justify-between items-end lg:w-72 shrink-0 gap-8">
                                    <div className="text-right w-full">
                                        <p className="text-[9px] font-bold text-text-dim uppercase tracking-[0.3em] mb-2 font-mono">MONTANT TOTAL</p>
                                        <p className="text-4xl font-display text-sand-300 tracking-wide">{parseFloat(booking.total_price).toLocaleString()} <span className="text-sm font-bold font-sans opacity-50 text-text-primary">DZD</span></p>
                                        <div className="mt-3 flex items-center justify-end gap-2 px-4 py-1.5 bg-night-900 rounded-lg w-fit ml-auto border border-border">
                                            <span className="material-symbols-outlined text-sm text-text-muted">group</span>
                                            <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest font-mono">{booking.num_seats} SIÈGE{booking.num_seats > 1 ? 'S' : ''}</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-[1px] bg-border lg:hidden"></div>

                                    <div className="w-full space-y-3">
                                        <button
                                            onClick={() => navigate(`/passenger/messages/${booking.trip?.driver_id}`)}
                                            disabled={booking.status === 'cancelled'}
                                            className="w-full bg-night-900 text-text-primary hover:bg-night-800 hover:text-sand-300 hover:border-sand-300/30 font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] shadow-lg border border-border disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                                        >
                                            <span className="material-symbols-outlined text-sm group-hover:animate-bounce">chat_bubble</span>
                                            Contacter
                                        </button>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={() => navigate(`/passenger/trips/${booking.trip_id}`)}
                                                className="bg-night-800 hover:bg-night-700 text-text-muted hover:text-text-primary py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-border hover:border-text-muted/30"
                                            >
                                                Détails
                                            </button>

                                            {booking.status === 'completed' ? (
                                                <button
                                                    onClick={() => toast('Fonctionnalité d\'avis bientôt disponible !', { icon: '⭐' })}
                                                    className="bg-sand-300/10 hover:bg-sand-300 text-sand-300 hover:text-night-900 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-sand-300/20"
                                                >
                                                    Avis
                                                </button>
                                            ) : booking.status !== 'cancelled' ? (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await bookingsApi.cancel(booking.id, 'Annulation par le passager');
                                                            window.location.reload();
                                                        } catch (error) {
                                                            alert('Erreur lors de l\'annulation');
                                                        }
                                                    }}
                                                    className="bg-accent-red/10 hover:bg-accent-red hover:text-white text-accent-red py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-accent-red/20"
                                                >
                                                    Annuler
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => toast('Signalement envoyé au support technique.', { icon: '⚠️' })}
                                                    className="bg-night-900 text-text-primary py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 border border-border"
                                                >
                                                    Support
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => toast('Ouverture du formulaire de litige...', { icon: '⚖️' })}
                                        className="w-full mt-2 text-[9px] font-bold text-text-dim uppercase tracking-widest hover:text-accent-red transition-colors font-mono text-center"
                                    >
                                        Un problème ? Signaler le trajet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="py-32 text-center flex flex-col items-center bg-night-800/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-border/50">
                        <div className="w-24 h-24 bg-night-800 rounded-[2rem] flex items-center justify-center mb-8 shadow-card border border-border">
                            <span className="material-symbols-outlined text-text-dim text-5xl">event_busy</span>
                        </div>
                        <h3 className="text-3xl font-display text-text-primary tracking-wide uppercase">Aucun trajet à l'horizon...</h3>
                        <p className="text-text-muted max-w-sm mt-4 font-medium leading-relaxed">Il semblerait que vous n'ayez aucune réservation dans cette catégorie pour le moment.</p>
                        <button
                            onClick={() => navigate('/passenger/search')}
                            className="mt-10 btn btn-primary px-10 py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-glow hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                        >
                            <span className="material-symbols-outlined text-lg font-bold">explore</span>
                            Trouver un trajet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookings;
