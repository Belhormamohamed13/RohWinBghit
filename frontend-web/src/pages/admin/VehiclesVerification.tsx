import { motion } from 'framer-motion'
import {
    Car,
    CheckCircle,
    XCircle,
    FileText,
    ExternalLink,
    AlertCircle,
    ShieldCheck,
    Calendar,
    User,
    ArrowRight
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import { toast } from 'react-hot-toast'

const VehiclesVerification = () => {
    const queryClient = useQueryClient()

    const { data: vehicles, isLoading } = useQuery({
        queryKey: ['admin-unverified-vehicles'],
        queryFn: async () => {
            const response = await adminApi.getVehicles({ status: 'pending' })
            return response.data.data
        }
    })

    const verifyMutation = useMutation({
        mutationFn: async (id: string) => {
            await adminApi.verifyVehicle(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-unverified-vehicles'] })
            toast.success('Véhicule approuvé avec succès')
        }
    })

    const rejectMutation = useMutation({
        mutationFn: async (id: string) => {
            await adminApi.rejectVehicle(id)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-unverified-vehicles'] })
            toast.success('Véhicule rejeté')
        }
    })

    const getDocumentUrl = (path: string) => {
        if (!path) return '#'
        if (path.startsWith('http')) return path
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001'
        return `${baseUrl.replace('/api', '')}${path.startsWith('/') ? '' : '/'}${path}`
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl font-black text-white italic tracking-tighter">
                        Vérification <span className="text-primary italic">Véhicules</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-3 italic">
                        Validation des documents de conformité
                    </p>
                </div>

                <div className="bg-primary/10 border border-primary/20 px-8 py-4 rounded-2xl flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                        <ShieldCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest">Contrôle de Sécurité</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">Examen manuel requis</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-6">
                    <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse italic">Analyse des flux documentaires...</p>
                </div>
            ) : (vehicles === undefined || vehicles === null) ? (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-8 rounded-[2rem] flex items-center gap-6">
                    <AlertCircle className="w-8 h-8" />
                    <p className="font-black text-xs uppercase tracking-widest italic">Erreur critique : Flux de données interrompu</p>
                </div>
            ) : (vehicles.length === 0) ? (
                <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-32 text-center border border-white/5 shadow-elevated">
                    <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 group">
                        <Car className="w-10 h-10 text-slate-700 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Aucune transmission</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-4">Tous les véhicules enregistrés sont à jour.</p>
                </div>
            ) : (
                <div className="grid gap-10">
                    <AnimatePresence mode="popLayout">
                        {vehicles?.map((vehicle: any) => (
                            <motion.div
                                key={vehicle.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                                className="bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/5 shadow-elevated flex flex-col lg:grid lg:grid-cols-[1fr,1.2fr,1fr] items-center gap-12 group hover:bg-slate-800/60 transition-all duration-500"
                            >
                                {/* Left: Vehicle Identity */}
                                <div className="flex items-center gap-8 w-full">
                                    <div className="relative">
                                        <div className="w-28 h-28 bg-white/5 rounded-[2.5rem] flex items-center justify-center group-hover:bg-primary group-hover:text-slate-900 transition-all duration-500 shadow-inner overflow-hidden">
                                            <Car className="w-12 h-12" />
                                            {/* Could add vehicle image if available in background */}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 px-4 py-2 bg-slate-900 text-primary border border-primary/30 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl">
                                            {vehicle.year}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none group-hover:text-primary transition-colors">
                                            {vehicle.make} <span className="text-primary group-hover:text-white transition-colors">{vehicle.model}</span>
                                        </h3>
                                        <div className="flex flex-wrap gap-4 mt-6">
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest italic border border-white/5">
                                                <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: vehicle.color.toLowerCase() }}></div>
                                                {vehicle.color}
                                            </div>
                                            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl text-[10px] font-black text-white italic border border-white/5 tracking-widest">
                                                {vehicle.licensePlateMasked || vehicle.licensePlate || '--- ---'}
                                            </div>
                                        </div>
                                        <div className="mt-6 flex items-center gap-3">
                                            <User className="w-4 h-4 text-slate-600" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Propriétaire :</span>
                                            <span className="text-[11px] font-black text-slate-300 italic uppercase">{vehicle.ownerName || 'Conducteur Lambda'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Center: Document Access */}
                                <div className="grid grid-cols-2 gap-6 w-full py-8 border-t border-b lg:border-t-0 lg:border-b-0 lg:border-l lg:border-r border-white/5 px-10">
                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">PIÈCE JOINTE 01</p>
                                        <a
                                            href={getDocumentUrl(vehicle.documents?.insurance)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-between p-6 h-full rounded-2xl border transition-all ${vehicle.documents?.insurance
                                                ? 'bg-white/5 border-white/5 hover:border-primary/50 text-white'
                                                : 'bg-white/0 border-dashed border-white/10 text-slate-700 cursor-not-allowed'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <FileText className={`w-6 h-6 ${vehicle.documents?.insurance ? 'text-primary' : 'text-slate-800'}`} />
                                                <div className="text-left">
                                                    <p className="text-xs font-black uppercase tracking-tight italic">Assurance</p>
                                                    <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">Attestation PDF</p>
                                                </div>
                                            </div>
                                            {vehicle.documents?.insurance && <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-all" />}
                                        </a>
                                    </div>
                                    <div className="space-y-4">
                                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-1">PIÈCE JOINTE 02</p>
                                        <a
                                            href={getDocumentUrl(vehicle.documents?.registration)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex items-center justify-between p-6 h-full rounded-2xl border transition-all ${vehicle.documents?.registration
                                                ? 'bg-white/5 border-white/5 hover:border-primary/50 text-white'
                                                : 'bg-white/0 border-dashed border-white/10 text-slate-700 cursor-not-allowed'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <FileText className={`w-6 h-6 ${vehicle.documents?.registration ? 'text-primary' : 'text-slate-800'}`} />
                                                <div className="text-left">
                                                    <p className="text-xs font-black uppercase tracking-tight italic">Carte Grise</p>
                                                    <p className="text-[9px] text-slate-500 font-bold mt-1 uppercase">Certificat Immat.</p>
                                                </div>
                                            </div>
                                            {vehicle.documents?.registration && <ArrowRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-all" />}
                                        </a>
                                    </div>
                                </div>

                                {/* Right: Decision Actions */}
                                <div className="flex lg:flex-col gap-4 w-full h-full lg:pl-10">
                                    <button
                                        onClick={() => verifyMutation.mutate(vehicle.id)}
                                        disabled={verifyMutation.isPending || rejectMutation.isPending}
                                        className="flex-1 w-full py-6 bg-primary text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {verifyMutation.isPending ? (
                                            <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5" />
                                        )}
                                        Approuver
                                    </button>
                                    <button
                                        onClick={() => rejectMutation.mutate(vehicle.id)}
                                        disabled={verifyMutation.isPending || rejectMutation.isPending}
                                        className="flex-1 w-full py-6 bg-white/5 text-red-500 border border-red-500/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-red-500/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        Rejeter
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    )
}

export default VehiclesVerification
