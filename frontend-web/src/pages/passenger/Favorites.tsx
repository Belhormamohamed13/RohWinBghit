import React from 'react';
import { useNavigate } from 'react-router-dom';

const PassengerFavorites: React.FC = () => {
    const navigate = useNavigate();

    const favoriteDrivers = [
        {
            name: "Yacine Rahmani",
            rating: 4.9,
            reviews: 128,
            car: "Volkswagen Golf 8 (Noir)",
            responseRate: "98%",
            avatar: "https://ui-avatars.com/api/?name=Yacine+Rahmani&background=2bee6c&color=fff&bold=true",
            routes: ["Alger → Oran", "Alger → Blida"]
        },
        {
            name: "Sofiane K.",
            rating: 4.7,
            reviews: 84,
            car: "Hyundai Tucson",
            responseRate: "92%",
            avatar: "https://ui-avatars.com/api/?name=Sofiane+K&background=3b82f6&color=fff&bold=true",
            routes: ["Alger → Sétif", "Alger → Bejaia"]
        },
        {
            name: "Meriem L.",
            rating: 5.0,
            reviews: 42,
            car: "Seat Ibiza (Rose)",
            responseRate: "100%",
            avatar: "https://ui-avatars.com/api/?name=Meriem+L&background=ec4899&color=fff&bold=true",
            routes: ["Alger → Tizi Ouzou"]
        }
    ];

    const frequentTrips = [
        { from: "Alger (Centre)", to: "Oran (M'dina Jdida)", price: 1200 },
        { from: "Blida", to: "Alger (Hydra)", price: 300 },
        { from: "Sétif", to: "Alger (Kouba)", price: 900 }
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 animate-fade-in pb-20">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                        Mes <span className="text-primary">Favoris</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 leading-relaxed">
                        Retrouvez vos conducteurs de confiance et vos trajets habituels.
                    </p>
                </div>
                <div className="relative group max-w-sm w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">search</span>
                    <input
                        type="text"
                        placeholder="RECHERCHER UN FAVORIE..."
                        className="w-full pl-12 pr-6 py-4 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border-2 border-transparent rounded-2xl focus:border-primary/30 outline-none font-black text-[10px] uppercase tracking-[0.2em] shadow-soft transition-all"
                    />
                </div>
            </div>

            {/* Section 1: Favorite Drivers - High-end Grid */}
            <section className="mb-20">
                <div className="flex items-center justify-between mb-10 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined font-black">stars</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Conducteurs Certifiés</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteDrivers.map((driver, i) => (
                        <div key={i} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-lg rounded-[2.5rem] border border-white dark:border-slate-800 p-8 shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all group overflow-hidden relative">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/15 transition-colors"></div>

                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="relative">
                                    <img
                                        src={driver.avatar}
                                        alt={driver.name}
                                        className="w-20 h-20 rounded-[1.75rem] object-cover ring-4 ring-primary/10 shadow-xl group-hover:scale-110 transition-transform"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-slate-900 p-1 rounded-xl border-4 border-white dark:border-slate-900 shadow-lg">
                                        <span className="material-symbols-outlined text-[12px] font-black">verified</span>
                                    </div>
                                </div>
                                <button className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-primary shadow-sm hover:scale-110 transition-transform active:scale-95">
                                    <span className="material-symbols-outlined fill-1">star</span>
                                </button>
                            </div>

                            <h3 className="font-black text-xl mb-1 text-slate-900 dark:text-white tracking-tighter">{driver.name}</h3>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="flex text-yellow-500">
                                    <span className="material-symbols-outlined text-sm fill-1">star</span>
                                </div>
                                <span className="text-sm font-black text-slate-900 dark:text-white">{driver.rating}</span>
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">({driver.reviews} avis)</span>
                            </div>

                            <div className="space-y-3 mb-8">
                                <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                    <span className="material-symbols-outlined text-lg">directions_car</span>
                                    <span className="truncate">{driver.car}</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-bold">
                                    <span className="material-symbols-outlined text-lg text-primary">speed</span>
                                    <span className="text-primary uppercase tracking-widest">{driver.responseRate} de réponse</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-10 min-h-[50px]">
                                {driver.routes.map((route, idx) => (
                                    <span key={idx} className="px-3 py-1 bg-slate-100 dark:bg-slate-800/80 text-[10px] rounded-lg text-slate-500 dark:text-slate-400 font-black uppercase tracking-wider italic">
                                        {route}
                                    </span>
                                ))}
                            </div>

                            <button
                                onClick={() => navigate('/passenger/search')}
                                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl transition-all shadow-xl hover:bg-primary hover:text-slate-900 flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] active:scale-95"
                            >
                                <span className="material-symbols-outlined text-lg font-black">calendar_month</span>
                                Réserver
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => navigate('/passenger/search')}
                        className="bg-white/40 dark:bg-slate-900/20 backdrop-blur-sm rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-8 text-center group cursor-pointer hover:border-primary hover:bg-white/60 transition-all min-h-[350px]"
                    >
                        <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-soft group-hover:bg-primary group-hover:text-slate-900 transition-all group-hover:rotate-12">
                            <span className="material-symbols-outlined text-4xl font-light">person_add</span>
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Explorer de nouveaux profils</p>
                    </button>
                </div>
            </section>

            {/* Section 2: Frequent Trips - Modern Timeline style */}
            <section className="mb-20">
                <div className="flex items-center justify-between mb-10 px-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center text-secondary">
                            <span className="material-symbols-outlined font-black">route</span>
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Itinéraires Récurrents</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {frequentTrips.map((trip, i) => (
                        <div key={i} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 p-8 flex flex-col md:flex-row items-center justify-between gap-10 hover:shadow-elevated hover:border-secondary/40 transition-all group shadow-soft relative overflow-hidden">
                            <div className="flex items-center gap-8 w-full md:w-auto">
                                <div className="w-16 h-16 bg-secondary/10 dark:bg-secondary/20 rounded-[1.5rem] flex items-center justify-center text-secondary group-hover:scale-110 group-hover:rotate-6 transition-all border border-secondary/20 shadow-inner">
                                    <span className="material-symbols-outlined text-3xl font-light">commute</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-4">
                                        <div className="text-left">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">DE</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{trip.from.split(' ')[0]}</p>
                                        </div>
                                        <div className="flex items-center px-4">
                                            <div className="h-[2px] w-12 bg-gradient-to-r from-secondary/50 to-primary/50 relative rounded-full">
                                                <span className="material-symbols-outlined absolute -top-[14px] left-1/2 -to-x-1/2 text-secondary text-2xl font-light">trending_flat</span>
                                            </div>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">VERS</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">{trip.to.split(' ')[0]}</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 italic mt-2">Dernier prix : {trip.price} DZD</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button
                                    onClick={() => navigate('/passenger/search')}
                                    className="flex-1 md:flex-none px-10 py-4 bg-secondary text-white font-black rounded-2xl shadow-xl shadow-secondary/20 hover:scale-105 transition-all text-[10px] uppercase tracking-[0.2em]"
                                >
                                    Chercher
                                </button>
                                <button className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-90 border border-transparent dark:border-slate-700">
                                    <span className="material-symbols-outlined text-2xl font-black">delete</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Insight Card */}
            <div className="mt-24 relative overflow-hidden rounded-[3rem] bg-slate-900 border border-slate-800 p-12 shadow-elevated">
                <div className="absolute top-0 right-0 p-40 bg-primary/20 blur-[120px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-48 h-48 bg-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-[100px] text-primary/60 font-light">volunteer_activism</span>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-3xl font-black mb-4 text-white tracking-tight italic">Gardez le contact <span className="text-primary">.</span></h3>
                        <p className="text-slate-400 text-lg mb-10 max-w-xl font-medium leading-relaxed">
                            Ajoutez vos conducteurs favoris après chaque trajet réussi. Vous serez informé en priorité de leurs prochaines publications.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            <button
                                onClick={() => navigate('/passenger/search')}
                                className="bg-primary text-slate-900 px-10 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                Explorer les trajets
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerFavorites;
