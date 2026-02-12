import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import QRCode from 'react-native-qrcode-svg'
import { colors, spacing } from '../../constants/theme'

const TicketScreen = () => {
  const navigation = useNavigation()

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Mon billet RohWinBghit - Trajet Alger vers Oran le 15/01/2024',
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.dark[700]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon billet</Text>
        <TouchableOpacity onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.dark[700]} />
        </TouchableOpacity>
      </View>

      {/* Ticket Card */}
      <View style={styles.ticketContainer}>
        <View style={styles.ticket}>
          {/* Ticket Header */}
          <View style={styles.ticketHeader}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>🚗</Text>
              <Text style={styles.logoText}>RohWinBghit</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Confirmé</Text>
            </View>
          </View>

          {/* Route Info */}
          <View style={styles.routeSection}>
            <View style={styles.routeInfo}>
              <Text style={styles.city}>Alger</Text>
              <Text style={styles.time}>08:00</Text>
            </View>
            <View style={styles.routeLine}>
              <View style={styles.dot} />
              <View style={styles.line} />
              <Ionicons name="car" size={20} color={colors.primary[600]} />
              <View style={styles.line} />
              <View style={styles.dot} />
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.city}>Oran</Text>
              <Text style={styles.time}>12:30</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.cutoutLeft} />
            <View style={styles.dashedLine} />
            <View style={styles.cutoutRight} />
          </View>

          {/* Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>15 Jan 2024</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Passagers</Text>
                <Text style={styles.detailValue}>2 places</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Conducteur</Text>
                <Text style={styles.detailValue}>Ahmed B.</Text>
              </View>
              <View style={styles.detail}>
                <Text style={styles.detailLabel}>Prix</Text>
                <Text style={styles.detailValue}>1,600 DZD</Text>
              </View>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrSection}>
            <QRCode
              value="BOOKING_123456"
              size={150}
              color={colors.dark[900]}
              backgroundColor="white"
            />
            <Text style={styles.qrText}>Présentez ce QR code au conducteur</Text>
            <Text style={styles.bookingId}>N° BK-123456</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call-outline" size={24} color={colors.primary[600]} />
          <Text style={styles.actionText}>Appeler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={24} color={colors.primary[600]} />
          <Text style={styles.actionText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
          <Ionicons name="close-circle-outline" size={24} color={colors.error} />
          <Text style={[styles.actionText, styles.cancelText]}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dark[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    paddingTop: 60,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.dark[900],
  },
  ticketContainer: {
    padding: spacing.lg,
  },
  ticket: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.primary[600],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: 'white',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    color: colors.primary[600],
    fontWeight: '600',
    fontSize: 12,
  },
  routeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  routeInfo: {
    alignItems: 'center',
  },
  city: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.dark[900],
  },
  time: {
    fontSize: 14,
    color: colors.dark[500],
    marginTop: spacing.xs,
  },
  routeLine: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary[600],
  },
  line: {
    flex: 1,
    height: 2,
    backgroundColor: colors.primary[200],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cutoutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.dark[50],
    position: 'absolute',
    left: -10,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.dark[50],
    position: 'absolute',
    right: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.dark[200],
    marginHorizontal: spacing.lg,
  },
  detailsSection: {
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  detail: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.dark[400],
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.dark[900],
  },
  qrSection: {
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.dark[50],
  },
  qrText: {
    fontSize: 14,
    color: colors.dark[500],
    marginTop: spacing.md,
    textAlign: 'center',
  },
  bookingId: {
    fontSize: 12,
    color: colors.dark[400],
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.lg,
    backgroundColor: 'white',
  },
  actionButton: {
    alignItems: 'center',
    padding: spacing.md,
  },
  actionText: {
    marginTop: spacing.xs,
    color: colors.primary[600],
    fontWeight: '500',
  },
  cancelButton: {},
  cancelText: {
    color: colors.error,
  },
})

export default TicketScreen
