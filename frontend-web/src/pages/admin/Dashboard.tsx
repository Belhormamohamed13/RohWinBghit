import { motion } from 'framer-motion'
import {
    Users,
    Car,
    TrendingUp,
    DollarSign,
    ArrowRight,
    ShieldCheck,
    ArrowUpRight,
    Activity
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            const response = await adminApi.getStats()
            return response.data.data
        },
        refetchInterval: 60000,
    })

    const cards = [
        {
            title: 'Utilisateurs Totaux',
            value: stats?.summary?.totalUsers || 0,
            icon: Users,
            color: 'primary',
            description: `${stats?.users?.new30d || 0} nouveaux ce mois`,
            link: '/admin/users'
        },
        {
            title: 'Trajets Publiés',
            value: stats?.summary?.totalTrips || 0,
            icon: Car,
            color: 'blue',
            description: `${stats?.trips?.today || 0} aujourd'hui`,
            link: '/admin/trips'
        },
        {
            title: 'Trajets Actifs',
            value: stats?.summary?.activeTrips || 0,
            icon: TrendingUp,
            color: 'purple',
            description: 'En cours ou planifiés',
            link: '/admin/trips'
        },
        {
            title: 'Chiffre d\'Affaires',
            value: `${(stats?.summary?.revenue || 0).toLocaleString()}`,
            icon: DollarSign,
            color: 'orange',
            description: 'Total des trajets terminés',
            link: '#'
        }
    ]

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        show: { opacity: 1, scale: 1, y: 0 }
    }

    return (
        <div className="space-y-12">
            {/* Stats Cards */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {cards.map((card, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 relative overflow-hidden group hover:bg-slate-800/60 transition-all duration-500 shadow-elevated"
                    >
                        <div className={`absolute top-0 right-0 p-12 bg-${card.color === 'primary' ? 'primary' : card.color + '-500'}/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 group-hover:bg-primary/20 transition-all`}></div>

                        <div className="flex flex-col h-full relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div className={`w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500 shadow-inner`}>
                                    <card.icon className="w-6 h-6 font-black" />
                                </div>
                                <Link to={card.link} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10">
                                    <ArrowUpRight className="w-4 h-4 text-primary" />
                                </Link>
                            </div>

                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-3">{card.title}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black text-white italic tracking-tighter">
                                        {isLoading ? '...' : card.value}
                                    </h3>
                                    {card.title.includes('Chiffre') && <span className="text-xs font-black text-primary uppercase">DZD</span>}
                                </div>
                                <div className="mt-8 flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 italic">
                                        <Activity className="w-3 h-3 text-primary animate-pulse" />
                                        {card.description}
                                    </p>
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary/30"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Visualizer / Chart Area Simulation */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-elevated relative overflow-hidden h-[400px] flex flex-col group">
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Performance <span className="text-primary italic">Plateforme</span></h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Fluctuation hebdomadaire des revenus</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="px-5 py-2 bg-primary/20 text-primary text-[10px] font-black uppercase rounded-xl border border-primary/20">Semaine</button>
                                <button className="px-5 py-2 hover:bg-white/5 text-slate-500 text-[10px] font-black uppercase rounded-xl transition-all">Mois</button>
                            </div>
                        </div>

                        {/* Simulation of a chart */}
                        <div className="flex-1 flex items-end justify-between gap-4 px-4 pb-4">
                            {[45, 60, 40, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="flex-1 group/bar relative">
                                    <div
                                        style={{ height: `${h}%` }}
                                        className="bg-white/5 rounded-2xl w-full group-hover/bar:bg-primary/40 transition-all duration-700 relative overflow-hidden"
                                    >
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: '100%' }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-primary/20 to-primary/60 opacity-0 group-hover/bar:opacity-100 transition-opacity"
                                        ></motion.div>
                                    </div>
                                    <p className="text-center mt-4 text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover/bar:text-primary transition-colors">Jour {i + 1}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-[2.5rem] p-8 border border-primary/10 flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-primary text-slate-900 rounded-[1.5rem] flex items-center justify-center shadow-lg shadow-primary/20">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white italic tracking-tight">Vérification prioritaire en attente</p>
                                <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-widest">3 nouveaux conducteurs demandent validation</p>
                            </div>
                        </div>
                        <Link to="/admin/vehicles" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-primary transition-all flex items-center gap-3">
                            Traiter Maintenant
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {/* Secondary Info Area */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-elevated">
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">Rôles <span className="text-primary italic">Actifs</span></h4>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Passagers</span>
                                </div>
                                <span className="text-xl font-black text-white group-hover:text-primary transition-colors italic">{stats?.users?.passengers || 0}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                                        <Car className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Conducteurs</span>
                                </div>
                                <span className="text-xl font-black text-white group-hover:text-primary transition-colors italic">{stats?.users?.drivers || 0}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">Vérifiés</span>
                                </div>
                                <span className="text-xl font-black text-primary italic">{stats?.users?.verified || 0}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-800/20 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 shadow-elevated">
                        <h4 className="text-lg font-black text-white italic uppercase tracking-tighter mb-8 border-b border-white/5 pb-4">Flux <span className="text-primary italic">Live</span></h4>
                        <div className="space-y-6">
                            {[
                                { status: 'Terminés', val: stats?.trips?.completed || 0, color: 'text-primary' },
                                { status: 'En cours', val: stats?.trips?.inProgress || 0, color: 'text-blue-400' },
                                { status: 'Prévus', val: stats?.trips?.scheduled || 0, color: 'text-slate-400' },
                                { status: 'Annulés', val: stats?.trips?.cancelled || 0, color: 'text-red-500' },
                            ].map((s, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.status}</span>
                                    <span className={`text-lg font-black italic ${s.color}`}>{s.val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
