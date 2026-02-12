import { useState, useEffect } from 'react';
import DriverLayout from '../../components/layout/DriverLayout';
import { Link, useNavigate } from 'react-router-dom';
import { driverApi } from '../../services/api';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const DriverDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const response = await driverApi.getStats();
                setData(response.data.data);
            } catch (error) {
                console.error('Error loading dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <DriverLayout>
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
                    <div className="w-16 h-16 border-4 border-[#13ec6d]/10 border-t-[#13ec6d] rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">SYNCING DASHBOARD...</p>
                </div>
            </DriverLayout>
        );
    }

    const stats = [
        {
            label: 'REVENU TOTAL',
            value: data?.totalRevenue?.toLocaleString() || '0',
            unit: 'DZD',
            trend: '+12% ce mois',
            icon: 'account_balance_wallet',
            color: 'primary',
            gradient: 'from-[#13ec6d]/20 to-[#13ec6d]/2'
        },
        {
            label: 'TRAJETS RÉALISÉS',
            value: data?.totalTrips?.toString() || '0',
            unit: 'Trajets',
            trend: `${data?.completedTrips || 0} terminés`,
            icon: 'route',
            color: 'blue',
            gradient: 'from-blue-500/20 to-blue-500/2'
        },
        {
            label: 'NOTE CONDUCTEUR',
            value: data?.avgRating || '4.9',
            unit: '/ 5',
            trend: 'Rang : Pro',
            icon: 'military_tech',
            color: 'yellow',
            gradient: 'from-yellow-500/20 to-yellow-500/2'
        },
    ];

    const upcomingTrips = data?.upcomingTrips || [];

    return (
        <DriverLayout>
            <div className="animate-fade-in">
                {/* Metrics Grid - Premium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {stats.map((stat, index) => (
                        <div key={index} className={`relative overflow-hidden bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white dark:border-slate-800 shadow-soft hover:shadow-elevated hover:scale-[1.03] transition-all group`}>
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ${stat.color === 'primary' ? 'bg-[#13ec6d] text-slate-900' :
                                    stat.color === 'blue' ? 'bg-blue-500 text-white' :
                                        'bg-yellow-500 text-white'
                                    }`}>
                                    <span className="material-symbols-outlined font-black text-2xl">{stat.icon}</span>
                                </div>
                                <span className={`text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${index === 0 ? 'bg-[#13ec6d]/10 text-[#13ec6d]' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="mt-8 relative z-10">
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                                    {stat.value} <span className="text-sm font-normal text-slate-400 ml-1">{stat.unit}</span>
                                </h3>
                            </div>
                            <div className={`absolute -right-8 -bottom-8 w-40 h-40 bg-gradient-to-br ${stat.gradient} blur-3xl rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700`}></div>
                        </div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Trips Table Section */}
                    <div className="lg:col-span-8 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-[3rem] border border-white dark:border-slate-800 shadow-elevated overflow-hidden">
                        <div className="p-10 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50">
                            <div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight italic flex items-center gap-3">
                                    <span className="material-symbols-outlined text-[#13ec6d] font-black text-3xl">timer</span>
                                    Prochains Départs
                                </h2>
                                <p className="text-slate-500 text-xs mt-1 font-medium uppercase tracking-widest">GÉREZ VOS TRAJETS PLANIFIÉS</p>
                            </div>
                            <Link to="/driver/history" className="bg-slate-100 dark:bg-slate-800 px-6 py-3 rounded-2xl text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:bg-[#13ec6d] transition-all active:scale-95 shadow-soft">
                                Historique
                            </Link>
                        </div>

                        <div className="overflow-x-auto text-left">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-slate-50/50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                        <th className="px-10 py-6">DATE & HEURE</th>
                                        <th className="px-10 py-6">ITINÉRAIRE</th>
                                        <th className="px-10 py-6">REMPLISSAGE</th>
                                        <th className="px-10 py-6 text-center">STATUS</th>
                                        <th className="px-10 py-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                    {upcomingTrips.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[2rem] flex items-center justify-center mb-6">
                                                        <span className="material-symbols-outlined text-slate-300 text-5xl">event_busy</span>
                                                    </div>
                                                    <p className="text-slate-500 font-black italic">Aucun trajet planifié pour le moment.</p>
                                                    <Link to="/driver/publish" className="mt-8 bg-[#13ec6d] text-slate-900 px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#13ec6d]/20 hover:scale-[1.03] transition-all">
                                                        Créer un trajet
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : upcomingTrips.map((trip: any) => (
                                        <tr key={trip.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="px-10 py-8">
                                                <p className="text-base font-black text-slate-900 dark:text-white capitalize tracking-tighter">
                                                    {format(new Date(trip.departure_time), 'EEEE, HH:mm', { locale: fr })}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                                    {format(new Date(trip.departure_time), 'dd MMMM yyyy', { locale: fr })}
                                                </p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full border-2 border-[#13ec6d]"></div>
                                                        <p className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{trip.from_wilaya_name || 'Wilaya ' + trip.from_wilaya_id}</p>
                                                    </div>
                                                    <div className="w-[1px] h-3 bg-slate-200 dark:bg-slate-700 ml-1 border-dotted border-l-2"></div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-[#13ec6d]"></div>
                                                        <p className="text-sm font-black text-slate-700 dark:text-slate-300 tracking-tight">{trip.to_wilaya_name || 'Wilaya ' + trip.to_wilaya_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-900 overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 shadow-sm">
                                                                <img src={`https://ui-avatars.com/api/?name=P${i}&background=random`} className="w-full h-full object-cover" alt="User" />
                                                            </div>
                                                        ))}
                                                        <div className="w-8 h-8 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[9px] font-black">
                                                            +1
                                                        </div>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-[1px] max-w-[120px]">
                                                        <div
                                                            className="h-full bg-[#13ec6d] rounded-full shadow-lg"
                                                            style={{ width: `${(trip.passengersCount / trip.total_seats) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${trip.status === 'scheduled' || trip.status === 'active' ? 'bg-[#13ec6d]/10 text-[#13ec6d] border border-[#13ec6d]/20' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {trip.status === 'scheduled' || trip.status === 'active' ? 'En ligne' : 'Inactif'}
                                                    </span>
                                                    {trip.pendingCount > 0 && (
                                                        <span className="animate-pulse bg-amber-500 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter">
                                                            {trip.pendingCount} EN ATTENTE
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => navigate(`/driver/trips/${trip.id}/manage`)}
                                                    className="w-12 h-12 flex items-center justify-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.25rem] shadow-xl hover:scale-110 transition-all active:scale-95"
                                                >
                                                    <span className="material-symbols-outlined font-black">manage_accounts</span>
                                                </button>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Side Cards Section */}
                    <div className="lg:col-span-4 flex flex-col gap-10">
                        {/* Compact Financial Card */}
                        <div className="bg-slate-900 dark:bg-slate-950 p-10 rounded-[3rem] shadow-elevated relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-32 bg-[#13ec6d]/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-[#13ec6d]/30"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">PORTEFEUILLE PRO</span>
                                    <span className="material-symbols-outlined text-[#13ec6d] text-2xl group-hover:rotate-12 transition-transform">trending_up</span>
                                </div>
                                <div>
                                    <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Solde disponible</p>
                                    <h3 className="text-5xl font-black text-white tracking-tighter">
                                        {(data?.totalRevenue || 0).toLocaleString()} <span className="text-xs font-normal text-white/40 ml-1">DZD</span>
                                    </h3>
                                </div>
                                <div className="mt-12 flex gap-4">
                                    <Link to="/driver/wallet" className="flex-1 bg-[#13ec6d] text-slate-900 text-center font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-[#13ec6d]/20 hover:scale-[1.03] transition-all active:scale-95">
                                        Retirer Fonds
                                    </Link>
                                    <button className="w-14 h-14 bg-white/10 backdrop-blur-xl text-white rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                        <span className="material-symbols-outlined font-black">history</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Status Card */}
                        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl p-10 rounded-[3rem] border border-white dark:border-slate-800 shadow-soft group cursor-pointer hover:border-[#13ec6d]/40 transition-all">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                                    <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400" className="w-12 h-12 rounded-xl object-cover" alt="Car" />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-none">VW Golf 8 R-Line</h4>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2 italic flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-[#13ec6d] rounded-full inline-block"></span> VÉHICULE VÉRIFIÉ
                                    </p>
                                </div>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-dotted border-slate-200 dark:border-slate-700 group-hover:bg-white dark:group-hover:bg-slate-800 transition-colors">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <span>STATUT DOCUMENTS</span>
                                    <span className="text-primary tracking-tighter">100% OK</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full mt-3 overflow-hidden p-[1px]">
                                    <div className="h-full bg-primary rounded-full shadow-lg" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <Link to="/driver/vehicles" className="mt-8 text-[10px] font-black text-slate-900 dark:text-white flex items-center justify-center gap-3 group/link uppercase tracking-[0.2em] hover:text-primary transition-colors">
                                Gérer mes véhicules
                                <span className="material-symbols-outlined text-lg font-black group-hover/link:translate-x-1 transition-transform">arrow_forward</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </DriverLayout>
    );
};

export default DriverDashboard;
