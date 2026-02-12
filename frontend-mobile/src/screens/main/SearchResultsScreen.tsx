import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { tripsApi } from '../../services/api'
import { colors, spacing } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const SearchResultsScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { fromWilayaId, toWilayaId, date, seats } = route.params as any || {}

    const { data: trips, isLoading } = useQuery({
        queryKey: ['trips-search', fromWilayaId, toWilayaId, date, seats],
        queryFn: async () => {
            // Assuming existing API supports query params. If not, we might need to adjust.
            // Based on typical patterns: search({ from: ..., to: ..., date: ..., seats: ... })
            const response = await tripsApi.search({
                from: fromWilayaId,
                to: toWilayaId,
                date,
                seats
            })
            return response.data.data
        },
    })

    const renderTrip = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('TripDetails', { tripId: item.id })}
        >
            <View style={styles.header}>
                <View style={styles.driverInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{item.driver?.firstName?.[0] || 'D'}</Text>
                    </View>
                    <View>
                        <Text style={styles.driverName}>{item.driver?.firstName} {item.driver?.lastName}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={12} color="#FBBF24" />
                            <Text style={styles.rating}>4.8</Text>
                        </View>
                    </View>
                </View>
                <Text style={styles.price}>{item.pricing?.perSeat} DZD</Text>
            </View>

            <View style={styles.routeContainer}>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{item.departure?.time}</Text>
                    <View style={styles.durationLine} />
                    <Text style={styles.time}>{item.arrival?.time || '--:--'}</Text>
                </View>
                <View style={styles.placesContainer}>
                    <Text style={styles.city}>{item.from?.city}</Text>
                    <Text style={styles.city}>{item.to?.city}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.badge}>
                    <Ionicons name="people" size={14} color={colors.dark[600]} />
                    <Text style={styles.badgeText}>{item.seats?.available} places</Text>
                </View>
                {item.options?.smokingAllowed && <View style={styles.badge}><Text style={styles.badgeText}>Fumeur</Text></View>}
            </View>
        </TouchableOpacity>
    )

    return (
        <View style={styles.container}>
            {/* Header with Search Summary */}
            <View style={styles.searchHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.dark[900]} />
                </TouchableOpacity>
                <View>
                    <Text style={styles.routeTitle}>
                        {/* We might need to pass city names if IDs are used, or lookup IDs. 
                    For now assuming we might have names or just show generic title. */}
                        Résultats de recherche
                    </Text>
                    <Text style={styles.searchDetails}>
                        {date ? format(new Date(date), 'd MMM', { locale: fr }) : ''} • {seats} passager{seats > 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={colors.primary[500]} />
                </View>
            ) : (
                <FlatList
                    data={trips}
                    renderItem={renderTrip}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>Aucun trajet trouvé pour cette recherche.</Text>
                        </View>
                    }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.lg,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: colors.dark[100],
    },
    backButton: {
        marginRight: spacing.md,
    },
    routeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.dark[900],
    },
    searchDetails: {
        fontSize: 12,
        color: colors.dark[500],
    },
    list: {
        padding: spacing.md,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: spacing.md,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: colors.primary[700],
        fontWeight: 'bold',
    },
    driverName: {
        fontWeight: '600',
        fontSize: 14,
        color: colors.dark[900],
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    rating: {
        fontSize: 12,
        color: colors.dark[500],
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary[600],
    },
    routeContainer: {
        flexDirection: 'row',
        marginBottom: spacing.md,
    },
    timeContainer: {
        marginRight: spacing.md,
        alignItems: 'center',
    },
    time: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.dark[900],
    },
    durationLine: {
        width: 2,
        height: 20,
        backgroundColor: colors.dark[200],
        marginVertical: 4,
    },
    placesContainer: {
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    city: {
        fontSize: 14,
        color: colors.dark[700],
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.dark[100],
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    badgeText: {
        fontSize: 12,
        color: colors.dark[700],
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: colors.dark[500],
        fontSize: 16,
    },
})

export default SearchResultsScreen
