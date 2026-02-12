import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const PassengerSpending: React.FC = () => {
    const { data: bookingsData, isLoading } = useQuery({
        queryKey: ['my-spending'],
        queryFn: async () => {
            const response = await bookingsApi.getMyBookings();
            return response.data.data;
        }
    });

    const bookings = bookingsData || [];
    const totalSpent = bookings.reduce((acc: number, b: any) => acc + (b.trip?.price || 0), 0);
    const lastTrip = bookings[0]?.trip?.price || 0;

    const stats = [
        { label: 'TOTAL DÉPENSÉ', value: totalSpent.toLocaleString(), unit: 'DZD', icon: 'payments', color: 'primary', gradient: 'from-primary/20 to-primary/5' },
        { label: 'DERNIER TRAJET', value: lastTrip.toLocaleString(), unit: 'DZD', icon: 'history', color: 'blue', gradient: 'from-blue-500/20 to-blue-600/5' },
        { label: 'RÉSERVATIONS', value: bookings.length, icon: 'confirmation_number', color: 'purple', gradient: 'from-purple-500/20 to-purple-600/5' },
    ];

    return (
        <div className="max-w-7xl mx-auto py-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                        Historique & <span className="text-primary italic">Portefeuille</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mt-2 leading-relaxed">
                        Visualisez vos dépenses et gérez l'ensemble de vos transactions financières.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest hover:scale-105 transition-all shadow-soft">
                        <span className="material-symbols-outlined text-lg">download</span>
                        Exporter (CSV)
                    </button>
                    <button className="flex items-center gap-3 px-8 py-4 bg-primary text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 active:scale-95">
                        <span className="material-symbols-outlined text-lg font-black">add_card</span>
                        Recharger
                    </button>
                </div>
            </div>

            {/* Wallet Dashboard Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                {/* Main Card - Big Balance */}
                <div className="lg:col-span-5 relative overflow-hidden bg-slate-900 dark:bg-slate-950 p-10 rounded-[2.5rem] shadow-elevated group min-h-[300px] flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-32 bg-primary/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                    <div className="absolute bottom-0 left-0 p-24 bg-white/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">PORTEFEUILLE NUMÉRIQUE</p>
                            <h3 className="text-5xl font-black text-white mt-4 tracking-tighter">4,500 <span className="text-lg font-normal text-white/40 ml-1">DZD</span></h3>
                        </div>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center text-white border border-white/10 group-hover:rotate-12 transition-transform">
                            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-6 mt-12">
                            <div className="text-white">
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">DÉPENSES DU MOIS</p>
                                <p className="text-xl font-black mt-1">12,450 DZD</p>
                            </div>
                            <div className="w-[1px] h-8 bg-white/10"></div>
                            <div className="text-white">
                                <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">ÉCONOMISÉ (EST.)</p>
                                <p className="text-xl font-black mt-1 text-primary">3,500 DZD</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secondary Grid Stats */}
                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {stats.map((stat, i) => (
                        <div key={i} className={`relative overflow-hidden bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-soft transition-all hover:shadow-elevated hover:scale-[1.03] group`}>
                            <div className="flex flex-col justify-between h-full relative z-10">
                                <div className={`w-14 h-14 rounded-2xl mb-6 shadow-lg flex items-center justify-center transition-transform group-hover:rotate-6 ${stat.color === 'primary' ? 'bg-primary text-slate-900' :
                                        stat.color === 'blue' ? 'bg-blue-500 text-white' :
                                            'bg-purple-500 text-white'
                                    }`}>
                                    <span className="material-symbols-outlined text-2xl font-black">{stat.icon}</span>
                                </div>
                                <div>
                                    <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
                                        {stat.value} {stat.unit && <span className="text-sm font-normal text-slate-400 ml-1">{stat.unit}</span>}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Advice Card */}
                    <div className="md:col-span-2 lg:col-span-3 bg-primary/10 dark:bg-primary/5 p-6 rounded-[2rem] border border-primary/20 flex items-center gap-6 group transition-all hover:bg-primary/15">
                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-[1.25rem] flex items-center justify-center text-primary shadow-soft group-hover:scale-110 transition-transform">
                            <span className="material-symbols-outlined text-3xl">savings</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">Excellent choix budgétaire !</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                                En préférant RohWinBghit, vous avez réduit vos frais de transport de <span className="text-primary font-black text-lg">30%</span> ce mois-ci par rapport aux taxis traditionnels.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transactions List - Premium Table */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-elevated overflow-hidden text-left">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight italic">Flux de trésorerie</h2>
                        <p className="text-slate-500 text-sm mt-1">Détails chronologiques de vos paiements et rechargements.</p>
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">filter_alt</span>
                        <select className="pl-10 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-xs font-black uppercase tracking-widest outline-none transition-all focus:ring-2 focus:ring-primary/30 appearance-none">
                            <option>Derniers 30 jours</option>
                            <option>Ce mois-ci</option>
                            <option>Cette année</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-10 py-5">DATE</th>
                                <th className="px-10 py-5">DÉSIGNATION / TRAJET</th>
                                <th className="px-10 py-5 text-right">MONTANT</th>
                                <th className="px-10 py-5 text-center">MODE / STATUT</th>
                                <th className="px-10 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                                            <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Chargement des flux...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : bookings.length > 0 ? bookings.map((booking: any) => (
                                <tr key={booking.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                {format(new Date(booking.created_at), 'dd MMM yyyy', { locale: fr })}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:scale-110 group-hover:bg-primary/20 group-hover:text-primary transition-all shadow-sm">
                                                <span className="material-symbols-outlined text-xl">route</span>
                                            </div>
                                            <div>
                                                <span className="text-base font-black text-slate-800 dark:text-slate-200 tracking-tight italic">
                                                    {booking.trip?.from_city} → {booking.trip?.to_city}
                                                </span>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">#TRX-9482{booking.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <span className="text-xl font-black text-slate-900 dark:text-white">
                                            -{booking.trip?.price || 0} <span className="text-[10px] opacity-40">DZD</span>
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50'
                                                }`}>
                                                {booking.status === 'confirmed' ? 'DÉBITÉ' : 'RESERVÉ'}
                                            </span>
                                            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">VISA / CIB</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <button className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 rounded-xl transition-all shadow-sm">
                                            <span className="material-symbols-outlined text-lg">receipt_long</span>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-10 py-24 text-center">
                                        <div className="flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                                                <span className="material-symbols-outlined text-slate-300 text-5xl">receipt</span>
                                            </div>
                                            <p className="text-slate-500 font-bold italic">Aucune transaction enregistrée pour le moment.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PassengerSpending;
