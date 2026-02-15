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
            <div className="min-h-screen text-white p-6 md:p-10 font-body">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="font-bebas text-5xl tracking-wide text-accent-teal mb-2">
                            DRIVER WALLET
                        </h1>
                        <p className="text-white/60 font-body text-lg">
                            Financial overview and transaction history
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-mono hover:text-white text-white/60">
                            <Download size={16} />
                            Statement
                        </button>
                        <button className="flex items-center gap-2 px-8 py-3 bg-accent-teal text-night-900 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow active:scale-95 font-mono">
                            <Landmark size={16} />
                            Withdraw Funds
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* Main Balance Card */}
                    <div className="bg-gradient-to-r from-accent-teal/20 to-transparent p-8 rounded-2xl border border-accent-teal/30 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-teal/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-accent-teal/20 transition-all"></div>
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="p-3 bg-accent-teal/20 rounded-xl border border-accent-teal/20 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
                                <Wallet className="text-accent-teal" size={24} />
                            </div>
                            <span className="text-accent-teal text-[10px] font-bold uppercase tracking-widest bg-accent-teal/10 px-3 py-1 rounded-full border border-accent-teal/20">Available</span>
                        </div>
                        <p className="text-accent-teal/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-mono">Current Balance</p>
                        <div className="flex items-baseline gap-2 relative z-10">
                            <h2 className="text-white text-5xl font-bebas tracking-wide">
                                {isLoadingStats ? '...' : balance.toLocaleString()}
                            </h2>
                            <span className="text-sm font-bold text-accent-teal font-jetbrains">DZD</span>
                        </div>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <TrendingUp className="text-blue-500" size={24} />
                            </div>
                            <span className="text-green-400 text-xs font-mono font-bold bg-green-500/10 px-2 py-1 rounded border border-green-500/20">+12% vs last month</span>
                        </div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-mono">Total Revenue</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-white text-4xl font-bebas tracking-wide">
                                {isLoadingStats ? '...' : (stats?.totalRevenue || 0).toLocaleString()}
                            </h2>
                            <span className="text-xs font-bold text-white/40 font-jetbrains">DZD</span>
                        </div>
                    </div>

                    {/* Trips Completed */}
                    <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-xl hover:border-white/20 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                <ArrowUpRight className="text-purple-500" size={24} />
                            </div>
                        </div>
                        <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-1 font-mono">Completed Trips</p>
                        <div className="flex items-baseline gap-2">
                            <h2 className="text-white text-4xl font-bebas tracking-wide">
                                {isLoadingStats ? '...' : (stats?.completedTrips || 0)}
                            </h2>
                            <span className="text-xs font-bold text-white/40 font-jetbrains">TRIPS</span>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl">
                    <div className="p-8 border-b border-white/5 flex flex-wrap justify-between items-center gap-4">
                        <h3 className="text-2xl font-display text-white tracking-wide">
                            TRANSACTIONS
                        </h3>
                        <div className="flex gap-4">
                            <select className="bg-night-900 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest py-3 px-6 focus:ring-1 focus:ring-accent-teal outline-none cursor-pointer appearance-none font-mono hover:bg-white/5 transition-all">
                                <option>Last 30 Days</option>
                                <option>Last 3 Months</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        {isLoadingTransactions ? (
                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-accent-teal" size={40} /></div>
                        ) : transactions.length === 0 ? (
                            <div className="py-20 text-center font-bold text-white/20 italic font-mono">No transactions found.</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
                                        <th className="px-8 py-6">DATE & TIME</th>
                                        <th className="px-8 py-6">DESCRIPTION</th>
                                        <th className="px-8 py-6">REFERENCE</th>
                                        <th className="px-8 py-6 text-right">AMOUNT</th>
                                        <th className="px-8 py-6 text-center">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {transactions.map((tx: any) => (
                                        <tr key={tx.id} className="hover:bg-accent-teal/10 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <p className="text-sm font-bold text-white font-jetbrains">
                                                    {format(new Date(tx.date), 'dd MMM yyyy', { locale: fr })}
                                                </p>
                                                <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-1">
                                                    {format(new Date(tx.date), 'HH:mm')}
                                                </p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${tx.type === 'income' ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                        }`}>
                                                        {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-white font-display uppercase tracking-wide">{tx.from_city} → {tx.to_city}</p>
                                                        <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-0.5">{tx.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="font-mono font-bold text-[10px] text-white/40 bg-white/5 px-2 py-1 rounded border border-white/5 group-hover:border-white/10 transition-colors">
                                                    #{tx.id.split('-')[0]}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right font-jetbrains">
                                                <p className={`text-lg font-bold tracking-tight ${tx.type === 'income' ? 'text-green-400' : 'text-white'}`}>
                                                    {tx.type === 'income' ? '+' : '-'}{parseFloat(tx.amount).toLocaleString()} <span className="text-[10px] text-white/40 font-normal">DZD</span>
                                                </p>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center gap-2 text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest font-mono border ${tx.status === 'Complété'
                                                        ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/20'
                                                        : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                        }`}>
                                                        <Circle size={6} fill="currentColor" className={tx.status === 'Complété' ? 'animate-pulse' : ''} />
                                                        {tx.status === 'Complété' ? 'COMPLETED' : tx.status}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default DriverWallet;
