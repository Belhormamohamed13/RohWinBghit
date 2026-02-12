import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, ActivityIndicator, Alert } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useQuery } from '@tanstack/react-query'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../../constants/theme'
import { wilayasApi } from '../../services/api'
import DateTimePicker from '@react-native-community/datetimepicker'

const SearchScreen = () => {
  const [fromWilaya, setFromWilaya] = useState<{ id: number, name: string } | null>(null)
  const [toWilaya, setToWilaya] = useState<{ id: number, name: string } | null>(null)
  const [date, setDate] = useState(new Date())
  const [seats, setSeats] = useState(1)
  const [showDatePicker, setShowDatePicker] = useState(false)

  const [modalVisible, setModalVisible] = useState(false)
  const [selectionType, setSelectionType] = useState<'from' | 'to' | null>(null)

  const navigation = useNavigation()

  const { data: wilayasData, isLoading } = useQuery({
    queryKey: ['wilayas'],
    queryFn: async () => {
      const response = await wilayasApi.getAll()
      return response.data.data
    },
  })

  const wilayas = wilayasData || []

  const handleSearch = () => {
    if (!fromWilaya || !toWilaya) {
      Alert.alert("Champs requis", "Veuillez sélectionner les villes de départ et d'arrivée.")
      return
    }

    navigation.navigate('SearchResults', {
      fromWilayaId: fromWilaya.id,
      toWilayaId: toWilaya.id,
      date: date.toISOString(),
      seats
    })
  }

  const openSelection = (type: 'from' | 'to') => {
    setSelectionType(type)
    setModalVisible(true)
  }

  const handleSelectWilaya = (wilaya: any) => {
    if (selectionType === 'from') {
      setFromWilaya({ id: wilaya.id, name: wilaya.name })
    } else {
      setToWilaya({ id: wilaya.id, name: wilaya.name })
    }
    setModalVisible(false)
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Où allez-vous ?</Text>
      </View>

      <View style={styles.formCard}>
        {/* From */}
        <TouchableOpacity style={styles.inputButton} onPress={() => openSelection('from')}>
          <Ionicons name="location-outline" size={24} color={colors.primary[500]} />
          <Text style={[styles.inputText, !fromWilaya && styles.placeholderText]}>
            {fromWilaya ? fromWilaya.name : 'Départ'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* To */}
        <TouchableOpacity style={styles.inputButton} onPress={() => openSelection('to')}>
          <Ionicons name="flag-outline" size={24} color={colors.primary[500]} />
          <Text style={[styles.inputText, !toWilaya && styles.placeholderText]}>
            {toWilaya ? toWilaya.name : 'Destination'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        {/* Date */}
        <TouchableOpacity style={styles.inputButton} onPress={() => setShowDatePicker(true)}>
          <Ionicons name="calendar-outline" size={24} color={colors.dark[400]} />
          <Text style={styles.inputText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false)
              if (selectedDate) setDate(selectedDate)
            }}
          />
        )}

        <View style={styles.divider} />

        {/* Seats */}
        <View style={styles.seatContainer}>
          <Ionicons name="people-outline" size={24} color={colors.dark[400]} />
          <Text style={styles.inputText}>Passagers</Text>
          <View style={styles.seatControls}>
            <TouchableOpacity
              onPress={() => setSeats(Math.max(1, seats - 1))}
              style={styles.seatButton}
            >
              <Ionicons name="remove" size={20} color={colors.dark[600]} />
            </TouchableOpacity>
            <Text style={styles.seatValue}>{seats}</Text>
            <TouchableOpacity
              onPress={() => setSeats(Math.min(4, seats + 1))}
              style={styles.seatButton}
            >
              <Ionicons name="add" size={20} color={colors.dark[600]} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Rechercher</Text>
      </TouchableOpacity>

      {/* Wilaya Selection Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              Sélectionner {selectionType === 'from' ? 'le départ' : "l'arrivée"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={colors.dark[900]} />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary[500]} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={wilayas}
              keyExtractor={(item) => item.code.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.wilayaItem} onPress={() => handleSelectWilaya(item)}>
                  <Text style={styles.wilayaCode}>{item.code}</Text>
                  <Text style={styles.wilayaName}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: 80,
    backgroundColor: colors.primary[600],
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  formCard: {
    backgroundColor: 'white',
    marginHorizontal: spacing.lg,
    borderRadius: 16,
    padding: spacing.md,
    marginTop: -30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  inputText: {
    fontSize: 16,
    color: colors.dark[900],
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: colors.dark[400],
  },
  divider: {
    height: 1,
    backgroundColor: colors.dark[100],
    marginLeft: 40,
  },
  seatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  seatControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  seatButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.dark[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark[900],
    width: 20,
    textAlign: 'center',
  },
  searchButton: {
    backgroundColor: colors.primary[600],
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: colors.primary[600],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[200],
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.dark[900],
  },
  closeButton: {
    padding: 4,
  },
  wilayaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.dark[100],
    backgroundColor: 'white',
  },
  wilayaCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary[600],
    width: 40,
  },
  wilayaName: {
    fontSize: 16,
    color: colors.dark[900],
  },
})

export default SearchScreen
