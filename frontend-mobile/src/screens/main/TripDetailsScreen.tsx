import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native'
import { useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { tripsApi, reviewsApi } from '../../services/api'
import { useAuthStore } from '../../store/authStore'
import { colors, spacing } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const TripDetailsScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { isAuthenticated } = useAuthStore()
    const { tripId } = route.params as { tripId: string } || {}
    const [seats, setSeats] = useState(1)

    // Memoize the query to prevent unnecessary refetches or errors if tripId is missing
    const { data: trip, isLoading } = useQuery({
        queryKey: ['trip-details', tripId],
        queryFn: async () => {
            if (!tripId) return null
            const response = await tripsApi.getById(tripId)
            return response.data.data
        },
        enabled: !!tripId,
    })

    const { data: reviews } = useQuery({
        queryKey: ['reviews', trip?.driverId],
        enabled: !!trip?.driverId,
        queryFn: async () => {
            const response = await reviewsApi.getByUser(trip.driverId)
            return response.data.data
        },
    })

    const handleBooking = () => {
        if (!isAuthenticated) {
            Alert.alert(
                'Connexion requise',
                'Veuillez vous connecter pour réserver un trajet.',
                [
                    {
                        text: 'Annuler',
                        style: 'cancel',
                    },
                    {
                        text: 'Se connecter',
                        onPress: () => navigation.navigate('Login' as never), // Assuming Login is in Auth stack which might require special navigation if in different stack
                    },
                ]
            )
            return
        }

        navigation.navigate('Booking', { tripId, seats, trip })
    }

    if (isLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color={colors.primary[500]} />
                <Text style={styles.loadingText}>Chargement du trajet...</Text>
            </View>
        )
    }

    if (!trip) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>Trajet introuvable</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Retour</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header Image/Map Placeholder */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&q=80&w=1200' }}
                        style={styles.mapImage}
                    />
                    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <View style={styles.routeOverlay}>
                        <Text style={styles.routeTitle}>{trip.from?.city || 'Départ'} → {trip.to?.city || 'Arrivée'}</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    {/* Date & Time */}
                    <View style={styles.dateTimeCard}>
                        <View style={styles.dateTimeItem}>
                            <Ionicons name="calendar-outline" size={20} color={colors.primary[500]} />
                            <Text style={styles.dateTimeText}>
                                {trip.departure?.date ? format(new Date(trip.departure.date), 'EEEE d MMMM', { locale: fr }) : 'Date inconnue'}
                            </Text>
                        </View>
                        <View style={styles.dateTimeItem}>
                            <Ionicons name="time-outline" size={20} color={colors.primary[500]} />
                            <Text style={styles.dateTimeText}>{trip.departure?.time || '--:--'}</Text>
                        </View>
                    </View>

                    {/* Journey Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Détails du trajet</Text>
                        <View style={styles.timeline}>
                            <View style={styles.timelineItem}>
                                <View style={[styles.dot, styles.dotStart]} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.cityText}>{trip.from?.city}</Text>
                                    <Text style={styles.addressText}>{trip.from?.address || 'Point de rendez-vous'}</Text>
                                </View>
                            </View>
                            <View style={styles.line} />
                            <View style={styles.timelineItem}>
                                <View style={[styles.dot, styles.dotEnd]} />
                                <View style={styles.timelineContent}>
                                    <Text style={styles.cityText}>{trip.to?.city}</Text>
                                    <Text style={styles.addressText}>{trip.to?.address || 'Point d\'arrivée'}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Driver */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Conducteur</Text>
                        <View style={styles.driverCard}>
                            <View style={styles.driverInfo}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={{ uri: trip.driver?.avatarUrl || `https://ui-avatars.com/api/?name=${trip.driver?.fullName || 'Driver'}` }}
                                        style={styles.avatar}
                                    />
                                    <Ionicons name="checkmark-circle" size={16} color={colors.secondary[500]} style={styles.verifiedIcon} />
                                </View>
                                <View>
                                    <Text style={styles.driverName}>{trip.driver?.fullName || 'Conducteur'}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Ionicons name="star" size={14} color={colors.tertiary} />
                                        <Text style={styles.ratingText}>{trip.driver?.rating || 'Nouveau'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={styles.vehicleInfo}>
                                <Ionicons name="car-sport-outline" size={24} color={colors.dark[500]} />
                                <View>
                                    <Text style={styles.vehicleText}>{trip.vehicle?.make} {trip.vehicle?.model}</Text>
                                    <Text style={styles.vehicleColor}>{trip.vehicle?.color}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Options */}
                    <View style={styles.section}>
                        <View style={styles.optionsContainer}>
                            {trip.options?.smokingAllowed ? (
                                <View style={styles.optionTag}><Text style={styles.optionText}>Fumeur</Text></View>
                            ) : (
                                <View style={styles.optionTag}><Text style={styles.optionText}>Non-fumeur</Text></View>
                            )}
                            {trip.options?.petsAllowed && (
                                <View style={styles.optionTag}><Text style={styles.optionText}>Animaux</Text></View>
                            )}
                            {trip.options?.luggageAllowed && (
                                <View style={styles.optionTag}><Text style={styles.optionText}>Bagages</Text></View>
                            )}
                        </View>
                    </View>

                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Prix total</Text>
                    <Text style={styles.priceValue}>{trip.pricing?.perSeat * seats} DZD</Text>
                </View>

                <View style={styles.bookingControls}>
                    <View style={styles.seatSelector}>
                        <TouchableOpacity
                            onPress={() => setSeats(Math.max(1, seats - 1))}
                            style={styles.seatButton}
                        >
                            <Ionicons name="remove" size={20} color={colors.dark[700]} />
                        </TouchableOpacity>
                        <Text style={styles.seatCount}>{seats}</Text>
                        <TouchableOpacity
                            onPress={() => setSeats(Math.min(trip.seats?.available || 4, seats + 1))}
                            style={styles.seatButton}
                        >
                            <Ionicons name="add" size={20} color={colors.dark[700]} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.bookButton} onPress={handleBooking}>
                        <Text style={styles.bookButtonText}>Réserver</Text>
                        <Ionicons name="arrow-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    loadingText: {
        marginTop: spacing.md,
        color: colors.dark[500],
    },
    errorText: {
        fontSize: 18,
        color: colors.error,
        marginBottom: spacing.lg,
    },
    backButton: {
        padding: spacing.md,
        backgroundColor: colors.primary[500],
        borderRadius: 8,
    },
    backButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    imageContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    backIcon: {
        position: 'absolute',
        top: 50,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 20,
        padding: 8,
    },
    routeOverlay: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    routeTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: spacing.lg,
    },
    dateTimeCard: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: spacing.md,
        borderRadius: 16,
        marginBottom: spacing.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        justifyContent: 'space-around',
    },
    dateTimeItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dateTimeText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark[700],
        textTransform: 'capitalize',
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark[900],
        marginBottom: spacing.md,
    },
    timeline: {
        paddingLeft: spacing.sm,
    },
    timelineItem: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    line: {
        width: 2,
        backgroundColor: colors.dark[200],
        height: 30,
        marginLeft: 5,
        marginVertical: 4,
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginTop: 6,
    },
    dotStart: {
        backgroundColor: colors.primary[500],
        borderWidth: 2,
        borderColor: colors.primary[200],
    },
    dotEnd: {
        backgroundColor: colors.secondary[500],
        borderWidth: 2,
        borderColor: colors.secondary[200],
    },
    timelineContent: {
        flex: 1,
    },
    cityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark[900],
    },
    addressText: {
        fontSize: 14,
        color: colors.dark[500],
        marginTop: 2,
    },
    driverCard: {
        backgroundColor: 'white',
        padding: spacing.lg,
        borderRadius: 16,
        elevation: 2,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.dark[100],
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.dark[200],
    },
    verifiedIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    driverName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark[900],
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    ratingText: {
        fontSize: 14,
        color: colors.dark[500],
    },
    vehicleInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    vehicleText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.dark[900],
    },
    vehicleColor: {
        fontSize: 12,
        color: colors.dark[500],
        textTransform: 'capitalize',
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    optionTag: {
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        backgroundColor: colors.dark[100],
        borderRadius: 20,
    },
    optionText: {
        fontSize: 12,
        color: colors.dark[600],
        fontWeight: '500',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: spacing.lg,
        paddingBottom: 30,
        borderTopWidth: 1,
        borderTopColor: colors.dark[100],
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    priceContainer: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 12,
        color: colors.dark[500],
    },
    priceValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary[600],
    },
    bookingControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    seatSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dark[100],
        borderRadius: 24,
        padding: 4,
    },
    seatButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    seatCount: {
        width: 24,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    bookButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.lg,
        paddingVertical: 12,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    bookButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default TripDetailsScreen
