import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    MoreVertical,
    Shield,
    User as UserIcon,
    Car,
    CheckCircle,
    Mail,
    Loader2,
    Clock,
    Filter,
    ArrowUpRight,
    UserCheck,
    Smartphone
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const UsersManagement = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const queryClient = useQueryClient()

    const { data: users, isLoading } = useQuery({
        queryKey: ['admin-users', searchTerm, roleFilter],
        queryFn: async () => {
            const response = await adminApi.getUsers({
                query: searchTerm || undefined,
                role: roleFilter === 'all' ? undefined : roleFilter
            })
            return response.data.data
        },
    })

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }: { id: string; role: string }) => adminApi.updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            toast.success('Rôle mis à jour')
        }
    })

    const verifyUserMutation = useMutation({
        mutationFn: (id: string) => adminApi.verifyUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] })
            toast.success('Utilisateur vérifié par le Hub')
        }
    })

    const getRoleBadgeStyles = (role: string) => {
        switch (role) {
            case 'admin': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            case 'driver': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            default: return 'bg-primary/10 text-primary border-primary/20'
        }
    }

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return Shield
            case 'driver': return Car
            default: return UserIcon
        }
    }

    return (
        <div className="space-y-10">
            {/* Header / Tools Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic">
                        Gestion des <span className="text-primary italic">Utilisateurs</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3 italic">Contrôle global des comptes et privilèges</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="RECHERCHE PAR NOM / EMAIL..."
                            className="pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-primary/30 outline-none transition-all w-72 text-[10px] font-black uppercase tracking-widest text-white placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative group">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            className="pl-12 pr-10 py-4 bg-white/5 border border-white/5 rounded-2xl focus:border-primary/30 outline-none transition-all text-[10px] font-black uppercase tracking-widest text-white appearance-none cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="all" className="bg-slate-900">TOUS LES RÔLES</option>
                            <option value="passenger" className="bg-slate-900">PASSAGERS</option>
                            <option value="driver" className="bg-slate-900">CONDUCTEURS</option>
                            <option value="admin" className="bg-slate-900">ADMINISTRATEURS</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Area */}
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-elevated overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-6">
                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                        <p className="text-[10px] font-black text-slate-500 tracking-[0.3em] uppercase italic">Indexation de la base de données...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] italic">
                                    <th className="px-10 py-6">IDENTITÉ</th>
                                    <th className="px-10 py-6">PRIVILÈGES</th>
                                    <th className="px-10 py-6">CRÉÉ LE</th>
                                    <th className="px-10 py-6">SÉCURITÉ</th>
                                    <th className="px-10 py-6 text-right">GESTION</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                <AnimatePresence mode="popLayout">
                                    {users?.map((user: any) => {
                                        const RoleIcon = getRoleIcon(user.role)
                                        return (
                                            <motion.tr
                                                key={user.id}
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="group hover:bg-white/5 transition-all"
                                            >
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-6">
                                                        <div className="relative">
                                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center font-black text-primary text-xl shadow-lg ring-2 ring-transparent group-hover:ring-primary/40 transition-all">
                                                                {user.firstName[0]}{user.lastName[0]}
                                                            </div>
                                                            {user.isVerified && (
                                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary text-slate-900 rounded-lg flex items-center justify-center shadow-lg">
                                                                    <CheckCircle className="w-3 h-3 font-black" />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-black text-white text-lg italic tracking-tight uppercase">{user.fullName}</div>
                                                            <div className="text-[10px] text-slate-500 font-bold flex items-center mt-1 uppercase tracking-widest">
                                                                <Mail className="w-3 h-3 mr-2 text-primary" />
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className={`inline-flex items-center px-4 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all ${getRoleBadgeStyles(user.role)}`}>
                                                        <RoleIcon className="w-3 h-3 mr-2" />
                                                        {user.role}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-black italic">
                                                        <Clock className="w-4 h-4 opacity-30" />
                                                        {user.createdAt ? format(new Date(user.createdAt), 'dd.MM.yyyy', { locale: fr }) : '--.--.----'}
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex flex-col gap-2">
                                                        <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${user.isVerified ? 'text-primary' : 'text-slate-500'}`}>
                                                            <span className={`w-2 h-2 rounded-full ${user.isVerified ? 'bg-primary animate-pulse' : 'bg-slate-700'}`}></span>
                                                            {user.isVerified ? 'COMPTE VÉRIFIÉ' : 'NON VÉRIFIÉ'}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[9px] text-slate-600 font-bold italic">
                                                            <Smartphone className="w-3 h-3" />
                                                            {user.phone || 'Aucun numéro'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                        {!user.isVerified && (
                                                            <button
                                                                onClick={() => verifyUserMutation.mutate(user.id)}
                                                                className="w-12 h-12 flex items-center justify-center bg-primary text-slate-900 rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                                                                title="Vérifier l'utilisateur"
                                                            >
                                                                <UserCheck className="w-5 h-5 font-black" />
                                                            </button>
                                                        )}

                                                        <div className="relative">
                                                            <select
                                                                onChange={(e) => updateRoleMutation.mutate({ id: user.id, role: e.target.value })}
                                                                className="appearance-none h-12 px-5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 outline-none hover:border-primary/30 transition-all pr-10"
                                                                value={user.role}
                                                            >
                                                                <option value="passenger">PASSAGER</option>
                                                                <option value="driver">CONDUCTEUR</option>
                                                                <option value="admin">ADMIN</option>
                                                            </select>
                                                            <ArrowUpRight className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
                                                        </div>

                                                        <button className="w-12 h-12 flex items-center justify-center bg-white/5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-all">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        )
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {!isLoading && users?.length === 0 && (
                            <div className="py-40 text-center flex flex-col items-center">
                                <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-8 border border-white/5">
                                    <UserIcon className="w-10 h-10 text-slate-700" />
                                </div>
                                <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Aucun raccordement trouvé</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-2">Ajustez vos filtres de recherche ou réinitialisez l'index</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UsersManagement
