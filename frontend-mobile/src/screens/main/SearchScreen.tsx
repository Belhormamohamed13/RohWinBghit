import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../../constants/theme'

const wilayas = [
  { code: 16, name: 'Alger' },
  { code: 31, name: 'Oran' },
  { code: 25, name: 'Constantine' },
  { code: 6, name: 'Béjaïa' },
  { code: 23, name: 'Annaba' },
  { code: 21, name: 'Skikda' },
  { code: 13, name: 'Tlemcen' },
  { code: 19, name: 'Sétif' },
]

const SearchScreen = () => {
  const [fromWilaya, setFromWilaya] = useState('')
  const [toWilaya, setToWilaya] = useState('')
  const [date, setDate] = useState('')
  const [seats, setSeats] = useState(1)
  const navigation = useNavigation()

  const handleSearch = () => {
    navigation.navigate('TripDetails' as never)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Rechercher un trajet</Text>
      </View>

      <View style={styles.form}>
        {/* From */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Départ</Text>
          <View style={styles.wilayaGrid}>
            {wilayas.slice(0, 4).map((w) => (
              <TouchableOpacity
                key={w.code}
                style={[
                  styles.wilayaButton,
                  fromWilaya === w.name && styles.wilayaButtonActive,
                ]}
                onPress={() => setFromWilaya(w.name)}
              >
                <Text
                  style={[
                    styles.wilayaText,
                    fromWilaya === w.name && styles.wilayaTextActive,
                  ]}
                >
                  {w.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* To */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Arrivée</Text>
          <View style={styles.wilayaGrid}>
            {wilayas.slice(4).map((w) => (
              <TouchableOpacity
                key={w.code}
                style={[
                  styles.wilayaButton,
                  toWilaya === w.name && styles.wilayaButtonActive,
                ]}
                onPress={() => setToWilaya(w.name)}
              >
                <Text
                  style={[
                    styles.wilayaText,
                    toWilaya === w.name && styles.wilayaTextActive,
                  ]}
                >
                  {w.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Seats */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Passagers</Text>
          <View style={styles.seatsContainer}>
            {[1, 2, 3, 4].map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.seatButton,
                  seats === n && styles.seatButtonActive,
                ]}
                onPress={() => setSeats(n)}
              >
                <Text
                  style={[
                    styles.seatText,
                    seats === n && styles.seatTextActive,
                  ]}
                >
                  {n}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="white" />
          <Text style={styles.searchButtonText}>Rechercher</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark[900],
  },
  form: {
    padding: spacing.xl,
    paddingTop: 0,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark[700],
    marginBottom: spacing.md,
  },
  wilayaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  wilayaButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.dark[100],
    borderWidth: 1,
    borderColor: colors.dark[200],
  },
  wilayaButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  wilayaText: {
    color: colors.dark[700],
    fontWeight: '500',
  },
  wilayaTextActive: {
    color: 'white',
  },
  seatsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  seatButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.dark[100],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.dark[200],
  },
  seatButtonActive: {
    backgroundColor: colors.primary[600],
    borderColor: colors.primary[600],
  },
  seatText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark[700],
  },
  seatTextActive: {
    color: 'white',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[600],
    height: 56,
    borderRadius: 12,
    marginTop: spacing.xl,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
})

export default SearchScreen
