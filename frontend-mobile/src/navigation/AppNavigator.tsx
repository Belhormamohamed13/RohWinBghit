import { useEffect, useState } from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuthStore } from '../store/authStore'
import { Ionicons } from '@expo/vector-icons'

// Screens
import SplashScreen from '../screens/SplashScreen'
import OnboardingScreen from '../screens/OnboardingScreen'
import LoginScreen from '../screens/auth/LoginScreen'
import RegisterScreen from '../screens/auth/RegisterScreen'
import HomeScreen from '../screens/main/HomeScreen'
import SearchScreen from '../screens/main/SearchScreen'
import TripsScreen from '../screens/main/TripsScreen'
import MessagesScreen from '../screens/main/MessagesScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
import PublishTripScreen from '../screens/driver/PublishTripScreen'
import TripDetailsScreen from '../screens/main/TripDetailsScreen'
import BookingScreen from '../screens/passenger/BookingScreen'
import TicketScreen from '../screens/passenger/TicketScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Main Tab Navigator
const MainTabs = () => {
  const user = useAuthStore((state) => state.user)

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home'

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline'
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline'
          } else if (route.name === 'Trips') {
            iconName = focused ? 'car' : 'car-outline'
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline'
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: '#10b981',
        tabBarInactiveTintColor: '#64748b',
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen}
        options={{ title: 'Rechercher' }}
      />
      {user?.role === 'driver' && (
        <Tab.Screen 
          name="Publish" 
          component={PublishTripScreen}
          options={{ 
            title: 'Publier',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
      )}
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen}
        options={{ title: 'Mes trajets' }}
      />
      <Tab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ title: 'Messages' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  )
}

// Main App Navigator
const AppNavigator = () => {
  const { isAuthenticated, isLoading, hasSeenOnboarding } = useAuthStore()
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Show splash for 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash || isLoading) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    )
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!hasSeenOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : (
        // Main App Stack
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen 
            name="TripDetails" 
            component={TripDetailsScreen}
            options={{ headerShown: true, title: 'Détails du trajet' }}
          />
          <Stack.Screen 
            name="Booking" 
            component={BookingScreen}
            options={{ headerShown: true, title: 'Réservation' }}
          />
          <Stack.Screen 
            name="Ticket" 
            component={TicketScreen}
            options={{ headerShown: true, title: 'Mon billet' }}
          />
        </>
      )}
    </Stack.Navigator>
  )
}

export default AppNavigator
