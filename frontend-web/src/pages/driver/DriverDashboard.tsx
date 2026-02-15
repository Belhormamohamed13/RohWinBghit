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
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 bg-night-900 rounded-[3rem] border border-dashed border-border/50">
                    <div className="w-16 h-16 border-4 border-accent-teal/10 border-t-accent-teal rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-text-dim uppercase tracking-[0.4em] font-mono">SYNCING DASHBOARD...</p>
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
            color: 'teal',
            gradient: 'from-accent-teal/20 to-accent-teal/2'
        },
        {
            label: 'TRAJETS RÉALISÉS',
            value: data?.totalTrips?.toString() || '0',
            unit: 'Trajets',
            trend: `${data?.completedTrips || 0} terminés`,
            icon: 'route',
            color: 'blue',
            gradient: 'from-accent-blue/20 to-accent-blue/2'
        },
        {
            label: 'NOTE CONDUCTEUR',
            value: data?.avgRating || '4.9',
            unit: '/ 5',
            trend: 'Rang : Pro',
            icon: 'military_tech',
            color: 'sand',
            gradient: 'from-sand-300/20 to-sand-300/2'
        },
    ];

    const upcomingTrips = data?.upcomingTrips || [];

    return (
        <DriverLayout>
            <div className="animate-fade-up font-body text-text-primary">
                {/* Metrics Grid - Premium Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {stats.map((stat, index) => (
                        <div key={index} className={`relative overflow-hidden bg-night-800/60 backdrop-blur-xl p-10 rounded-[2.5rem] border border-border shadow-card hover:shadow-elevated hover:scale-[1.03] hover:border-accent-teal/30 transition-all group`}>
                            <div className="flex justify-between items-start relative z-10">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 border border-white/10 ${stat.color === 'teal' ? 'bg-accent-teal text-night-900' :
                                        stat.color === 'blue' ? 'bg-accent-blue text-white' :
                                            'bg-sand-300 text-night-900'
                                    }`}>
                                    <span className="material-symbols-outlined font-black text-2xl">{stat.icon}</span>
                                </div>
                                <span className={`text-[9px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest font-mono ${index === 0 ? 'bg-accent-teal/10 text-accent-teal border border-accent-teal/20' : 'bg-night-900 text-text-muted border border-border'
                                    }`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="mt-8 relative z-10">
                                <p className="text-text-dim text-[10px] font-bold uppercase tracking-[0.2em] mb-2 font-mono">{stat.label}</p>
                                <h3 className="text-4xl font-display text-text-primary tracking-wide">
                                    {stat.value} <span className="text-sm font-bold font-sans text-text-muted ml-1 opacity-60">{stat.unit}</span>
                                </h3>
                            </div>
                            <div className={`absolute -right-8 -bottom-8 w-40 h-40 bg-gradient-to-br ${stat.gradient} blur-3xl rounded-full opacity-50 group-hover:scale-125 transition-transform duration-700`}></div>
                        </div>
                    ))}
                </div>

                {/* Main Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Trips Table Section */}
                    <div className="lg:col-span-8 bg-night-800/60 backdrop-blur-xl rounded-[3rem] border border-border shadow-card overflow-hidden">
                        <div className="p-10 flex items-center justify-between border-b border-border">
                            <div>
                                <h2 className="text-2xl font-display text-text-primary tracking-wide flex items-center gap-3">
                                    <span className="material-symbols-outlined text-accent-teal font-black text-3xl">timer</span>
                                    PROCHAINS DÉPARTS
                                </h2>
                                <p className="text-text-dim text-[10px] mt-1 font-bold uppercase tracking-[0.2em] font-mono">GÉREZ VOS TRAJETS PLANIFIÉS</p>
                            </div>
                            <Link to="/driver/history" className="bg-night-900 px-6 py-3 rounded-xl text-[10px] font-bold text-text-primary uppercase tracking-widest hover:bg-night-800 hover:text-accent-teal transition-all active:scale-95 shadow-sm border border-border group border-l-4 border-l-accent-teal/50">
                                Historique
                            </Link>
                        </div>

                        <div className="overflow-x-auto text-left">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-night-900/50 text-text-dim text-[10px] font-bold uppercase tracking-[0.2em] font-mono">
                                        <th className="px-10 py-6">DATE & HEURE</th>
                                        <th className="px-10 py-6">ITINÉRAIRE</th>
                                        <th className="px-10 py-6">REMPLISSAGE</th>
                                        <th className="px-10 py-6 text-center">STATUS</th>
                                        <th className="px-10 py-6"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {upcomingTrips.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-10 py-24 text-center">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-20 h-20 bg-night-900 rounded-[1.5rem] flex items-center justify-center mb-6 border border-border shadow-inner">
                                                        <span className="material-symbols-outlined text-text-dim text-5xl">event_busy</span>
                                                    </div>
                                                    <p className="text-text-muted font-bold italic">Aucun trajet planifié pour le moment.</p>
                                                    <Link to="/driver/publish" className="mt-8 bg-accent-teal text-night-900 px-8 py-4 rounded-xl font-bold text-xs uppercase tracking-widest shadow-glow hover:scale-[1.03] transition-all flex items-center gap-2">
                                                        <span className="material-symbols-outlined font-black text-lg">add_circle</span>
                                                        Créer un trajet
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : upcomingTrips.map((trip: any) => (
                                        <tr key={trip.id} className="group hover:bg-night-900/40 transition-colors">
                                            <td className="px-10 py-8">
                                                <p className="text-base font-bold text-text-primary capitalize tracking-tight font-display text-xl">
                                                    {format(new Date(trip.departure_time), 'EEEE, HH:mm', { locale: fr })}
                                                </p>
                                                <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 font-mono">
                                                    {format(new Date(trip.departure_time), 'dd MMMM yyyy', { locale: fr })}
                                                </p>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full border-2 border-accent-teal"></div>
                                                        <p className="text-sm font-bold text-text-primary tracking-tight">{trip.from_wilaya_name || 'Wilaya ' + trip.from_wilaya_id}</p>
                                                    </div>
                                                    <div className="w-[1px] h-3 bg-border ml-1 border-dotted border-l-2 border-l-text-dim"></div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-accent-teal"></div>
                                                        <p className="text-sm font-bold text-text-primary tracking-tight">{trip.to_wilaya_name || 'Wilaya ' + trip.to_wilaya_id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex flex-col gap-3">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2, 3].map(i => (
                                                            <div key={i} className="w-8 h-8 rounded-lg bg-night-700 border-2 border-night-800 overflow-hidden ring-2 ring-night-900 shadow-sm relative">
                                                                <img src={`https://ui-avatars.com/api/?name=P${i}&background=random`} className="w-full h-full object-cover opacity-80" alt="User" />
                                                            </div>
                                                        ))}
                                                        <div className="w-8 h-8 rounded-lg bg-night-900 text-text-primary border-2 border-night-800 flex items-center justify-center text-[9px] font-black ring-2 ring-night-900">
                                                            +1
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`h-1.5 w-24 bg-night-900 rounded-full overflow-hidden p-[1px] border border-border`}>
                                                            <div
                                                                className={`h-full ${trip.available_seats === 0 ? 'bg-accent-red' : 'bg-accent-teal'} rounded-full shadow-lg transition-all duration-500`}
                                                                style={{ width: `${Math.min(100, ((trip.total_seats - trip.available_seats) / (trip.total_seats || 1)) * 100)}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className={`text-[9px] font-bold uppercase tracking-tighter font-mono ${trip.available_seats === 0 ? 'text-accent-red' : 'text-text-dim'}`}>
                                                            {trip.available_seats === 0 ? 'COMPLET' : `${trip.available_seats} DISPOS`}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest font-mono border ${trip.status === 'scheduled' || trip.status === 'active' ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/20' : 'bg-accent-orange/10 text-accent-orange border-accent-orange/20'
                                                        }`}>
                                                        {trip.status === 'scheduled' || trip.status === 'active' ? 'En ligne' : 'Inactif'}
                                                    </span>
                                                    {trip.pendingCount > 0 && (
                                                        <span className="animate-pulse bg-accent-orange/20 text-accent-orange border border-accent-orange/30 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-tighter">
                                                            {trip.pendingCount} EN ATTENTE
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <button
                                                    onClick={() => navigate(`/driver/trips/${trip.id}/manage`)}
                                                    className="w-12 h-12 flex items-center justify-center bg-night-900 text-text-primary rounded-xl shadow-lg border border-border hover:border-accent-teal hover:text-accent-teal transition-all active:scale-95"
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
                        <div className="bg-night-900 p-10 rounded-[3rem] shadow-card relative overflow-hidden group border border-border">
                            <div className="absolute top-0 right-0 p-32 bg-accent-teal/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 transition-all group-hover:bg-accent-teal/20"></div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="flex items-center justify-between mb-10">
                                    <span className="text-text-dim text-[10px] font-bold uppercase tracking-[0.3em] font-mono">PORTEFEUILLE PRO</span>
                                    <span className="material-symbols-outlined text-accent-teal text-2xl group-hover:rotate-12 transition-transform">trending_up</span>
                                </div>
                                <div>
                                    <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-2 font-mono">Solde disponible</p>
                                    <h3 className="text-5xl font-display text-text-primary tracking-wide">
                                        {(data?.totalRevenue || 0).toLocaleString()} <span className="text-xs font-normal text-text-dim ml-1 font-sans">DZD</span>
                                    </h3>
                                </div>
                                <div className="mt-12 flex gap-4">
                                    <Link to="/driver/wallet" className="flex-1 bg-accent-teal text-night-900 text-center font-black py-4 rounded-xl text-[10px] uppercase tracking-widest shadow-glow hover:scale-[1.03] transition-all active:scale-95 border border-accent-teal/50">
                                        Retirer Fonds
                                    </Link>
                                    <button className="w-14 h-14 bg-night-800 text-text-primary rounded-xl border border-border flex items-center justify-center hover:bg-night-700 hover:text-accent-teal transition-all">
                                        <span className="material-symbols-outlined font-black">history</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Status Card */}
                        <div className="bg-night-800/60 backdrop-blur-xl p-10 rounded-[3rem] border border-border shadow-card group cursor-pointer hover:border-accent-teal/40 transition-all hover:bg-night-800/80">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="w-16 h-16 bg-night-900 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform border border-border">
                                    <span className="material-symbols-outlined text-text-muted text-3xl">directions_car</span>
                                </div>
                                <div>
                                    <h4 className="text-xl font-display text-text-primary tracking-wide leading-none">VW Golf 8 R-Line</h4>
                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-[0.2em] mt-2 italic flex items-center gap-2 font-mono">
                                        <span className="w-1.5 h-1.5 bg-accent-teal rounded-full inline-block shadow-[0_0_8px_#1adfb8]"></span> VÉHICULE VÉRIFIÉ
                                    </p>
                                </div>
                            </div>
                            <div className="bg-night-900/50 p-6 rounded-2xl border border-dashed border-border group-hover:border-accent-teal/30 transition-colors">
                                <div className="flex justify-between items-center text-[10px] font-bold text-text-dim uppercase tracking-widest font-mono">
                                    <span>STATUT DOCUMENTS</span>
                                    <span className="text-accent-teal tracking-tighter">100% OK</span>
                                </div>
                                <div className="h-1.5 w-full bg-night-900 rounded-full mt-3 overflow-hidden p-[1px] border border-border/50">
                                    <div className="h-full bg-accent-teal rounded-full shadow-lg" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <Link to="/driver/vehicles" className="mt-8 text-[10px] font-bold text-text-primary flex items-center justify-center gap-3 group/link uppercase tracking-[0.2em] hover:text-accent-teal transition-colors font-mono">
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
