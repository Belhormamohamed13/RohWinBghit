import React from 'react';
import DriverLayout from '../../components/layout/DriverLayout';
import {
    Wallet,
    ArrowUpRight,
    ArrowDownLeft,
    TrendingUp,
    Download,
    Landmark,
    Circle,
    Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { driverApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DriverWallet: React.FC = () => {
    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['driver-stats'],
        queryFn: async () => {
            const response = await driverApi.getStats();
            return response.data.data;
        }
    });

    const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery({
        queryKey: ['driver-transactions'],
        queryFn: async () => {
            const response = await driverApi.getTransactions();
            return response.data.data;
        }
    });

    const transactions = transactionsData || [];
    const balance = stats?.totalNetRevenue || 0;

    return (
        <DriverLayout>
            <header className="flex flex-wrap justify-between items-center gap-4 mb-10">
                <div className="flex flex-col gap-1">
                    <h2 className="text-[#0d1b12] dark:text-white text-3xl font-black tracking-tight">Portefeuille Chauffeur</h2>
                    <p className="text-[#4c9a66] text-sm font-medium">Consultez vos revenus et effectuez vos demandes de retrait.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl transition-all active:scale-95">
                        <Download size={18} />
                        Relevé Mensuel
                    </button>
                    <button className="flex items-center gap-2 px-6 py-4 bg-[#13ec6d] text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-[#10cc00] transition-all shadow-xl shadow-[#13ec6d]/20 active:scale-95">
                        <Landmark size={18} />
                        Retirer mes gains
                    </button>
                </div>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#13ec6d]/5 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform"></div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className="p-4 bg-[#13ec6d]/10 rounded-2xl">
                            <Wallet className="text-[#13ec6d]" size={28} />
                        </div>
                        <span className="text-[#13ec6d] text-[10px] font-black uppercase tracking-widest bg-[#13ec6d]/10 px-3 py-1.5 rounded-full border border-[#13ec6d]/20 shadow-sm">Disponible</span>
                    </div>
                    <p className="text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Solde actuel</p>
                    <div className="flex items-baseline gap-3 relative z-10">
                        <p className="text-[#0d1b12] dark:text-white text-5xl font-black tracking-tighter">
                            {isLoadingStats ? '...' : balance.toLocaleString()}
                        </p>
                        <p className="text-xl font-black text-[#4c9a66]">DZD</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                            <TrendingUp className="text-blue-600 dark:text-blue-400" size={28} />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-emerald-500 text-xs font-black">+12%</span>
                            <span className="text-[10px] text-[#4c9a66] font-bold uppercase tracking-tighter">vs mois dernier</span>
                        </div>
                    </div>
                    <p className="text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Total gagné</p>
                    <div className="flex items-baseline gap-3">
                        <p className="text-[#0d1b12] dark:text-white text-5xl font-black tracking-tighter">
                            {isLoadingStats ? '...' : (stats?.totalRevenue || 0).toLocaleString()}
                        </p>
                        <p className="text-xl font-black text-[#4c9a66]">DZD</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm group">
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                            <ArrowUpRight className="text-purple-600 dark:text-purple-400" size={28} />
                        </div>
                    </div>
                    <p className="text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em] mb-2">Trajets complétés</p>
                    <div className="flex items-baseline gap-3">
                        <p className="text-[#0d1b12] dark:text-white text-5xl font-black tracking-tighter">
                            {isLoadingStats ? '...' : (stats?.completedTrips || 0)}
                        </p>
                        <p className="text-xl font-black text-[#4c9a66]">Total</p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[3rem] overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                    <h3 className="text-[#0d1b12] dark:text-white text-2xl font-black tracking-tight underline decoration-[#13ec6d] decoration-4 underline-offset-8">Historique des transactions</h3>
                    <div className="flex gap-4">
                        <select className="bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest py-3 px-6 focus:ring-2 focus:ring-[#13ec6d]/50 cursor-pointer appearance-none">
                            <option>30 derniers jours</option>
                            <option>3 derniers mois</option>
                            <option>Cette année</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    {isLoadingTransactions ? (
                        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-[#13ec6d]" size={40} /></div>
                    ) : transactions.length === 0 ? (
                        <div className="py-20 text-center font-bold text-slate-400 italic">Aucune transaction trouvée.</div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-6 text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em]">Date & Heure</th>
                                    <th className="px-8 py-6 text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em]">Description</th>
                                    <th className="px-8 py-6 text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em]">Référence</th>
                                    <th className="px-8 py-6 text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em] text-right">Montant</th>
                                    <th className="px-8 py-6 text-[#4c9a66] text-[10px] font-black uppercase tracking-[0.2em] text-center">Statut</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                {transactions.map((tx: any) => (
                                    <tr key={tx.id} className="hover:bg-[#13ec6d]/5 transition-all duration-300">
                                        <td className="px-8 py-8">
                                            <p className="text-sm font-black text-[#0d1b12] dark:text-white">
                                                {format(new Date(tx.date), 'dd MMM yyyy', { locale: fr })}
                                            </p>
                                            <p className="text-[10px] text-[#4c9a66] font-black uppercase tracking-tighter">
                                                {format(new Date(tx.date), 'HH:mm')}
                                            </p>
                                        </td>
                                        <td className="px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className={`size-10 rounded-2xl flex items-center justify-center shadow-sm ${tx.type === 'income' ? 'bg-[#13ec6d]/10 text-[#13ec6d]' : 'bg-red-500/10 text-red-500'}`}>
                                                    {tx.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-black text-[#0d1b12] dark:text-white">{tx.from_city} → {tx.to_city}</p>
                                                    <p className="text-[10px] text-[#4c9a66] font-black uppercase tracking-widest">{tx.category}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8">
                                            <span className="font-black text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest group-hover:bg-[#13ec6d]/20 transition-colors">
                                                #{tx.id.split('-')[0]}
                                            </span>
                                        </td>
                                        <td className="px-8 py-8 text-right">
                                            <p className={`text-base font-black tracking-tight ${tx.type === 'income' ? 'text-[#0d1b12] dark:text-white' : 'text-red-500'}`}>
                                                {tx.type === 'income' ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()} <span className="text-[10px] text-[#4c9a66]">DZD</span>
                                            </p>
                                        </td>
                                        <td className="px-8 py-8 text-center">
                                            <span className={`inline-flex items-center gap-2 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.1em] ${tx.status === 'Complété'
                                                ? 'bg-[#13ec6d]/10 text-[#13ec6d] border border-[#13ec6d]/20 shadow-sm shadow-[#13ec6d]/5'
                                                : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                <Circle size={6} fill="currentColor" className="animate-pulse" />
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DriverLayout>
    );
};

export default DriverWallet;
