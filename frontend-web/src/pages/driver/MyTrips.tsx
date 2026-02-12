import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { tripsApi, wilayasApi } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import {
    Calendar,
    Clock,
    Users,
    ChevronRight,
    Plus,
    AlertCircle
} from 'lucide-react'
import DateUtil from '../../utils/dateUtil'

const MyTrips = () => {
    const navigate = useNavigate()

    const { data: trips, isLoading: tripsLoading } = useQuery({
        queryKey: ['my-trips'],
        queryFn: async () => {
            const response = await tripsApi.getMyTrips()
            return response.data.data
        },
    })

    const { data: wilayas } = useQuery({
        queryKey: ['wilayas'],
        queryFn: async () => {
            const response = await wilayasApi.getAll()
            return response.data.data
        },
    })

    if (tripsLoading) return <LoadingSpinner fullScreen />

    const getWilayaName = (code: number) => {
        return wilayas?.find((w: any) => w.code === code)?.name || code
    }

    return (
        <div className="min-h-screen bg-dark-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-900">Mes Trajets</h1>
                        <p className="mt-2 text-dark-500">Gérez vos trajets publiés et vos réservations</p>
                    </div>
                    <button
                        onClick={() => navigate('/driver/publish')}
                        className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        <span className="hidden sm:inline">Publier un trajet</span>
                        <span className="sm:hidden">Publier</span>
                    </button>
                </div>

                {trips && trips.length > 0 ? (
                    <div className="grid gap-6">
                        {trips.map((trip: any) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden border border-dark-100"
                                onClick={() => navigate(`/trips/${trip.id}`)}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex-1 space-y-4">
                                            {/* Route */}
                                            <div className="flex items-center space-x-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                                                    <div className="w-0.5 h-8 bg-dark-200" />
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-primary-500" />
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-sm text-dark-400 leading-none mb-1">Départ</p>
                                                        <p className="font-semibold text-dark-900">{getWilayaName(trip.from_wilaya_id)} - {trip.from_city}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-dark-400 leading-none mb-1">Arrivée</p>
                                                        <p className="font-semibold text-dark-900">{getWilayaName(trip.to_wilaya_id)} - {trip.to_city}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info Chips */}
                                            <div className="flex flex-wrap gap-4 pt-2">
                                                <div className="flex items-center text-dark-600 text-sm bg-dark-50 px-3 py-1 rounded-full">
                                                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                                                    {DateUtil.getTripDateDisplay(trip.departure_time)}
                                                </div>
                                                <div className="flex items-center text-dark-600 text-sm bg-dark-50 px-3 py-1 rounded-full">
                                                    <Clock className="w-4 h-4 mr-2 text-primary-500" />
                                                    {DateUtil.formatTime(trip.departure_time)}
                                                </div>
                                                <div className="flex items-center text-dark-600 text-sm bg-dark-50 px-3 py-1 rounded-full">
                                                    <Users className="w-4 h-4 mr-2 text-primary-500" />
                                                    {trip.available_seats} places libres
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 py-4 md:py-0 md:pl-6 md:border-l border-dark-100">
                                            <div className="text-right">
                                                <p className="text-sm text-dark-400 uppercase tracking-wider font-semibold mb-1">Revenu Total</p>
                                                <p className="text-2xl font-bold text-primary-600">{(Number(trip.price_per_seat) * (trip.total_seats || trip.available_seats)).toLocaleString()} DZD</p>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${trip.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    trip.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                                        'bg-red-100 text-red-700'
                                                    }`}>
                                                    {trip.status === 'active' ? 'En ligne' :
                                                        trip.status === 'completed' ? 'Terminé' : 'Annulé'}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-dark-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-dark-200">
                        <div className="bg-dark-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle className="w-10 h-10 text-dark-300" />
                        </div>
                        <h3 className="text-xl font-bold text-dark-900 mb-2">Aucun trajet trouvé</h3>
                        <p className="text-dark-500 mb-8 max-w-sm mx-auto">
                            Vous n'avez pas encore publié de trajet. Partagez votre voyage pour économiser sur vos frais.
                        </p>
                        <button
                            onClick={() => navigate('/driver/publish')}
                            className="btn-primary"
                        >
                            Publier mon premier trajet
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyTrips
