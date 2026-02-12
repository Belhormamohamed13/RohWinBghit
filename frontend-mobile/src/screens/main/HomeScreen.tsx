import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../../constants/theme'
import { useAuthStore } from '../../store/authStore'

const quickActions = [
  { id: 1, title: 'Rechercher', icon: 'search', color: colors.primary[500], screen: 'Search' },
  { id: 2, title: 'Mes trajets', icon: 'car', color: colors.secondary[500], screen: 'Trips' },
  { id: 3, title: 'Messages', icon: 'chatbubble', color: colors.primary[600], screen: 'Messages' },
  { id: 4, title: 'Profil', icon: 'person', color: colors.secondary[600], screen: 'Profile' },
]

const popularRoutes = [
  { id: 1, from: 'Alger', to: 'Oran', price: '800 DZD', time: '4h 30m' },
  { id: 2, from: 'Alger', to: 'Constantine', price: '600 DZD', time: '3h 45m' },
  { id: 3, from: 'Oran', to: 'Tlemcen', price: '400 DZD', time: '1h 30m' },
]

const HomeScreen = () => {
  const navigation = useNavigation()
  const user = useAuthStore((state) => state.user)

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour,</Text>
          <Text style={styles.name}>{user?.firstName || 'Invité'} 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.dark[700]} />
        </TouchableOpacity>
      </View>

      {/* Search Card */}
      <TouchableOpacity
        style={styles.searchCard}
        onPress={() => navigation.navigate('Search' as never)}
      >
        <Ionicons name="search" size={24} color={colors.primary[600]} />
        <Text style={styles.searchText}>Où allez-vous?</Text>
        <Ionicons name="arrow-forward" size={20} color={colors.dark[400]} />
      </TouchableOpacity>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accès rapide</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.actionButton}
              onPress={() => navigation.navigate(action.screen as never)}
            >
              <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                <Ionicons name={action.icon as any} size={24} color={action.color} />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Popular Routes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trajets populaires</Text>
        {popularRoutes.map((route) => (
          <TouchableOpacity key={route.id} style={styles.routeCard}>
            <View style={styles.routeInfo}>
              <View style={styles.routeCities}>
                <Text style={styles.city}>{route.from}</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.dark[400]} />
                <Text style={styles.city}>{route.to}</Text>
              </View>
              <Text style={styles.routeTime}>⏱️ {route.time}</Text>
            </View>
            <View style={styles.routePrice}>
              <Text style={styles.price}>{route.price}</Text>
              <Text style={styles.perSeat}>par place</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Devenez conducteur</Text>
          <Text style={styles.promoText}>
            Gagnez de l'argent en partageant vos trajets
          </Text>
          <TouchableOpacity style={styles.promoButton}>
            <Text style={styles.promoButtonText}>En savoir plus</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.promoIcon}>
          <Text style={{ fontSize: 60 }}>🚗</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  greeting: {
    fontSize: 14,
    color: colors.dark[500],
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark[900],
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.dark[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.xl,
    marginTop: -20,
    padding: spacing.lg,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchText: {
    flex: 1,
    marginLeft: spacing.md,
    fontSize: 16,
    color: colors.dark[500],
  },
  section: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark[900],
    marginBottom: spacing.md,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  actionText: {
    fontSize: 12,
    color: colors.dark[700],
  },
  routeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  routeInfo: {
    flex: 1,
  },
  routeCities: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark[900],
  },
  routeTime: {
    fontSize: 14,
    color: colors.dark[500],
  },
  routePrice: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary[600],
  },
  perSeat: {
    fontSize: 12,
    color: colors.dark[400],
  },
  promoBanner: {
    flexDirection: 'row',
    margin: spacing.xl,
    marginTop: 0,
    padding: spacing.lg,
    backgroundColor: colors.primary[600],
    borderRadius: 16,
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: spacing.xs,
  },
  promoText: {
    fontSize: 14,
    color: colors.primary[100],
    marginBottom: spacing.md,
  },
  promoButton: {
    backgroundColor: 'white',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  promoButtonText: {
    color: colors.primary[600],
    fontWeight: '600',
  },
  promoIcon: {
    marginLeft: spacing.md,
  },
})

export default HomeScreen
