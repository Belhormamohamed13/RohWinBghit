import React from 'react';

const PassengerReviews: React.FC = () => {
    const reviews = [
        {
            driver: "Ahmed K.",
            date: "14 Octobre 2023",
            rating: 5.0,
            text: "Excellent passager, très poli et prêt 5 min à l'avance. Nous avons eu une super discussion sur la tech pendant le trajet Oran-Alger. Je recommande fortement !",
            tags: ["Toujours à l'heure", "Bonne conversation", "Passager propre"],
            avatar: "https://ui-avatars.com/api/?name=Ahmed+K&background=2bee6c&color=fff&bold=true"
        },
        {
            driver: "Sarah M.",
            date: "02 Octobre 2023",
            rating: 5.0,
            text: "Très sympathique et respecte parfaitement les règles du véhicule. Aucun problème. Je reprendrais Yassine avec plaisir.",
            tags: ["Poli", "Respectueux"],
            avatar: "https://ui-avatars.com/api/?name=Sarah+M&background=3b82f6&color=fff&bold=true"
        },
        {
            driver: "Mohamed B.",
            date: "28 Septembre 2023",
            rating: 4.0,
            text: "Communication correcte, juste un petit retard au point de rendez-vous mais m'a prévenu par message. Expérience globale positive.",
            tags: ["Communicatif"],
            avatar: "https://ui-avatars.com/api/?name=Mohamed+B&background=6366f1&color=fff&bold=true"
        }
    ];

    const stats = [
        { label: 'Ponctualité', value: 4.9, progress: 98, color: "bg-primary" },
        { label: 'Communication', value: 4.7, progress: 94, color: "bg-blue-500" },
        { label: 'Respect des règles', value: 5.0, progress: 100, color: "bg-purple-500" },
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 animate-fade-in pb-20">
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                        Avis & <span className="text-primary">Réputation</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 leading-relaxed">
                        Suivez votre score de confiance et consultez les retours de la communauté.
                    </p>
                </div>
                <div className="bg-primary/20 text-primary px-8 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 border border-primary/30 shadow-xl shadow-primary/5">
                    <span className="material-symbols-outlined text-xl font-black">verified_user</span>
                    Passager Certifié Or
                </div>
            </div>

            {/* Stats Overview - Premium Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
                {/* Score Card - Large Circular visual */}
                <div className="lg:col-span-4 bg-slate-900 dark:bg-slate-950 p-10 rounded-[3rem] shadow-elevated relative overflow-hidden flex flex-col items-center justify-center text-center group min-h-[400px]">
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    <div className="relative z-10 w-48 h-48 border-8 border-white/5 rounded-full flex flex-col items-center justify-center group-hover:scale-110 transition-transform duration-700">
                        <div className="absolute inset-0 border-8 border-primary border-t-transparent rounded-full animate-spin-slow opacity-40"></div>
                        <span className="text-7xl font-black text-white tracking-tighter">4.8</span>
                        <div className="flex text-yellow-500 mt-2">
                            {[1, 2, 3, 4, 5].map(i => <span key={i} className="material-symbols-outlined text-sm fill-1">star</span>)}
                        </div>
                    </div>
                    <div className="relative z-10 mt-8">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">SCORE DE CONFIANCE GLOBAL</p>
                        <p className="text-xs text-primary mt-2 font-black uppercase tracking-widest">Basé sur 124 trajets</p>
                    </div>
                </div>

                {/* Detailed Metrics */}
                <div className="lg:col-span-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-12 rounded-[3rem] border border-white dark:border-slate-800 shadow-soft">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-12 tracking-tight italic">Analyse de comportement</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between items-end mb-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[2px]">
                                    <div
                                        className={`h-full ${stat.color} rounded-full transition-all duration-1000 ease-out shadow-lg`}
                                        style={{ width: `${stat.progress}%` }}
                                    ></div>
                                </div>
                                <p className="text-[9px] text-primary/80 mt-4 font-black uppercase tracking-widest">PERFORMANCE : EXCELLENTE</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 bg-slate-50 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-6">
                        <div className="w-14 h-14 bg-white dark:bg-slate-900 shadow-soft rounded-2xl flex items-center justify-center text-primary group-hover:rotate-12 transition-transform">
                            <span className="material-symbols-outlined text-3xl">insights</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">
                            "Yassine fait partie des <span className="text-primary font-black">5% des passagers</span> les mieux notés ce mois-ci. Son badge 'Aventurier Responsable' sera bientôt débloqué."
                        </p>
                    </div>
                </div>
            </div>

            {/* Reviews Section - Modern Feed Style */}
            <div className="flex items-center justify-between mb-10 px-4">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic">Retours d'expérience</h2>
                <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-primary transition-all shadow-soft">
                    <span className="material-symbols-outlined text-lg">tune</span>
                    TRIER & FILTRER
                </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {reviews.map((review, i) => (
                    <div key={i} className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-soft hover:shadow-elevated hover:border-primary/40 transition-all group relative overflow-hidden">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                            <div className="flex items-center gap-6">
                                <div className="relative">
                                    <img
                                        src={review.avatar}
                                        alt={review.driver}
                                        className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/10 group-hover:scale-110 transition-transform"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-primary text-slate-900 p-1 rounded-lg border-4 border-white dark:border-slate-900 shadow-md">
                                        <span className="material-symbol-outlined text-[10px] font-black">check</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">{review.driver}</h4>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">{review.date}</p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <span key={star} className={`material-symbols-outlined text-xl ${star <= review.rating ? 'text-yellow-500 fill-1' : 'text-slate-200 dark:text-slate-800'}`}>star</span>
                                ))}
                            </div>
                        </div>

                        <div className="my-8 pl-0 md:pl-22">
                            <p className="text-xl font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic tracking-tight">
                                "{review.text}"
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pl-0 md:pl-22">
                            {review.tags.map((tag, idx) => (
                                <span key={idx} className="px-4 py-1.5 bg-primary/5 text-[9px] font-black text-primary uppercase tracking-[0.2em] rounded-full border border-primary/20 group-hover:bg-primary group-hover:text-slate-900 transition-all">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <button className="absolute bottom-10 right-10 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm">
                            <span className="material-symbols-outlined text-xl font-black">flag</span>
                        </button>
                    </div>
                ))}
            </div>

            {/* Pagination Style */}
            <div className="mt-20 flex justify-center">
                <div className="flex items-center gap-2 p-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur rounded-[1.5rem] border border-slate-100 dark:border-slate-800">
                    <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-soft text-slate-400">
                        <span className="material-symbols-outlined font-black">chevron_left</span>
                    </button>
                    <div className="flex gap-1 px-4">
                        <button className="w-10 h-10 bg-primary text-slate-900 font-black rounded-lg shadow-lg">1</button>
                        <button className="w-10 h-10 text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">2</button>
                        <button className="w-10 h-10 text-slate-400 font-black hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">3</button>
                    </div>
                    <button className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-soft text-slate-400">
                        <span className="material-symbols-outlined font-black">chevron_right</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PassengerReviews;
