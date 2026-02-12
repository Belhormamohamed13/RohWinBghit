import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  MapPin,
  Calendar,
  Clock,
  Users as UsersIcon,
  Car,
  Banknote,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Cigarette,
  PawPrint,
  Zap,
  Info,
  ArrowRightLeft
} from 'lucide-react'
import toast from 'react-hot-toast'
import { tripsApi, wilayasApi, vehiclesApi } from '../../services/api'
import { useQuery } from '@tanstack/react-query'
import { WILAYA_COORDS } from '../../constants/wilayaCoords'
import DriverLayout from '../../components/layout/DriverLayout'
import TripMap from '../../components/trips/TripMap'

const tripSchema = z.object({
  fromWilayaId: z.number().min(1, 'Sélectionnez une wilaya de départ'),
  fromCity: z.string().min(2, 'Ville de départ requise'),
  toWilayaId: z.number().min(1, 'Sélectionnez une wilaya d\'arrivée'),
  toCity: z.string().min(2, 'Ville d\'arrivée requise'),
  departureDate: z.string().min(1, 'Date requise'),
  departureTime: z.string().min(1, 'Heure requise'),
  availableSeats: z.number().min(1).max(8),
  pricePerSeat: z.number().min(100, 'Prix minimum 100 DZD'),
  vehicleId: z.string().min(1, 'Sélectionnez un véhicule'),
  luggageAllowed: z.boolean(),
  smokingAllowed: z.boolean(),
  petsAllowed: z.boolean(),
  instantBooking: z.boolean(),
  description: z.string().optional(),
})

type TripFormData = z.infer<typeof tripSchema>

const steps = [
  { id: 1, title: 'Itinéraire', icon: MapPin },
  { id: 2, title: 'Date & Heure', icon: Calendar },
  { id: 3, title: 'Détails', icon: Car },
  { id: 4, title: 'Confirmation', icon: CheckCircle },
]

