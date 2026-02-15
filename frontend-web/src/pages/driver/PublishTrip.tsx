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
import { useAuthStore } from '../../store/authStore'

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
  const { user } = useAuthStore()

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
            <div className="bg-night-800/80 p-6 rounded-3xl border border-border shadow-card backdrop-blur-md">
              <h3 className="text-xl font-display text-text-primary mb-6 flex items-center gap-3 tracking-wide">
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
                  <MapPin className="text-accent-teal" size={20} />
                </div>
                Où allez-vous ?
              </h3>

              <div className="space-y-6 relative">
                {/* Departure */}
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block font-mono">D'où partez-vous ?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      {...register('fromWilayaId', { valueAsNumber: true })}
                      className="flex-[2] bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold appearance-none"
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
                      className="flex-[3] bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold placeholder:text-text-muted/50"
                      placeholder="Ville / Commune"
                    />
                  </div>
                  {(errors.fromWilayaId || errors.fromCity) && (
                    <p className="mt-2 text-xs font-bold text-accent-red uppercase tracking-wide">Informations de départ requises</p>
                  )}
                </div>

                {/* Swap Button */}
                <div className="flex justify-center -my-6 relative z-10">
                  <button
                    type="button"
                    onClick={handleSwap}
                    className="bg-night-900 border border-border p-3 rounded-full hover:rotate-180 transition-all duration-500 text-accent-teal shadow-glow hover:bg-night-800 active:scale-95"
                  >
                    <ArrowRightLeft size={20} className="rotate-90" />
                  </button>
                </div>

                {/* Destination */}
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block font-mono">Quelle est votre destination ?</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <select
                      {...register('toWilayaId', { valueAsNumber: true })}
                      className="flex-[2] bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold appearance-none"
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
                      className="flex-[3] bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold placeholder:text-text-muted/50"
                      placeholder="Ville / Commune"
                    />
                  </div>
                  {(errors.toWilayaId || errors.toCity) && (
                    <p className="mt-2 text-xs font-bold text-accent-red uppercase tracking-wide">Informations d'arrivée requises</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-night-800/80 p-6 rounded-3xl border border-border shadow-card backdrop-blur-md">
              <h3 className="text-xl font-display text-text-primary mb-6 flex items-center gap-3 tracking-wide">
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
                  <Calendar className="text-accent-teal" size={20} />
                </div>
                Planification
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block flex items-center font-mono">
                    <Calendar size={12} className="mr-2" />
                    Date de départ
                  </label>
                  <input
                    {...register('departureDate')}
                    type="date"
                    className="w-full bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold dark-date-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {errors.departureDate && (
                    <p className="mt-2 text-xs font-bold text-accent-red uppercase tracking-wide">{errors.departureDate.message}</p>
                  )}
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block flex items-center font-mono">
                    <Clock size={12} className="mr-2" />
                    Heure de départ
                  </label>
                  <input
                    {...register('departureTime')}
                    type="time"
                    className="w-full bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold dark-time-input"
                  />
                  {errors.departureTime && (
                    <p className="mt-2 text-xs font-bold text-accent-red uppercase tracking-wide">{errors.departureTime.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-night-800/80 p-6 rounded-3xl border border-border shadow-card backdrop-blur-md">
              <h3 className="text-xl font-display text-text-primary mb-6 flex items-center gap-3 tracking-wide">
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
                  <Banknote className="text-accent-teal" size={20} />
                </div>
                Capacité & Prix
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block flex items-center font-mono">
                    <UsersIcon size={12} className="mr-2" />
                    Places disponibles
                  </label>
                  <select {...register('availableSeats', { valueAsNumber: true })}
                    className="w-full bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>
                        {n} place{n > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block flex items-center font-mono">
                    <Banknote size={12} className="mr-2" />
                    Prix par place (DZD)
                  </label>
                  <input
                    {...register('pricePerSeat', { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold"
                    min="100"
                    step="50"
                  />
                  {errors.pricePerSeat && (
                    <p className="mt-2 text-xs font-bold text-accent-red uppercase tracking-wide">{errors.pricePerSeat.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-night-800/80 p-6 rounded-3xl border border-border shadow-card backdrop-blur-md">
              <h3 className="text-xl font-display text-text-primary mb-6 flex items-center gap-3 tracking-wide">
                <div className="w-10 h-10 rounded-xl bg-accent-teal/10 flex items-center justify-center border border-accent-teal/20">
                  <Car className="text-accent-teal" size={20} />
                </div>
                Véhicule & Options
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block flex items-center font-mono">
                    Véhicule
                  </label>
                  <select {...register('vehicleId')}
                    className="w-full bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold appearance-none"
                  >
                    <option value="">Sélectionnez un véhicule</option>
                    {vehicles?.map((v: any) => (
                      <option key={v.id} value={v.id}>
                        {v.make} {v.model} ({v.year}) - {v.color}
                      </option>
                    ))}
                  </select>
                  {errors.vehicleId && (
                    <p className="mt-2 text-xs font-bold text-accent-red uppercase tracking-wide">{errors.vehicleId.message}</p>
                  )}
                  {(!vehicles || vehicles.length === 0) && (
                    <p className="mt-2 text-xs text-text-muted italic flex items-center gap-2">
                      <Info size={14} /> Vous n'avez pas encore ajouté de véhicule.
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'luggageAllowed', icon: Briefcase, label: 'Bagages autorisés' },
                    { name: 'smokingAllowed', icon: Cigarette, label: 'Fumeur autorisé' },
                    { name: 'petsAllowed', icon: PawPrint, label: 'Animaux acceptés' },
                    { name: 'instantBooking', icon: Zap, label: 'Réservation instantanée' },
                  ].map((pref) => (
                    <label key={pref.name} className="flex items-center p-4 border border-border bg-night-900/50 rounded-xl cursor-pointer hover:bg-night-800 hover:border-accent-teal/50 transition-all group">
                      <input
                        //@ts-ignore
                        {...register(pref.name)}
                        type="checkbox"
                        className="w-5 h-5 text-accent-teal border-border rounded focus:ring-accent-teal bg-night-900"
                      />
                      <pref.icon className="w-5 h-5 ml-4 text-text-muted group-hover:text-accent-teal transition-colors" />
                      <span className="ml-3 text-text-primary text-sm font-bold">{pref.label}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-dim mb-3 block flex items-center font-mono">
                    Description (optionnel)
                  </label>
                  <textarea
                    {...register('description')}
                    className="w-full bg-night-900 border border-border rounded-xl px-4 py-4 focus:ring-1 focus:ring-accent-teal focus:border-accent-teal outline-none transition-all text-text-primary text-sm font-bold h-32 resize-none placeholder:text-text-muted/50 leading-relaxed"
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
            <div className="bg-gradient-to-br from-accent-teal/10 to-transparent rounded-3xl p-8 border border-accent-teal/20 backdrop-blur-md">
              <h3 className="text-2xl font-display text-text-primary mb-8 flex items-center gap-3 tracking-wide">
                <CheckCircle className="text-accent-teal" size={24} />
                Récapitulatif de votre trajet
              </h3>

              <div className="space-y-6">
                {[
                  { label: 'Départ', value: `${wilayas?.find((w: any) => w.code === formData.fromWilayaId)?.name} - ${formData.fromCity}` },
                  { label: 'Arrivée', value: `${wilayas?.find((w: any) => w.code === formData.toWilayaId)?.name} - ${formData.toCity}` },
                  { label: 'Date', value: formData.departureDate && new Date(formData.departureDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }) },
                  { label: 'Heure', value: formData.departureTime },
                  { label: 'Places', value: formData.availableSeats },
                  { label: 'Véhicule', value: vehicles?.find((v: any) => v.id === formData.vehicleId) ? `${vehicles.find((v: any) => v.id === formData.vehicleId).make} ${vehicles.find((v: any) => v.id === formData.vehicleId).model}` : 'Non sélectionné' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0 capitalize group">
                    <span className="text-text-muted text-sm font-bold font-mono tracking-wide">{row.label}:</span>
                    <span className="font-bold text-text-primary text-right pl-4">{row.value}</span>
                  </div>
                ))}

                <div className="flex justify-between items-center bg-night-900 p-6 rounded-2xl shadow-lg border border-border mt-8 hover:border-accent-teal/30 transition-all">
                  <div>
                    <span className="text-text-dim text-[10px] uppercase font-bold tracking-widest font-mono block mb-1">Revenu estimé</span>
                    <p className="text-3xl font-display text-accent-teal tracking-wide">{(formData.pricePerSeat || 0) * (formData.availableSeats || 0)} <span className="text-xs font-bold font-sans opacity-60">DZD</span></p>
                  </div>
                  <div className="text-right">
                    <span className="text-text-dim text-[10px] uppercase font-bold tracking-widest font-mono block mb-1">Par place</span>
                    <p className="text-lg font-bold text-text-primary uppercase">{formData.pricePerSeat} DZD</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-accent-orange/5 p-4 rounded-xl border border-accent-orange/10">
              <Info className="w-5 h-5 text-accent-orange mt-1 shrink-0" />
              <p className="text-xs leading-relaxed text-accent-orange font-bold">
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
      <div className="flex min-h-[calc(100vh-80px)] overflow-hidden font-body text-text-primary">
        {/* Left Column: Form Section */}
        <div className="w-full lg:w-1/2 p-8 overflow-y-auto max-h-[calc(100vh-80px)] scrollbar-hide dark-scrollbar">
          <div className="max-w-xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-4xl font-display text-text-primary mb-2 tracking-wide">PUBLIER UN <span className="text-accent-teal">TRAJET</span></h1>
              <p className="text-text-muted font-medium text-lg">Partagez votre voyage et économisez sur les frais.</p>
            </div>

            {/* Progress Steps */}
            <div className="mb-12 relative flex items-center justify-between">
              <div className="absolute top-6 left-0 w-full h-0.5 bg-border -z-0"></div>
              {steps.map((step) => {
                const Icon = step.icon;
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                  <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 bg-night-900 px-3 py-2 rounded-xl border border-transparent">
                    <div
                      className={`flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${isCompleted || isActive
                        ? 'bg-accent-teal text-night-900 shadow-glow'
                        : 'bg-night-800 text-text-muted border border-border'
                        }`}
                    >
                      <Icon size={20} />
                    </div>
                    <span className={`text-[9px] uppercase font-bold tracking-widest font-mono ${isActive ? 'text-accent-teal' : 'text-text-dim'}`}>{step.title}</span>
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
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 text-text-muted hover:text-text-primary font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed group"
                >
                  <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                  RETOUR
                </button>

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="bg-accent-teal text-night-900 px-8 py-4 rounded-xl font-bold hover:shadow-glow transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 border border-accent-teal/50"
                  >
                    CONTINUER
                    <ChevronRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-accent-teal text-night-900 px-10 py-4 rounded-xl font-bold hover:shadow-glow transition-all flex items-center gap-2 transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-accent-teal/50"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-night-900/50 border-t-night-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        PUBLIER
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Map Preview Section */}
        <div className="hidden lg:block lg:w-1/2 p-8 bg-transparent relative">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-transparent z-10 pointer-events-none"></div>
          <div className="sticky top-8 h-[calc(100vh-64px)] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-border bg-night-800/80 backdrop-blur-md relative z-0">
            <TripMap
              fromWilayaId={formData.fromWilayaId}
              toWilayaId={formData.toWilayaId}
              departureTime={formData.departureTime}
              darkMode={true}
            />
          </div>
        </div>
      </div>
    </DriverLayout>
  )
}

export default PublishTrip
