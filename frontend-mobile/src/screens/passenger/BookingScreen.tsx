import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { bookingsApi } from '../../services/api'
import { colors, spacing } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'

const BookingScreen = () => {
    const route = useRoute()
    const navigation = useNavigation()
    const { trip, seats } = route.params as any || {}
    const [selectedPayment, setSelectedPayment] = useState('cash')
    const queryClient = useQueryClient()

    const createBookingMutation = useMutation({
        mutationFn: bookingsApi.create,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['my-bookings'] })
            Alert.alert(
                'Succès',
                'Votre réservation a été confirmée !',
                [
                    {
                        text: 'Voir mon billet',
                        onPress: () => navigation.navigate('Ticket', { bookingId: data.data.data.id } as never),
                    }
                ]
            )
        },
        onError: (error: any) => {
            Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue lors de la réservation.')
        },
    })

    const handleConfirm = () => {
        if (!trip) return

        createBookingMutation.mutate({
            tripId: trip.id,
            seats: seats || 1,
            payment: {
                method: selectedPayment,
            }
        })
    }

    if (!trip) return <View style={styles.container}><Text>Erreur: Trajet manquant</Text></View>

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Résumé de la réservation</Text>
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Trajet</Text>
                            <Text style={styles.value}>{trip.from?.city} → {trip.to?.city}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Date</Text>
                            <Text style={styles.value}>{trip.departure?.date} à {trip.departure?.time}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Places</Text>
                            <Text style={styles.value}>{seats} passager{seats > 1 ? 's' : ''}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <Text style={styles.label}>Prix total</Text>
                            <Text style={[styles.value, styles.price]}>{trip.pricing?.perSeat * seats} DZD</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Moyen de paiement</Text>

                    <TouchableOpacity
                        style={[styles.paymentOption, selectedPayment === 'cash' && styles.paymentOptionSelected]}
                        onPress={() => setSelectedPayment('cash')}
                    >
                        <View style={styles.paymentInfo}>
                            <Ionicons name="cash-outline" size={24} color={colors.primary[600]} />
                            <Text style={styles.paymentText}>Espèces (au conducteur)</Text>
                        </View>
                        {selectedPayment === 'cash' && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.paymentOption, selectedPayment === 'cib' && styles.paymentOptionSelected]}
                        onPress={() => setSelectedPayment('cib')}
                    >
                        <View style={styles.paymentInfo}>
                            <Ionicons name="card-outline" size={24} color={colors.secondary[600]} />
                            <Text style={styles.paymentText}>Carte CIB / Edahabia</Text>
                        </View>
                        {selectedPayment === 'cib' && (
                            <Ionicons name="checkmark-circle" size={24} color={colors.primary[500]} />
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total à payer</Text>
                    <Text style={styles.totalValue}>{trip.pricing?.perSeat * seats} DZD</Text>
                </View>
                <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleConfirm}
                    disabled={createBookingMutation.isPending}
                >
                    {createBookingMutation.isPending ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Text style={styles.confirmButtonText}>Confirmer</Text>
                            <Ionicons name="arrow-forward" size={20} color="white" />
                        </>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: spacing.lg,
        paddingBottom: 100,
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
    card: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: spacing.lg,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: spacing.xs,
    },
    label: {
        fontSize: 14,
        color: colors.dark[500],
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.dark[900],
    },
    price: {
        color: colors.primary[600],
        fontWeight: 'bold',
        fontSize: 18,
    },
    divider: {
        height: 1,
        backgroundColor: colors.dark[100],
        marginVertical: spacing.sm,
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: spacing.lg,
        borderRadius: 12,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    paymentOptionSelected: {
        borderColor: colors.primary[500],
        backgroundColor: colors.primary[50],
    },
    paymentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    paymentText: {
        fontSize: 16,
        color: colors.dark[900],
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
    },
    totalContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 12,
        color: colors.dark[500],
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.primary[600],
    },
    confirmButton: {
        backgroundColor: colors.primary[500],
        paddingHorizontal: spacing.xl,
        paddingVertical: 14,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
})

export default BookingScreen
