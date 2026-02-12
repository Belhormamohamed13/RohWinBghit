import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Switch } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { useMutation, useQuery } from '@tanstack/react-query'
import { tripsApi, wilayasApi } from '../../services/api'
import { colors, spacing } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

const PublishTripScreen = () => {
    // Basic implementation for publishing a trip
    // This requires wilaya selection, date picker, etc.
    const navigation = useNavigation()
    const [fromWilayaId, setFromWilayaId] = useState<number | null>(null)
    const [toWilayaId, setToWilayaId] = useState<number | null>(null)
    const [date, setDate] = useState(new Date())
    const [price, setPrice] = useState('')
    const [seats, setSeats] = useState('4')
    const [showDatePicker, setShowDatePicker] = useState(false)

    // For simplicity, using hardcoded wilayas or mock fetching, but ideally should use a modal selector
    const { data: wilayas } = useQuery({ queryKey: ['wilayas'], queryFn: () => wilayasApi.getAll().then(res => res.data.data) })

    const publishMutation = useMutation({
        mutationFn: tripsApi.create,
        onSuccess: () => {
            Alert.alert('Succès', 'Votre trajet a été publié !')
            navigation.goBack()
        },
        onError: (err: any) => {
            Alert.alert('Erreur', err.response?.data?.message || 'Erreur lors de la publication')
        }
    })

    const handlePublish = () => {
        if (!fromWilayaId || !toWilayaId || !price || !seats) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs')
            return
        }

        // This assumes backend handles basic data properly
        // In reality, need vehicles, proper date formatting, etc.
        publishMutation.mutate({
            fromWilayaId: fromWilayaId,
            toWilayaId: toWilayaId,
            departure: {
                date: date.toISOString().split('T')[0],
                time: date.getHours() + ':' + date.getMinutes()
            },
            seats: parseInt(seats),
            price: parseInt(price),
            vehicleId: 'default-vehicle-id' // Ideally select vehicle
        })
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Publier un trajet</Text>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Départ (Wilaya ID)</Text>
                {/* Simplified input for prototype - should be a picker */}
                <TextInput
                    style={styles.input}
                    placeholder="Code Wilaya (ex: 16)"
                    keyboardType="numeric"
                    onChangeText={(t) => setFromWilayaId(parseInt(t))}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Destination (Wilaya ID)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Code Wilaya (ex: 31)"
                    keyboardType="numeric"
                    onChangeText={(t) => setToWilayaId(parseInt(t))}
                />
            </View>

            <View style={styles.formGroup}>
                <Text style={styles.label}>Date et Heure</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                    <Text>{date.toLocaleString()}</Text>
                </TouchableOpacity>
                {/* Note: DateTimePicker handling varies by platform (iOS/Android), simplifying here */}
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="datetime"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false)
                            if (selectedDate) setDate(selectedDate)
                        }}
                    />
                )}
            </View>

            <View style={styles.row}>
                <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                    <Text style={styles.label}>Prix (DZD)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1000"
                        keyboardType="numeric"
                        value={price}
                        onChangeText={setPrice}
                    />
                </View>
                <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                    <Text style={styles.label}>Places</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="4"
                        keyboardType="numeric"
                        value={seats}
                        onChangeText={setSeats}
                    />
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePublish}>
                <Text style={styles.buttonText}>Publier le trajet</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.xl,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: spacing.xl,
        color: colors.dark[900],
    },
    formGroup: {
        marginBottom: spacing.lg,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: spacing.sm,
        color: colors.dark[700],
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: colors.dark[200],
        borderRadius: 12,
        padding: spacing.md,
        fontSize: 16,
    },
    dateButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: colors.dark[200],
        borderRadius: 12,
        padding: spacing.md,
    },
    row: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: colors.primary[500],
        padding: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    }
})

export default PublishTripScreen
