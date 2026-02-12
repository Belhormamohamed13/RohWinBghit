import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useQuery } from '@tanstack/react-query'
import { bookingsApi, tripsApi } from '../../services/api'
import { colors, spacing } from '../../constants/theme'
import { useAuthStore } from '../../store/authStore'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const tabs = ['À venir', 'Passés']

const TripsScreen = () => {
  const [activeTab, setActiveTab] = useState(0)
  const user = useAuthStore(state => state.user)

  // Fetch bookings for passengers
  const { data: bookings, isLoading: isLoadingBookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const response = await bookingsApi.getMyBookings()
      return response.data.data
    },
    enabled: !!user && user.role === 'passenger'
  })

  // Fetch trips for drivers (if we implemented that endpoint completely)
  const { data: driverTrips, isLoading: isLoadingDriverTrips } = useQuery({
    queryKey: ['my-trips'],
    queryFn: async () => {
      // Assuming we have an endpoint for driver's trips, or filter trips by driverId
      // For now, let's just stick to passenger bookings as primary use case or use a placeholder
      return []
    },
    enabled: !!user && user.role === 'driver'
  })

  const isLoading = isLoadingBookings || isLoadingDriverTrips
  const data = user?.role === 'driver' ? driverTrips : bookings

  const filterTrips = (trips: any[]) => {
    if (!trips) return []
    const now = new Date()
    return trips.filter(item => {
      const tripDate = new Date(item.trip?.departure?.date || item.departure?.date)
      if (activeTab === 0) {
        return tripDate >= now
      } else {
        return tripDate < now
      }
    })
  }

  const filteredData = filterTrips(data)

  const renderItem = ({ item }: { item: any }) => {
    // Handle structure difference between booking (item.trip) and direct trip (item)
    const trip = item.trip || item
    const isBooking = !!item.trip

    return (
      <TouchableOpacity style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <View style={styles.routeInfo}>
            <Text style={styles.city}>{trip.from?.city || '?'}</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.dark[400]} />
            <Text style={styles.city}>{trip.to?.city || '?'}</Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'confirmed' && styles.statusConfirmed]}>
            <Text style={[styles.statusText, item.status === 'confirmed' && styles.statusTextConfirmed]}>
              {item.status === 'confirmed' ? 'Confirmé' : item.status || 'En attente'}
            </Text>
          </View>
        </View>

        <View style={styles.tripDetails}>
          <View style={styles.detail}>
            <Ionicons name="calendar-outline" size={16} color={colors.dark[400]} />
            <Text style={styles.detailText}>
              {trip.departure?.date ? format(new Date(trip.departure.date), 'dd MMM', { locale: fr }) : '--'}
            </Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="time-outline" size={16} color={colors.dark[400]} />
            <Text style={styles.detailText}>{trip.departure?.time}</Text>
          </View>
          <View style={styles.detail}>
            <Ionicons name="people-outline" size={16} color={colors.dark[400]} />
            <Text style={styles.detailText}>
              {isBooking ? `${item.seats} place(s)` : `${trip.seats?.available} dispo`}
            </Text>
          </View>
        </View>

        <View style={styles.tripFooter}>
          <Text style={styles.price}>
            {isBooking ? item.totalPrice : trip.pricing?.perSeat} DZD
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.dark[400]} />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes trajets</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Trips List */}
      {isLoading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={colors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucun trajet trouvé</Text>
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
    backgroundColor: colors.dark[50],
  },
  header: {
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark[900],
  },
  tabsContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[100],
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary[600],
  },
  tabText: {
    fontSize: 14,
    color: colors.dark[500],
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.primary[600],
  },
  list: {
    padding: spacing.lg,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  city: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark[900],
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.dark[100],
  },
  statusConfirmed: {
    backgroundColor: colors.primary[100],
  },
  statusText: {
    fontSize: 12,
    color: colors.dark[500],
    fontWeight: '500',
  },
  statusTextConfirmed: {
    color: colors.primary[600],
  },
  tripDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.dark[500],
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.dark[100],
    paddingTop: spacing.md,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.dark[500],
    fontSize: 16,
  },
})

export default TripsScreen
