import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { tripsApi, wilayasApi } from '../../services/api';

const SearchTrips: React.FC = () => {
    const navigate = useNavigate();
    const [searchFilters, setSearchFilters] = useState({
        fromWilayaId: '',
        toWilayaId: '',
        date: '',
        seats: 1
    });

    const { data: wilayas } = useQuery({
        queryKey: ['wilayas'],
        queryFn: async () => {
            const response = await wilayasApi.getAll();
            return response.data.data;
        }
    });

    const { data: trips, isLoading, isError, refetch } = useQuery({
        queryKey: ['trips-search', searchFilters],
        queryFn: async () => {
            if (!searchFilters.fromWilayaId && !searchFilters.toWilayaId) return [];
            const response = await tripsApi.search({
                fromWilayaId: searchFilters.fromWilayaId ? Number(searchFilters.fromWilayaId) : undefined,
                toWilayaId: searchFilters.toWilayaId ? Number(searchFilters.toWilayaId) : undefined,
                date: searchFilters.date || undefined,
                seats: searchFilters.seats
            });
            return response.data.data;
        },
        enabled: !!searchFilters.fromWilayaId || !!searchFilters.toWilayaId
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        refetch();
    };

    const getWilayaName = (id: number) => {
        return wilayas?.find((w: any) => w.code === id)?.name || id;
    };

    return (
        <div className="max-w-7xl mx-auto py-8 animate-fade-up font-body text-text-primary">
            <div className="mb-12">
                <h1 className="font-display text-5xl mb-3 tracking-wide">
                    TROUVER UN <span className="text-sand-300">TRAJET</span>
                </h1>
                <p className="text-text-muted text-lg max-w-2xl leading-relaxed">
                    Recherchez parmi des centaines de trajets quotidiens partagés par notre communauté de conducteurs vérifiés.
                </p>
            </div>

            {/* Premium Search Bar */}
            <div className="bg-night-800/60 backdrop-blur-xl p-8 rounded-3xl border border-border shadow-card mb-16">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="group relative">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-[2px] ml-4 mb-2 block font-mono">DÉPART</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-sand-300 group-hover:scale-110 transition-transform">location_on</span>
                            <select
                                value={searchFilters.fromWilayaId}
                                onChange={(e) => setSearchFilters({ ...searchFilters, fromWilayaId: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-night-900 border border-border rounded-xl text-sm font-bold text-text-primary focus:border-sand-300 focus:ring-1 focus:ring-sand-300/20 outline-none transition-all appearance-none"
                            >
                                <option value="" className="bg-night-900">Choisir wilaya</option>
                                {wilayas?.map((w: any) => (
                                    <option key={w.code} value={w.code} className="bg-night-900">{w.code} - {w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="group relative">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-[2px] ml-4 mb-2 block font-mono">ARRIVÉE</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-accent-teal group-hover:scale-110 transition-transform">location_on</span>
                            <select
                                value={searchFilters.toWilayaId}
                                onChange={(e) => setSearchFilters({ ...searchFilters, toWilayaId: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-night-900 border border-border rounded-xl text-sm font-bold text-text-primary focus:border-accent-teal focus:ring-1 focus:ring-accent-teal/20 outline-none transition-all appearance-none"
                            >
                                <option value="" className="bg-night-900">Choisir wilaya</option>
                                {wilayas?.map((w: any) => (
                                    <option key={w.code} value={w.code} className="bg-night-900">{w.code} - {w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="group relative text-left">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-[2px] ml-4 mb-2 block font-mono">DATE</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:scale-110 transition-transform">calendar_today</span>
                            <input
                                type="date"
                                value={searchFilters.date}
                                onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-night-900 border border-border rounded-xl text-sm font-bold text-text-primary focus:border-sand-300 focus:ring-1 focus:ring-sand-300/20 outline-none transition-all dark-date-input"
                            />
                        </div>
                    </div>

                    <div className="group relative">
                        <label className="text-[10px] font-bold text-text-dim uppercase tracking-[2px] ml-4 mb-2 block font-mono">PLACES</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:scale-110 transition-transform">group</span>
                            <select
                                value={searchFilters.seats}
                                onChange={(e) => setSearchFilters({ ...searchFilters, seats: Number(e.target.value) })}
                                className="w-full pl-12 pr-4 py-4 bg-night-900 border border-border rounded-xl text-sm font-bold text-text-primary focus:border-sand-300 focus:ring-1 focus:ring-sand-300/20 outline-none transition-all appearance-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <option key={n} value={n} className="bg-night-900">{n} {n > 1 ? 'Places' : 'Place'}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full h-[58px] btn btn-primary rounded-xl shadow-glow hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <span className="material-symbols-outlined font-bold group-hover:rotate-12 transition-transform">travel_explore</span>
                            RECHERCHER
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="w-16 h-16 border-4 border-sand-300/20 border-t-sand-300 rounded-full animate-spin"></div>
                        <p className="text-sand-300 font-mono text-xs mt-6 uppercase tracking-widest">Recherche en cours...</p>
                    </div>
                )}

                {isError && (
                    <div className="bg-accent-red/10 backdrop-blur-md p-10 rounded-3xl border border-accent-red/20 text-center max-w-2xl mx-auto">
                        <span className="material-symbols-outlined text-accent-red text-5xl mb-4">error</span>
                        <h3 className="text-xl font-bold text-text-primary mb-2">Oups ! Une erreur est survenue</h3>
                        <p className="text-accent-red/80">Nous n'avons pas pu récupérer les trajets. Veuillez réessayer.</p>
                    </div>
                )}

                {!isLoading && !isError && trips && trips.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="font-display text-2xl text-text-primary tracking-wide">
                                {trips.length} TRAJETS <span className="text-sand-300 ml-1">DISPONIBLES</span>
                            </h2>
                            <div className="flex gap-3">
                                <button className="p-3 bg-night-800 border border-border rounded-xl text-text-muted hover:text-sand-300 hover:border-sand-300/50 transition-all">
                                    <span className="material-symbols-outlined">tune</span>
                                </button>
                            </div>
                        </div>
                        {trips.map((trip: any) => (
                            <div key={trip.id} className="bg-night-800/40 backdrop-blur-md p-8 rounded-3xl border border-border hover:border-sand-300/50 hover:bg-night-800/60 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <span className="px-4 py-1.5 bg-accent-teal/10 text-accent-teal border border-accent-teal/20 text-[10px] font-mono font-bold uppercase tracking-widest rounded-full">CONFIRMÉ</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                    <div className="flex-1 flex gap-8 lg:gap-12 items-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-2xl font-display tracking-widest text-text-primary">{trip.departure_time.split('T')[1].substring(0, 5)}</span>
                                            <div className="h-16 w-px bg-gradient-to-b from-sand-300 to-accent-teal relative my-2">
                                                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-sand-300 bg-night-900"></div>
                                                <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-full border-2 border-accent-teal bg-night-900"></div>
                                            </div>
                                            <span className="text-sm text-text-dim font-bold font-mono">~:~~</span>
                                        </div>
                                        <div className="flex flex-col gap-8">
                                            <div>
                                                <h4 className="text-xl font-bold text-text-primary leading-none tracking-tight">{getWilayaName(trip.from_wilaya_id)}</h4>
                                                <p className="text-sm text-text-muted mt-2 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">near_me</span> {trip.from_city || 'Wilaya Centre'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-bold text-text-primary leading-none tracking-tight">{getWilayaName(trip.to_wilaya_id)}</h4>
                                                <p className="text-sm text-text-muted mt-2 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs text-accent-teal">near_me</span> {trip.to_city || 'Wilaya Centre'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-night-900/50 p-4 rounded-2xl border border-border w-full md:w-auto">
                                        <div className="relative">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${trip.driver_name || (trip.driver_first_name ? `${trip.driver_first_name}+${trip.driver_last_name}` : 'C')}&background=d4a855&color=0a0b0e&bold=true`}
                                                className="w-12 h-12 rounded-xl object-cover ring-2 ring-sand-300/20"
                                                alt="Driver"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-sand-300 rounded-full p-0.5 border-2 border-night-900">
                                                <span className="material-symbols-outlined text-[10px] text-night-900 font-black">check</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-text-primary">
                                                {trip.driver_name || (trip.driver_first_name ? `${trip.driver_first_name} ${trip.driver_last_name}` : 'Conducteur Pro')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-sand-300">
                                                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                                                </div>
                                                <span className="text-xs font-bold text-text-dim">
                                                    {trip.driver_rating || '4.9'} • {trip.driver_trips_count || '45'} trajets
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col justify-between items-end gap-4 w-full md:w-auto md:min-w-[150px] md:border-l border-border md:pl-10">
                                        <div className="text-right">
                                            <p className={`text-3xl font-display tracking-tight ${trip.available_seats === 0 ? 'text-accent-red' : 'text-sand-300'}`}>{trip.price_per_seat}<span className="text-sm ml-1 font-sans opacity-60">DZD</span></p>
                                            <p className="text-[10px] text-text-dim font-mono font-bold uppercase tracking-[0.2em] mt-1">
                                                {trip.available_seats === 0 ? 'COMPLET' : 'PAR SIÈGE'}
                                            </p>
                                        </div>
                                        <button
                                            disabled={trip.available_seats === 0}
                                            onClick={() => navigate(`/passenger/trips/${trip.id}`)}
                                            className={`font-bold px-8 py-3 rounded-xl text-sm shadow-lg transition-all ${trip.available_seats === 0 ? 'bg-night-700 text-text-dim cursor-not-allowed' : 'btn btn-primary hover:scale-105'}`}
                                        >
                                            {trip.available_seats === 0 ? 'Complet' : 'Réserver'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !isLoading && (
                        <div className="text-center py-24 bg-night-800/40 backdrop-blur-sm rounded-3xl border border-dashed border-border group hover:border-sand-300/30 transition-colors">
                            <div className="w-20 h-20 bg-night-800 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-glow border border-border">
                                <span className="material-symbols-outlined text-sand-300 text-4xl">rocket_launch</span>
                            </div>
                            <h3 className="font-display text-3xl text-text-primary mb-4 tracking-wide">PRÊT POUR L'AVENTURE ?</h3>
                            <p className="text-text-muted max-w-md mx-auto mb-12 text-lg leading-relaxed">
                                Saisissez votre destination pour découvrir les meilleurs trajets disponibles au meilleur prix.
                            </p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                {['Alger → Oran', 'Alger → Constantine', 'Annaba → Alger'].map(route => (
                                    <button
                                        key={route}
                                        onClick={() => {
                                            const [from, to] = route.split(' → ');
                                            const fromW = wilayas?.find((w: any) => w.name.includes(from))?.code || '16';
                                            const toW = wilayas?.find((w: any) => w.name.includes(to))?.code || '31';
                                            setSearchFilters({ ...searchFilters, fromWilayaId: fromW.toString(), toWilayaId: toW.toString() });
                                        }}
                                        className="px-6 py-3 bg-night-800 border border-border rounded-xl text-sm font-bold text-text-muted hover:border-sand-300 hover:text-sand-300 transition-all shadow-sm active:scale-95"
                                    >
                                        {route}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default SearchTrips;