const PublishTrip = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const { data: wilayas } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await wilayasApi.getAll()
      return response.data.data
    },
  })

  const { data: vehicles } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: async () => {
      const response = await vehiclesApi.getMyVehicles()
      return response.data.data
    },
  })

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      availableSeats: 3,
      pricePerSeat: 500,
      luggageAllowed: true,
      smokingAllowed: false,
      petsAllowed: false,
      instantBooking: false,
    },
  })

  const formData = watch()

  const handleSwap = () => {
    const from = formData.fromWilayaId;
    const fromCity = formData.fromCity;
    const to = formData.toWilayaId;
    const toCity = formData.toCity;

    setValue('fromWilayaId', to);
    setValue('fromCity', toCity);
    setValue('toWilayaId', from);
    setValue('toCity', fromCity);
  }

  const onSubmit = async (data: TripFormData) => {
    setIsSubmitting(true)
    try {
      const fromCoords = WILAYA_COORDS[data.fromWilayaId];
      const toCoords = WILAYA_COORDS[data.toWilayaId];

      // Calculate distance and duration (simple approximation)
      const R = 6371;
      const dLat = (toCoords[0] - fromCoords[0]) * Math.PI / 180;
      const dLon = (toCoords[1] - fromCoords[1]) * Math.PI / 180;
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(fromCoords[0] * Math.PI / 180) * Math.cos(toCoords[0] * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = Math.round(R * c * 1.25);
      const durationMinutes = Math.round((distance / 80) * 60);

      const enrichedData = {
        ...data,
        fromLatitude: fromCoords[0],
        fromLongitude: fromCoords[1],
        toLatitude: toCoords[0],
        toLongitude: toCoords[1],
        distanceKm: distance,
        durationMinutes: durationMinutes,
        totalPrice: data.pricePerSeat * data.availableSeats
      };

      await tripsApi.create(enrichedData)
      toast.success('Trajet publié avec succès!')
      navigate('/driver/my-trips')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur lors de la publication')
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    let fieldsToValidate: (any)[] = []

    if (currentStep === 1) {
      fieldsToValidate = ['fromWilayaId', 'fromCity', 'toWilayaId', 'toCity']
    } else if (currentStep === 2) {
      fieldsToValidate = ['departureDate', 'departureTime', 'availableSeats', 'pricePerSeat']
    } else if (currentStep === 3) {
      fieldsToValidate = ['vehicleId']
    }

    const isValid = await trigger(fieldsToValidate)

    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <MapPin className="text-[#13ec6d]" size={20} />
                Où allez-vous ?
              </h3>

              <div className="space-y-4 relative">
                {/* Departure */}
                <div className="relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">D'où partez-vous ?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      {...register('fromWilayaId', { valueAsNumber: true })}
                      className="flex-[2] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                    >
                      <option value="">Wilaya de départ</option>
                      {wilayas?.map((w: any) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.name}
                        </option>
                      ))}
                    </select>
                    <input
                      {...register('fromCity')}
                      type="text"
                      className="flex-[3] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                      placeholder="Ville / Commune"
                    />
                  </div>
                  {(errors.fromWilayaId || errors.fromCity) && (
                    <p className="mt-1 text-sm text-red-600">Informations de départ requises</p>
                  )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-4 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 p-2 rounded-full hover:rotate-180 transition-transform duration-500 text-[#13ec6d] shadow-sm active:scale-95"
                  >
                    <ArrowRightLeft size={20} className="rotate-90" />
                  </button>
                </div>

                {/* Destination */}
                <div className="relative">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Quelle est votre destination ?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      {...register('toWilayaId', { valueAsNumber: true })}
                      className="flex-[2] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                    >
                      <option value="">Wilaya d'arrivée</option>
                      {wilayas?.map((w: any) => (
                        <option key={w.code} value={w.code}>
                          {w.code} - {w.name}
                        </option>
                      ))}
                    </select>
                    <input
                      {...register('toCity')}
                      type="text"
                      className="flex-[3] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                      placeholder="Ville / Commune"
                    />
                  </div>
                  {(errors.toWilayaId || errors.toCity) && (
                    <p className="mt-1 text-sm text-red-600">Informations d'arrivée requises</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="text-[#13ec6d]" size={20} />
                Planification
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center">
                    <Calendar size={14} className="mr-2" />
                    Date de départ
                  </label>
                  <input
                    {...register('departureDate')}
                    type="date"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.departureDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.departureDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center">
                    <Clock size={14} className="mr-2" />
                    Heure de départ
                  </label>
                  <input
                    {...register('departureTime')}
                    type="time"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                  />
                  {errors.departureTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.departureTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Banknote className="text-[#13ec6d]" size={20} />
                Capacité & Prix
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center">
                    <UsersIcon size={14} className="mr-2" />
                    Places disponibles
                  </label>
                  <select {...register('availableSeats', { valueAsNumber: true })}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} place{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center">
                    <Banknote size={14} className="mr-2" />
                    Prix par place (DZD)
                  </label>
                  <input
                    {...register('pricePerSeat', { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                    min="100"
                    step="50"
                  />
                  {errors.pricePerSeat && (
                    <p className="mt-1 text-sm text-red-600">{errors.pricePerSeat.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Car className="text-[#13ec6d]" size={20} />
                Véhicule & Options
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center">
                    Véhicule
                  </label>
                  <select {...register('vehicleId')}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white"
                  >
                    <option value="">Sélectionnez un véhicule</option>
                    {vehicles?.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.year}) - {v.color}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="mt-1 text-sm text-red-600">{errors.vehicleId.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'luggageAllowed', icon: Briefcase, label: 'Bagages autorisés' },
                    { name: 'smokingAllowed', icon: Cigarette, label: 'Fumeur autorisé' },
                    { name: 'petsAllowed', icon: PawPrint, label: 'Animaux acceptés' },
                    { name: 'instantBooking', icon: Zap, label: 'Réservation instantanée' },
                  ].map((pref) => (
                    <label key={pref.name} className="flex items-center p-4 border border-slate-200 dark:border-slate-700/50 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-all group">
                      <input
                        //@ts-ignore
                        {...register(pref.name)}
                        type="checkbox"
                        className="w-5 h-5 text-[#13ec6d] border-slate-300 dark:border-slate-700 rounded focus:ring-[#13ec6d]"
                      />
                      <pref.icon className="w-5 h-5 ml-4 text-slate-400 group-hover:text-[#13ec6d] transition-colors" />
                      <span className="ml-3 text-slate-700 dark:text-slate-300 font-medium">{pref.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center">
                    Description (optionnel)
                  </label>
                  <textarea
                    {...register('description')}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#13ec6d] outline-none transition-all dark:text-white h-24 resize-none"
                    placeholder="Informations complémentaires pour les passagers..."
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-[#13ec6d]/5 dark:bg-[#13ec6d]/10 rounded-2xl p-8 border border-[#13ec6d]/20">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="text-[#13ec6d]" size={20} />
                Récapitulatif de votre trajet
              </h3>

              <div className="space-y-4">
                {[
                  { label: 'Départ', value: `${wilayas?.find((w: any) => w.code === formData.fromWilayaId)?.name} - ${formData.fromCity}` },
                  { label: 'Arrivée', value: `${wilayas?.find((w: any) => w.code === formData.toWilayaId)?.name} - ${formData.toCity}` },
                  { label: 'Date', value: formData.departureDate && new Date(formData.departureDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) },
                  { label: 'Heure', value: formData.departureTime },
                  { label: 'Places', value: formData.availableSeats },
                  { label: 'Véhicule', value: vehicles?.find((v: any) => v.id === formData.vehicleId) ? `${vehicles.find((v: any) => v.id === formData.vehicleId).make} ${vehicles.find((v: any) => v.id === formData.vehicleId).model}` : 'Non sélectionné' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-800 last:border-0 capitalize">
                    <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{row.label}:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{row.value}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-[#13ec6d]/10 mt-6">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Revenu estimé</span>
                    <p className="text-2xl font-extrabold text-[#13ec6d]">{(formData.pricePerSeat || 0) * (formData.availableSeats || 0)} <span className="text-xs font-bold">DZD</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Par place</span>
                    <p className="text-lg font-bold text-slate-900 dark:text-white uppercase">{formData.pricePerSeat} DZD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-amber-500/10 p-4 rounded-xl border border-amber-500/20">
              <Info className="w-5 h-5 text-amber-500 mt-1 shrink-0" />
              <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-500 font-medium">
                En publiant ce trajet, vous acceptez nos conditions d'utilisation.
                Une fois publié, les passagers pourront réserver instantanément ou sur demande selon vos réglages.
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <DriverLayout fullContent>
      <div className="flex min-h-[calc(100vh-80px)] overflow-hidden">
        {/* Left Column: Form Section */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Publier un trajet</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Partagez votre voyage et économisez sur les frais.</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12 relative flex items-center justify-between">
              <div className="absolute top-6 left-0 w-full h-0.5 bg-slate-200 dark:bg-slate-800 -z-0"></div>
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-2 relative z-10 bg-[#f5f8f5] dark:bg-[#0f230f] px-2">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-300 ${isCompleted || isActive
                        ? 'bg-[#13ec6d] text-white shadow-lg shadow-[#13ec6d]/20'
                        : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-[#13ec6d]' : 'text-slate-400'}`}>{step.title}</span>
                  </div>
                )
              })}
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                  Retour
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-[#13ec6d] text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-[#13ec6d]/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
                  >
                    Continuer
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#13ec6d] text-white px-10 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-[#13ec6d]/30 transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Publier mon trajet
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Map Preview Section */}
        <div className="hidden lg:block lg:w-1/2 p-8 bg-[#f5f8f5] dark:bg-[#0f230f]">
          <div className="sticky top-8 h-[750px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <TripMap
              fromWilayaId={formData.fromWilayaId}
              toWilayaId={formData.toWilayaId}
              departureTime={formData.departureTime}
            />
          </div>
        </div>
      </div>
    </DriverLayout>
  )
}

export default PublishTrip
