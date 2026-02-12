import { useSearchParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { tripsApi, bookingsApi, wilayasApi } from '../../services/api'
import DateUtil from '../../utils/dateUtil'
import toast from 'react-hot-toast'
import { useState } from 'react'

const BookingCheckout = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')

    const tripId = searchParams.get('tripId')
    const seats = Number(searchParams.get('seats') || '1')

    const { data: trip, isLoading: tripLoading, error: tripError } = useQuery({
        queryKey: ['trip', tripId],
        queryFn: async () => {
            const response = await tripsApi.getById(tripId!)
            return response.data.data
        },
        enabled: !!tripId,
    })

    const { data: wilayas } = useQuery({
        queryKey: ['wilayas'],
        queryFn: async () => {
            const response = await wilayasApi.getAll()
            return response.data.data
        },
    })

    const getWilayaName = (code: string | number | null) => {
        if (!code) return '---'
        return wilayas?.find((w: any) => w.code === parseInt(code.toString()))?.name || code
    }

    const handleConfirmBooking = async () => {
        if (!trip) return;
        setIsSubmitting(true)

        if (paymentMethod === 'card') {
            const loadingToast = toast.loading('Traitement du paiement sécurisé...')
            await new Promise(resolve => setTimeout(resolve, 2000))

            const isSuccess = Math.random() > 0.1
            if (!isSuccess) {
                toast.error('Échec du paiement. Veuillez vérifier vos fonds.', { id: loadingToast })
                setIsSubmitting(false)
                return
            }
            toast.success('Paiement réussi !', { id: loadingToast })
        }

        try {
            await bookingsApi.create({
                trip_id: trip.id,
                num_seats: seats,
                total_price: trip.price_per_seat * seats,
                payment_method: paymentMethod
            })
            toast.success('Réservation confirmée !')
            navigate('/passenger/bookings')
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Erreur lors de la réservation')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (tripLoading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-primary font-black uppercase tracking-widest animate-pulse">Initialisation de la transaction...</p>
        </div>
    )

    if (tripError || !trip) return (
        <div className="text-center py-20 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl text-red-500">error</span>
            </div>
            <p className="text-slate-400 font-black italic uppercase tracking-widest text-xl mb-2">Trajet Introuvable</p>
            <p className="text-slate-500 mb-8 px-10 text-sm font-medium">Nous ne parvenons pas à récupérer les informations de ce trajet. Il a peut-être été supprimé ou est complet.</p>
            <button onClick={() => navigate('/passenger/search')} className="btn-primary px-8">Retourner à la recherche</button>
        </div>
    )

    return (
        <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-10">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-primary transition-all font-black text-[10px] uppercase tracking-widest group"
                >
                    <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                    Retour au trajet
                </button>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Sécurisée</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr,360px] gap-10">
                <div className="space-y-8">
                    {/* Booking Summary - Premium Card */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-200 dark:border-white/10 p-10 shadow-elevated overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-12 bg-primary/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>

                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-10 tracking-tighter italic">
                            Confirmez votre <span className="text-primary">réservation</span>
                        </h1>

                        <div className="space-y-10 relative z-10">
                            {/* Trip Dynamic Map-like visualization */}
                            <div className="flex items-stretch gap-8">
                                <div className="flex flex-col items-center py-1">
                                    <div className="w-4 h-4 rounded-full border-4 border-primary bg-white shadow-lg shadow-primary/20"></div>
                                    <div className="w-0.5 flex-1 bg-gradient-to-b from-primary via-primary/50 to-transparent my-2"></div>
                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600"></div>
                                </div>

                                <div className="flex-1 space-y-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">DÉPART</p>
                                            <p className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">{getWilayaName(trip.from_wilaya_id)}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{DateUtil.getTripDateDisplay(trip.departure_time)}</p>
                                            <p className="text-xl font-black text-primary italic tracking-tight leading-none">{DateUtil.formatTime(trip.departure_time)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">ARRIVÉE</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight">{getWilayaName(trip.to_wilaya_id)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-10 pt-8 border-t border-slate-100 dark:border-white/5">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PASSAGERS</p>
                                    <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-primary font-black">group</span>
                                        </div>
                                        <span className="text-lg font-black italic">{seats} {seats > 1 ? 'personnes' : 'personne'}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">PRIX TOTAL</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black text-primary italic tracking-tighter">{(trip.price_per_seat * seats).toLocaleString()} DZD</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment - Premium Selector */}
                    <div className="bg-white/70 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] border border-slate-200 dark:border-white/10 p-10 shadow-elevated">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-8 italic uppercase tracking-tighter">Mode de <span className="text-primary">paiement</span></h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                className={`flex flex-col gap-4 p-8 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${paymentMethod === 'cash'
                                    ? 'bg-primary border-primary'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:border-slate-300 dark:hover:border-white/20'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'cash' ? 'bg-slate-900 text-primary' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
                                    <span className="material-symbols-outlined font-black">payments</span>
                                </div>
                                <div>
                                    <p className={`font-black uppercase text-[11px] tracking-widest ${paymentMethod === 'cash' ? 'text-slate-900' : 'text-slate-900 dark:text-white'}`}>Espèces</p>
                                    <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'cash' ? 'text-slate-800' : 'text-slate-500'}`}>Directement au conducteur</p>
                                </div>
                                {paymentMethod === 'cash' && <span className="material-symbols-outlined absolute top-4 right-4 text-slate-900 font-black">check_circle</span>}
                            </button>

                            <button
                                onClick={() => setPaymentMethod('card')}
                                className={`flex flex-col gap-4 p-8 rounded-[2rem] border-2 transition-all text-left relative overflow-hidden group ${paymentMethod === 'card'
                                    ? 'bg-primary border-primary'
                                    : 'bg-slate-50 dark:bg-slate-800/40 border-transparent hover:border-slate-300 dark:hover:border-white/20'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${paymentMethod === 'card' ? 'bg-slate-900 text-primary' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
                                    <span className="material-symbols-outlined font-black">bolt</span>
                                </div>
                                <div>
                                    <p className={`font-black uppercase text-[11px] tracking-widest ${paymentMethod === 'card' ? 'text-slate-900' : 'text-slate-900 dark:text-white'}`}>Carte Bancaire</p>
                                    <p className={`text-[10px] font-bold mt-1 ${paymentMethod === 'card' ? 'text-slate-800' : 'text-slate-500'}`}>CIB / Dahabia (Simulation)</p>
                                </div>
                                {paymentMethod === 'card' && <span className="material-symbols-outlined absolute top-4 right-4 text-slate-900 font-black">check_circle</span>}
                            </button>
                        </div>
                    </div>
                </div>

                <aside className="space-y-6">
                    <div className="bg-slate-900 dark:bg-slate-800/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/10 shadow-elevated relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-slate-500">Prix unitaire</span>
                                <span className="text-white">{trip.price_per_seat.toLocaleString()} DZD</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                                <span className="text-slate-500">Quantité</span>
                                <span className="text-white">x {seats}</span>
                            </div>
                            <div className="pt-6 border-t border-white/5 flex flex-col">
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">TOTAL À PAYER</span>
                                <span className="text-4xl font-black text-white italic tracking-tighter">{(trip.price_per_seat * seats).toLocaleString()} <span className="text-sm text-primary uppercase tracking-widest not-italic">DZD</span></span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmBooking}
                            disabled={isSubmitting}
                            className="w-full py-5 bg-primary text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.03] active:scale-95 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 disabled:grayscale"
                        >
                            {isSubmitting ? 'Traitement...' : 'Finaliser Réservation'}
                        </button>
                    </div>

                    <div className="bg-primary/10 rounded-[2rem] p-6 border border-primary/20">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-primary font-black">verified_user</span>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Protection RohWinBghit</p>
                                <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                                    Vos fonds sont sécurisés jusqu'à la fin du voyage. Service client disponible 24/7.
                                </p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    )
}

export default BookingCheckout
