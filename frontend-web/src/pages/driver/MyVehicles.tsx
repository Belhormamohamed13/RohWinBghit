import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Plus,
    Trash2,
    Car,
    AlertCircle,
    X,
    Loader2,
    Camera,
    Upload,
    Info,
    ShieldCheck,
    FileText,
    Wrench,
    ChevronRight
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { vehiclesApi } from '../../services/api'
import toast from 'react-hot-toast'
import DriverLayout from '../../components/layout/DriverLayout'

const vehicleSchema = z.object({
    make: z.string().min(2, 'La marque est requise'),
    model: z.string().min(1, 'Le modèle est requis'),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    color: z.string().min(2, 'La couleur est requise'),
    license_plate_encrypted: z.string().min(4, 'La plaque d\'immatriculation est requise'),
    condition: z.enum(['new', 'excellent', 'good', 'fair']),
    image_url: z.string().optional(),
})

type VehicleFormData = z.infer<typeof vehicleSchema>

const MyVehicles = () => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const queryClient = useQueryClient()

    const { data: vehicles, isLoading } = useQuery({
        queryKey: ['my-vehicles'],
        queryFn: async () => {
            const response = await vehiclesApi.getMyVehicles()
            return response.data.data
        },
    })

    const createMutation = useMutation({
        mutationFn: (data: VehicleFormData) => vehiclesApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-vehicles'] })
            toast.success('Véhicule ajouté avec succès')
            setIsModalOpen(false)
            reset()
            setImagePreview(null)
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Erreur lors de l\'ajout du véhicule')
        },
    })

    const deleteMutation = useMutation({
        mutationFn: (id: string) => vehiclesApi.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-vehicles'] })
            toast.success('Véhicule supprimé')
        },
    })

    const {
        register,
        handleSubmit,
        reset,
        setValue,
    } = useForm<VehicleFormData>({
        resolver: zodResolver(vehicleSchema),
        defaultValues: {
            year: new Date().getFullYear(),
            condition: 'good',
        }
    })

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setImagePreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        setIsUploading(true)
        const formData = new FormData()
        formData.append('image', file)

        try {
            const response = await vehiclesApi.uploadImage(formData)
            setValue('image_url', response.data.data.imageUrl)
            toast.success('Image téléchargée')
        } catch (error) {
            toast.error('Échec du téléchargement de l\'image')
            setImagePreview(null)
        } finally {
            setIsUploading(false)
        }
    }

    const onSubmit = (data: VehicleFormData) => {
        createMutation.mutate(data)
    }

    return (
        <DriverLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Gestion des Véhicules</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Gérez vos voitures et assurez votre conformité.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#00e600] hover:bg-[#00cc00] text-white font-semibold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-[#00e600]/20"
                >
                    <Plus size={20} />
                    Ajouter un véhicule
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5 space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        <Car className="text-[#00e600]" size={20} />
                        Véhicules Actifs
                    </h2>

                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="w-8 h-8 text-[#00e600] animate-spin" />
                        </div>
                    ) : vehicles?.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:border-[#00e600]/30 group">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                <Car className="text-slate-300" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Aucun véhicule</h3>
                            <p className="text-slate-500 text-sm mb-6">Ajoutez votre premier véhicule pour commencer à conduire.</p>
                            <button onClick={() => setIsModalOpen(true)} className="text-[#00e600] font-bold text-sm hover:underline">Ajouter maintenant</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {vehicles?.map((vehicle: any) => (
                                <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800 hover:border-[#00e600]/40 transition-all group">
                                    <div className="flex gap-5">
                                        <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 relative">
                                            {vehicle.image_url ? (
                                                <img
                                                    src={`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}${vehicle.image_url}`}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                    alt="Véhicule"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                    <Car size={40} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{vehicle.make} {vehicle.model}</h3>
                                                    <p className="text-slate-500 text-sm">{vehicle.year} • {vehicle.color}</p>
                                                </div>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${vehicle.is_verified
                                                    ? 'bg-emerald-100 text-emerald-600'
                                                    : 'bg-amber-100 text-amber-600'
                                                    }`}>
                                                    {vehicle.is_verified ? <ShieldCheck size={12} /> : <AlertCircle size={12} />}
                                                    {vehicle.is_verified ? 'Vérifié' : 'En attente'}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex items-center gap-2">
                                                <div className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 text-sm tracking-widest">
                                                    {vehicle.license_plate_encrypted}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                                        <button className="flex-1 text-sm font-bold py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                            Modifier détails
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (confirm('Voulez-vous vraiment supprimer ce véhicule ?')) deleteMutation.mutate(vehicle.id)
                                            }}
                                            className="px-4 py-2.5 rounded-xl border border-red-100 dark:border-red-900/30 text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Statut de vérification</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#00e600]/10 flex items-center justify-center">
                                        <FileText className="text-[#00e600]" size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Carte Grise</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">APPROUVÉ</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#00e600]/10 flex items-center justify-center">
                                        <ShieldCheck className="text-[#00e600]" size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Assurance</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-500 uppercase px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">APPROUVÉ</span>
                            </li>
                            <li className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                                        <Wrench className="text-yellow-500" size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Contrôle Technique</span>
                                </div>
                                <span className="text-[10px] font-bold text-yellow-500 uppercase px-2 py-0.5 bg-yellow-50 dark:bg-yellow-500/10 rounded-full">EXPIRATION PROCHE</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-10 border-b border-slate-100 dark:border-slate-800 text-center">
                            <div className="w-20 h-20 bg-[#00e600]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="text-[#00e600]" size={36} />
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Sécurité & Confiance</h2>
                            <p className="text-sm text-slate-500 mt-4 max-w-sm mx-auto leading-relaxed">
                                Un véhicule vérifié est un gage de qualité pour vos passagers. Téléchargez vos documents officiels pour obtenir le badge de confiance.
                            </p>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all hover:bg-[#00e600]/5">
                                <Info className="text-[#00e600] shrink-0" size={28} />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-md">Pourquoi vérifier ?</h4>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                        Les conducteurs vérifiés reçoivent 3x plus de demandes de réservation. Votre plaque d'immatriculation est cryptée et n'est partagée qu'une fois le trajet confirmé.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-5 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 transition-all hover:bg-[#00e600]/5">
                                <Camera className="text-[#00e600] shrink-0" size={28} />
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-md">Photos des documents</h4>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                                        Prenez des photos nettes de votre Carte Grise et de votre Assurance à plat. Évitez les reflets pour accélérer la validation par notre équipe.
                                    </p>
                                </div>
                            </div>

                            <button className="w-full py-5 px-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 flex items-center justify-between hover:border-[#00e600]/50 hover:text-[#00e600] transition-all group">
                                <div className="flex items-center gap-3">
                                    <FileText size={20} />
                                    <span className="font-bold text-sm">Uploader Permis de Conduire</span>
                                </div>
                                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden" >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Nouveau Véhicule</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                                    <X className="text-slate-500" size={28} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[70vh]">
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div onClick={() => fileInputRef.current?.click()} className={`relative h-56 w-full rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${imagePreview ? 'border-[#00e600]' : 'border-slate-200 dark:border-slate-800 hover:border-[#00e600]/50 bg-slate-50 dark:bg-slate-800/50'
                                        }`}>
                                        {imagePreview ? (
                                            <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                                <Upload className="mb-2 text-[#00e600]" size={40} />
                                                <p className="text-md font-extrabold text-slate-900 dark:text-white">Photo de profil du véhicule</p>
                                                <p className="text-xs">Cliquez pour choisir un fichier</p>
                                            </div>
                                        )}
                                        {isUploading && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-slate-900/70">
                                                <Loader2 className="text-[#00e600] animate-spin" size={40} />
                                            </div>
                                        )}
                                        <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Marque</label>
                                            <input {...register('make')} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#00e600] font-bold" placeholder="Renault, Peugeot..." />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Modèle</label>
                                            <input {...register('model')} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#00e600] font-bold" placeholder="Symbol, Clio..." />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Année</label>
                                            <input {...register('year', { valueAsNumber: true })} type="number" className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#00e600] font-bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Couleur</label>
                                            <input {...register('color')} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#00e600] font-bold" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Condition</label>
                                            <select {...register('condition')} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#00e600] font-extrabold appearance-none">
                                                <option value="new">Neuve</option>
                                                <option value="excellent">Excellent</option>
                                                <option value="good">Bon état</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">N° d'immatriculation</label>
                                        <input {...register('license_plate_encrypted')} className="w-full bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-2xl py-4 px-5 focus:ring-2 focus:ring-[#00e600] font-mono text-center tracking-widest uppercase font-bold text-lg" placeholder="12345 124 16" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={createMutation.isPending || isUploading}
                                        className="w-full py-5 bg-[#00e600] text-white font-black rounded-3xl shadow-xl shadow-[#00e600]/30 hover:shadow-[#00cc00]/50 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    >
                                        {createMutation.isPending ? 'Action en cours...' : 'Ajouter le véhicule'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DriverLayout>
    )
}

export default MyVehicles
