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
        <div className="max-w-7xl mx-auto py-8 animate-fade-in">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight">
                    Trouver un trajet <span className="text-primary italic">.</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl leading-relaxed">
                    Recherchez parmi des centaines de trajets quotidiens partagés par notre communauté de conducteurs vérifiés.
                </p>
            </div>

            {/* Premium Search Bar */}
            <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-elevated mb-16">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="group relative">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">DÉPART</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary group-hover:scale-110 transition-transform">location_on</span>
                            <select
                                value={searchFilters.fromWilayaId}
                                onChange={(e) => setSearchFilters({ ...searchFilters, fromWilayaId: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all appearance-none"
                            >
                                <option value="" className="bg-white dark:bg-slate-900">Choisir wilaya</option>
                                {wilayas?.map((w: any) => (
                                    <option key={w.code} value={w.code} className="bg-white dark:bg-slate-900">{w.code} - {w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="group relative">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">ARRIVÉE</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary group-hover:scale-110 transition-transform">location_on</span>
                            <select
                                value={searchFilters.toWilayaId}
                                onChange={(e) => setSearchFilters({ ...searchFilters, toWilayaId: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:border-secondary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all appearance-none"
                            >
                                <option value="" className="bg-white dark:bg-slate-900">Choisir wilaya</option>
                                {wilayas?.map((w: any) => (
                                    <option key={w.code} value={w.code} className="bg-white dark:bg-slate-900">{w.code} - {w.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="group relative text-left">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">DATE</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:scale-110 transition-transform">calendar_today</span>
                            <input
                                type="date"
                                value={searchFilters.date}
                                onChange={(e) => setSearchFilters({ ...searchFilters, date: e.target.value })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="group relative">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4 mb-2 block">PLACES</label>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:scale-110 transition-transform">group</span>
                            <select
                                value={searchFilters.seats}
                                onChange={(e) => setSearchFilters({ ...searchFilters, seats: Number(e.target.value) })}
                                className="w-full pl-12 pr-4 py-4 bg-slate-100/50 dark:bg-slate-800/40 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 dark:text-white focus:border-primary/30 focus:bg-white dark:focus:bg-slate-800 outline-none transition-all appearance-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                    <option key={n} value={n} className="bg-white dark:bg-slate-900">{n} {n > 1 ? 'Places' : 'Place'}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full h-[58px] bg-primary text-slate-900 font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] hover:shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                            <span className="material-symbols-outlined font-bold group-hover:rotate-12 transition-transform">travel_explore</span>
                            Rechercher
                        </button>
                    </div>
                </form>
            </div>

            {/* Results Section */}
            <div className="space-y-8">
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 border-4 border-primary/10 rounded-full"></div>
                            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold mt-8 tracking-wide">RECHERCHE EN COURS...</p>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-500/10 backdrop-blur-md p-10 rounded-[2rem] border border-red-500/20 text-center max-w-2xl mx-auto">
                        <span className="material-symbols-outlined text-red-500 text-5xl mb-4">error</span>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Oups ! Une erreur est survenue</h3>
                        <p className="text-red-400/80">Nous n'avons pas pu récupérer les trajets. Veuillez réessayer.</p>
                    </div>
                )}

                {!isLoading && !isError && trips && trips.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                                {trips.length} trajets <span className="text-primary font-normal text-lg ml-1">correspondants</span>
                            </h2>
                            <div className="flex gap-3">
                                <button className="p-3 bg-white dark:bg-slate-800/80 backdrop-blur border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-primary transition-all shadow-sm">
                                    <span className="material-symbols-outlined">tune</span>
                                </button>
                            </div>
                        </div>
                        {trips.map((trip: any) => (
                            <div key={trip.id} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">CONFIRMÉ</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                                    <div className="flex-1 flex gap-12 items-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <span className="text-2xl font-black text-slate-900 dark:text-white">{trip.departure_time.split('T')[1].substring(0, 5)}</span>
                                            <div className="h-16 w-1 bg-gradient-to-b from-primary to-secondary rounded-full relative">
                                                <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full border-4 border-primary bg-white dark:bg-slate-900 shadow-sm"></div>
                                                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full border-4 border-secondary bg-white dark:bg-slate-900 shadow-sm"></div>
                                            </div>
                                            <span className="text-sm text-slate-400 font-bold uppercase">~:~~</span>
                                        </div>
                                        <div className="flex flex-col gap-10">
                                            <div>
                                                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">{getWilayaName(trip.from_wilaya_id)}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">near_me</span> {trip.from_city || 'Wilaya Centre'}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">{getWilayaName(trip.to_wilaya_id)}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-xs">near_me</span> {trip.to_city || 'Wilaya Centre'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-slate-100/50 dark:bg-slate-800/40 p-5 rounded-3xl border border-white dark:border-slate-800 w-full md:w-auto">
                                        <div className="relative">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${trip.driver_name || (trip.driver_first_name ? `${trip.driver_first_name}+${trip.driver_last_name}` : 'C')}&background=2bee6c&color=fff&bold=true`}
                                                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20"
                                                alt="Driver"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-0.5 border-2 border-white dark:border-slate-800">
                                                <span className="material-symbols-outlined text-[10px] text-white font-black">check</span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900 dark:text-white">
                                                {trip.driver_name || (trip.driver_first_name ? `${trip.driver_first_name} ${trip.driver_last_name}` : 'Conducteur Pro')}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-yellow-500">
                                                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                                                </div>
                                                <span className="text-xs font-black text-slate-500 dark:text-slate-400">
                                                    {trip.driver_rating || '4.9'} • {trip.driver_trips_count || '45'} trajets
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col justify-between items-end gap-4 w-full md:w-auto md:min-w-[150px] md:border-l-2 md:border-dashed md:border-slate-200 dark:md:border-slate-800 md:pl-10">
                                        <div className="text-right">
                                            <p className={`text-3xl font-black tracking-tighter ${trip.available_seats === 0 ? 'text-red-500' : 'text-primary'}`}>{trip.price_per_seat}<span className="text-sm ml-1 opacity-60">DZD</span></p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                                                {trip.available_seats === 0 ? 'COMPLET' : 'PAR SIÈGE'}
                                            </p>
                                        </div>
                                        <button
                                            disabled={trip.available_seats === 0}
                                            onClick={() => navigate(`/passenger/trips/${trip.id}`)}
                                            className={`font-black px-8 py-3 rounded-2xl text-sm shadow-xl transition-all ${trip.available_seats === 0 ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-105'}`}
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
                        <div className="text-center py-24 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-elevated">
                                <span className="material-symbols-outlined text-primary text-5xl">rocket_launch</span>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Prêt pour l'aventure ?</h3>
                            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-12 text-lg leading-relaxed">
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
                                        className="px-6 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-all shadow-soft active:scale-95"
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
