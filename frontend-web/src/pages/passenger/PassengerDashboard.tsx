import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { bookingsApi } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuthStore } from '../../store/authStore';

const PassengerDashboard: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    const { data: bookingsData } = useQuery({
        queryKey: ['my-bookings-dashboard'],
        queryFn: async () => {
            const response = await bookingsApi.getMyBookings();
            return response.data.data;
        }
    });

    const bookings = bookingsData || [];
    const upcomingBookings = bookings.filter((b: any) => b.status === 'confirmed' || b.status === 'pending').slice(0, 3);

    const stats = [
        { label: 'TRAJETS PARCOURUS', value: bookings.filter((b: any) => b.status === 'completed').length, icon: 'directions_run', subtext: '+3 ce mois-ci', subIcon: 'trending_up', color: 'blue', gradient: 'from-blue-500/20 to-blue-600/5' },
        { label: 'ÉCONOMIES RÉALISÉES', value: '15,400', unit: 'DZD', icon: 'savings', subtext: 'Impact : 45kg CO2', subIcon: 'eco', color: 'primary', gradient: 'from-primary/20 to-primary/5' },
        { label: 'NOTE PASSAGER', value: '4.9', icon: 'military_tech', subtext: '18 avis conducteurs', color: 'yellow', hasStars: true, gradient: 'from-yellow-500/20 to-yellow-600/5' },
    ];

    return (
        <div className="animate-fade-in pb-12">
            {/* Premium Welcome Section */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 dark:bg-slate-950 p-10 mb-12 shadow-elevated">
                <div className="absolute top-0 right-0 p-20 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 p-20 bg-secondary/10 blur-[80px] rounded-full translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Ravi de vous revoir,<br />
                            <span className="text-primary">{user?.firstName || 'Aventurier'} !</span> 👋
                        </h1>
                        <p className="text-slate-400 mt-4 text-lg font-medium max-w-md">
                            Votre prochaine destination n'attend que vous. Où allons-nous aujourd'hui ?
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/passenger/search')}
                        className="group bg-white text-slate-900 hover:bg-primary hover:text-white font-black py-5 px-10 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3"
                    >
                        <span className="material-symbols-outlined font-black group-hover:rotate-12 transition-transform">rocket_launch</span>
                        Réserver un trajet
                    </button>
                </div>
            </div>

            {/* Premium Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {stats.map((stat, i) => (
                    <div key={i} className={`relative overflow-hidden bg-gradient-to-br ${stat.gradient} dark:bg-slate-900/60 p-8 rounded-[2rem] border border-white dark:border-slate-800 shadow-soft transition-all hover:shadow-elevated hover:scale-[1.03] group`}>
                        <div className="flex items-start justify-between relative z-10">
                            <div>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                                <div className="flex items-center gap-3 mt-3">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                        {stat.value} {stat.unit && <span className="text-lg font-normal text-slate-400 ml-1">{stat.unit}</span>}
                                    </h3>
                                    {stat.hasStars && <span className="material-symbols-outlined text-yellow-500 text-2xl fill-1">star</span>}
                                </div>
                            </div>
                            <div className={`p-4 rounded-2xl shadow-lg transition-transform group-hover:rotate-6 ${stat.color === 'primary' ? 'bg-primary text-slate-900' :
                                    stat.color === 'blue' ? 'bg-blue-500 text-white' :
                                        'bg-yellow-500 text-white'
                                }`}>
                                <span className="material-symbols-outlined text-2xl font-black">{stat.icon}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex items-center gap-2 text-xs font-bold relative z-10">
                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full ${stat.color === 'primary' ? 'bg-primary/20 text-primary' :
                                    stat.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                                        'bg-yellow-500/20 text-yellow-600'
                                }`}>
                                {stat.subIcon && <span className="material-symbols-outlined text-[14px] font-black">{stat.subIcon}</span>}
                                {stat.subtext}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Upcoming Reservations - Premium Table */}
            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] border border-white dark:border-slate-800 shadow-elevated overflow-hidden mb-12">
                <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Réservations à venir</h2>
                        <p className="text-slate-500 text-sm mt-1">Vos prochains départs confirmés et en attente.</p>
                    </div>
                    <Link to="/passenger/bookings" className="flex items-center gap-2 text-primary text-sm font-black hover:gap-3 transition-all">
                        VOIR TOUT <span className="material-symbols-outlined text-sm font-black">arrow_forward</span>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <th className="px-8 py-5">DATE & HEURE</th>
                                <th className="px-8 py-5">ITINÉRAIRE</th>
                                <th className="px-8 py-5">CONDUCTEUR</th>
                                <th className="px-8 py-5 text-center">PRIX</th>
                                <th className="px-8 py-5 text-center">STATUT</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {upcomingBookings.length > 0 ? upcomingBookings.map((booking: any) => (
                                <tr key={booking.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <span className="material-symbols-outlined text-primary">calendar_month</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white">
                                                    {format(new Date(booking.trip?.departure_time), 'dd MMM, yyyy', { locale: fr })}
                                                </p>
                                                <p className="text-xs text-slate-500 font-bold mt-1 uppercase tracking-wider">
                                                    {format(new Date(booking.trip?.departure_time), 'HH:mm')}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full border-2 border-primary"></div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{booking.trip?.from_city}</p>
                                            </div>
                                            <div className="w-0.5 h-3 bg-slate-200 dark:bg-slate-700 ml-1"></div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{booking.trip?.to_city}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={booking.trip?.driver?.avatar_url || `https://ui-avatars.com/api/?name=${booking.trip?.driver?.first_name}+${booking.trip?.driver?.last_name}&background=2bee6c&color=fff&bold=true`}
                                                className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary/10"
                                                alt="Driver"
                                            />
                                            <div>
                                                <p className="text-sm font-black text-slate-900 dark:text-white">{booking.trip?.driver?.first_name} {booking.trip?.driver?.last_name?.charAt(0)}.</p>
                                                <div className="flex items-center gap-1 text-[10px] font-black text-yellow-600">
                                                    <span className="material-symbols-outlined text-[10px] fill-1">star</span> 4.8
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className="text-lg font-black text-slate-900 dark:text-white">
                                            {booking.trip?.price} <span className="text-[10px] opacity-40">DZD</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-amber-100 text-amber-700 border border-amber-200'
                                            }`}>
                                            {booking.status === 'confirmed' ? 'Confirmée' : 'En attente'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            onClick={() => navigate(`/trips/${booking.trip_id}`)}
                                            className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-primary hover:text-white rounded-xl transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">visibility</span>
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6">
                                                <span className="material-symbols-outlined text-slate-300 text-4xl">event_busy</span>
                                            </div>
                                            <p className="text-slate-500 font-bold italic">Aucune réservation à venir pour le moment.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Premium Mini-Banner Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-600 p-10 rounded-[2.5rem] flex items-center gap-8 group cursor-pointer shadow-elevated hover:scale-[1.02] transition-all">
                    <div className="absolute top-0 right-0 p-16 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-28 h-28 flex-shrink-0 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center p-6 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-white text-6xl font-light">explore</span>
                    </div>
                    <div className="relative z-10 text-white">
                        <h4 className="text-2xl font-black leading-tight">Envie d'évasion ce weekend ?</h4>
                        <p className="text-white/80 text-sm mt-3 font-medium">Découvrez les trajets populaires vers la côte dès maintenant.</p>
                        <button
                            onClick={() => navigate('/passenger/search')}
                            className="mt-6 px-6 py-2.5 bg-white text-primary font-black text-xs uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-lg"
                        >
                            EXPLORER
                        </button>
                    </div>
                </div>

                <div className="relative overflow-hidden bg-slate-900 p-10 rounded-[2.5rem] flex items-center gap-8 group cursor-pointer shadow-elevated hover:scale-[1.02] transition-all border border-slate-800">
                    <div className="absolute top-0 right-0 p-16 bg-white/5 blur-[50px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="w-28 h-28 flex-shrink-0 bg-slate-800 rounded-[2rem] flex items-center justify-center p-6 group-hover:scale-110 transition-transform ring-4 ring-slate-800">
                        <span className="material-symbols-outlined text-primary text-6xl font-light">share_reviews</span>
                    </div>
                    <div className="relative z-10 text-white">
                        <h4 className="text-2xl font-black leading-tight">Parrainez, économisez !</h4>
                        <p className="text-slate-400 text-sm mt-3 font-medium">Offrez 500 DZD à un ami et récupérez 500 DZD en crédit voyage.</p>
                        <button className="mt-6 px-6 py-2.5 bg-primary text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-lg">
                            PARTAGER
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PassengerDashboard;
