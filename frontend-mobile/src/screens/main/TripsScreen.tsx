import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../../constants/theme'

const tabs = ['À venir', 'Passés', 'Annulés']

const mockTrips = [
  {
    id: '1',
    from: 'Alger',
    to: 'Oran',
    date: '15 Jan 2024',
    time: '08:00',
    status: 'confirmed',
    price: '800 DZD',
    seats: 2,
  },
  {
    id: '2',
    from: 'Oran',
    to: 'Alger',
    date: '20 Jan 2024',
    time: '14:00',
    status: 'pending',
    price: '800 DZD',
    seats: 1,
  },
]

const TripsScreen = () => {
  const [activeTab, setActiveTab] = useState(0)

  const renderTrip = ({ item }: { item: typeof mockTrips[0] }) => (
    <TouchableOpacity style={styles.tripCard}>
      <View style={styles.tripHeader}>
        <View style={styles.routeInfo}>
          <Text style={styles.city}>{item.from}</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.dark[400]} />
          <Text style={styles.city}>{item.to}</Text>
        </View>
        <View style={[styles.statusBadge, item.status === 'confirmed' && styles.statusConfirmed]}>
          <Text style={[styles.statusText, item.status === 'confirmed' && styles.statusTextConfirmed]}>
            {item.status === 'confirmed' ? 'Confirmé' : 'En attente'}
          </Text>
        </View>
      </View>
      
      <View style={styles.tripDetails}>
        <View style={styles.detail}>
          <Ionicons name="calendar-outline" size={16} color={colors.dark[400]} />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="time-outline" size={16} color={colors.dark[400]} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
        <View style={styles.detail}>
          <Ionicons name="people-outline" size={16} color={colors.dark[400]} />
          <Text style={styles.detailText}>{item.seats} place(s)</Text>
        </View>
      </View>
      
      <View style={styles.tripFooter}>
        <Text style={styles.price}>{item.price}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.dark[400]} />
      </View>
    </TouchableOpacity>
  )

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
      <FlatList
        data={mockTrips}
        renderItem={renderTrip}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
})

export default TripsScreen
