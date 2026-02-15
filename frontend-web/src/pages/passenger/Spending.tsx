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
        { label: 'TOTAL SPENT', value: totalSpent.toLocaleString(), unit: 'DZD', icon: 'payments', color: 'primary' },
        { label: 'LAST TRIP', value: lastTrip.toLocaleString(), unit: 'DZD', icon: 'history', color: 'blue' },
        { label: 'BOOKINGS', value: bookings.length, icon: 'confirmation_number', color: 'purple' },
    ];

    return (
        <div className="min-h-screen text-text-primary p-6 md:p-10 font-body">
            <div className="max-w-7xl mx-auto animate-fade-in pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                    <div>
                        <h1 className="text-4xl font-display text-text-primary tracking-wide">
                            HISTORY & <span className="text-sand-300 italic">WALLET</span>
                        </h1>
                        <p className="text-text-muted text-lg mt-2 font-body">
                            Track your travel expenses and manage transactions.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all font-mono text-white/60 hover:text-white">
                            <span className="material-symbols-outlined text-lg">download</span>
                            Export (CSV)
                        </button>
                        <button className="flex items-center gap-3 px-8 py-3 bg-sand-300 text-night-900 rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-glow active:scale-95">
                            <span className="material-symbols-outlined text-lg font-black">add_card</span>
                            Top Up
                        </button>
                    </div>
                </div>

                {/* Wallet Dashboard Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
                    {/* Main Card - Big Balance */}
                    <div className="lg:col-span-5 relative overflow-hidden bg-night-800 p-10 rounded-[2.5rem] border border-white/10 shadow-card group min-h-[300px] flex flex-col justify-between backdrop-blur-xl">
                        <div className="absolute top-0 right-0 p-32 bg-sand-300/10 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 p-24 bg-white/5 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 flex justify-between items-start">
                            <div>
                                <p className="text-sand-300 text-[10px] font-bold uppercase tracking-[0.3em] font-mono">DIGITAL WALLET</p>
                                <h3 className="text-5xl font-display text-text-primary mt-4 tracking-wide">4,500 <span className="text-sm font-bold text-text-muted ml-0.5 font-mono">DZD</span></h3>
                            </div>
                            <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[1.25rem] flex items-center justify-center text-sand-300 border border-white/10 group-hover:rotate-12 transition-transform">
                                <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mt-12">
                                <div className="text-text-primary">
                                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest font-mono">MONTHLY SPEND</p>
                                    <p className="text-xl font-display mt-1 tracking-wide">12,450 DZD</p>
                                </div>
                                <div className="w-[1px] h-8 bg-white/10"></div>
                                <div className="text-text-primary">
                                    <p className="text-text-muted text-[9px] font-bold uppercase tracking-widest font-mono">SAVED (EST.)</p>
                                    <p className="text-xl font-display mt-1 text-sand-300 tracking-wide">3,500 DZD</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Grid Stats */}
                    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                        {stats.map((stat, i) => (
                            <div key={i} className={`relative overflow-hidden bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 hover:border-sand-300/30 transition-all hover:bg-white/10 group`}>
                                <div className="flex flex-col justify-between h-full relative z-10">
                                    <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-transform group-hover:rotate-6 bg-night-900 border border-white/10 ${stat.color === 'primary' ? 'text-sand-300' : 'text-text-muted'
                                        }`}>
                                        <span className="material-symbols-outlined text-2xl font-black">{stat.icon}</span>
                                    </div>
                                    <div>
                                        <p className="text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] font-mono">{stat.label}</p>
                                        <h3 className="text-2xl font-display text-text-primary mt-1 tracking-wide">
                                            <span className={`${stat.color === 'primary' ? 'text-sand-300' : 'text-text-primary'}`}>{stat.value}</span>
                                            {stat.unit && <span className="text-xs font-bold text-text-muted ml-1 font-mono">{stat.unit}</span>}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Advice Card */}
                        <div className="md:col-span-2 lg:col-span-3 bg-sand-300/5 p-6 rounded-[2rem] border border-sand-300/10 flex items-center gap-6 group transition-all hover:bg-sand-300/10">
                            <div className="w-14 h-14 bg-night-900 rounded-[1.25rem] flex items-center justify-center text-sand-300 border border-white/10 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">savings</span>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-text-primary uppercase tracking-wide font-display">Great Choice!</p>
                                <p className="text-xs text-text-muted font-mono mt-1 leading-relaxed">
                                    By choosing RohWinBghit, you've saved <span className="text-sand-300 font-bold text-sm">30%</span> on transport this month compared to traditional taxis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transactions List - Premium Table */}
                <div className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 overflow-hidden text-left">
                    <div className="p-8 border-b border-white/5 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-display text-text-primary tracking-wide">TRANSACTIONS</h2>
                            <p className="text-text-muted text-xs font-mono mt-1 uppercase tracking-widest">Payment & Top-up history</p>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-lg">filter_alt</span>
                            <select className="pl-10 pr-8 py-2.5 bg-night-900 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest outline-none transition-all focus:border-sand-300 text-text-primary appearance-none font-mono">
                                <option>Last 30 Days</option>
                                <option>This Month</option>
                                <option>This Year</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 text-text-muted text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
                                    <th className="px-10 py-6">DATE</th>
                                    <th className="px-10 py-6">TRIP / DESC</th>
                                    <th className="px-10 py-6 text-right">AMOUNT</th>
                                    <th className="px-10 py-6 text-center">STATUS</th>
                                    <th className="px-10 py-6"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 border-4 border-sand-300/20 border-t-sand-300 rounded-full animate-spin mb-4"></div>
                                                <p className="text-text-muted font-mono tracking-widest uppercase text-[10px]">Loading...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : bookings.length > 0 ? bookings.map((booking: any) => (
                                    <tr key={booking.id} className="group hover:bg-white/5 transition-colors">
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm font-bold text-text-primary font-mono uppercase tracking-widest">
                                                    {format(new Date(booking.created_at), 'dd MMM yyyy', { locale: fr })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-muted group-hover:text-sand-300 transition-all border border-white/10">
                                                    <span className="material-symbols-outlined text-lg">route</span>
                                                </div>
                                                <div>
                                                    <span className="text-base font-display text-text-primary tracking-wide">
                                                        {booking.trip?.from_city} → {booking.trip?.to_city}
                                                    </span>
                                                    <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest font-mono mt-0.5">#TRX-{booking.id.split('-')[0]}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <span className="text-xl font-mono font-bold text-sand-300">
                                                -{booking.trip?.price || 0} <span className="text-[10px] text-text-muted font-normal">DZD</span>
                                            </span>
                                        </td>
                                        <td className="px-10 py-6 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border font-mono ${booking.status === 'confirmed'
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-sand-300/10 text-sand-300 border-sand-300/20'
                                                    }`}>
                                                    {booking.status === 'confirmed' ? 'PAID' : 'RESERVED'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-6 text-right">
                                            <button className="p-3 bg-white/5 text-text-muted hover:text-sand-300 hover:bg-white/10 rounded-xl transition-all">
                                                <span className="material-symbols-outlined text-lg">receipt_long</span>
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center">
                                                <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 text-text-muted">
                                                    <span className="material-symbols-outlined text-4xl">receipt</span>
                                                </div>
                                                <p className="text-text-muted font-mono uppercase tracking-widest text-xs">No transactions yet.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerSpending;
