import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch,
    Alert,
} from 'react-native'
import { useAuthStore } from '../../store/authStore'
import { colors, spacing } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {
    const { user, logout } = useAuthStore()
    const navigation = useNavigation()
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [notifications, setNotifications] = useState(true)

    const handleLogout = () => {
        Alert.alert(
            'Déconnexion',
            'Êtes-vous sûr de vouloir vous déconnecter ?',
            [
                {
                    text: 'Annuler',
                    style: 'cancel',
                },
                {
                    text: 'Se déconnecter',
                    style: 'destructive',
                    onPress: () => logout(),
                },
            ]
        )
    }

    const menuItems = [
        {
            id: 'edit',
            title: 'Modifier le profil',
            icon: 'person-outline',
            onPress: () => Alert.alert('À venir', 'La modification du profil sera bientôt disponible'),
        },
        {
            id: 'payment',
            title: 'Moyens de paiement',
            icon: 'card-outline',
            onPress: () => { },
        },
        {
            id: 'history',
            title: 'Historique des trajets',
            icon: 'time-outline',
            onPress: () => { },
        },
        {
            id: 'security',
            title: 'Sécurité et confidentialité',
            icon: 'shield-checkmark-outline',
            onPress: () => { },
        },
        {
            id: 'help',
            title: 'Aide et support',
            icon: 'help-circle-outline',
            onPress: () => { },
        },
    ]

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{
                            uri: user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=10b981&color=fff`,
                        }}
                        style={styles.avatar}
                    />
                    {user?.isVerified && (
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark" size={12} color="white" />
                        </View>
                    )}
                </View>
                <Text style={styles.name}>{user?.fullName || 'Utilisateur'}</Text>
                <Text style={styles.role}>
                    {user?.role === 'driver' ? 'Conducteur' : 'Passager'}
                </Text>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>4.8</Text>
                    <Text style={styles.statLabel}>Note</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>124</Text>
                    <Text style={styles.statLabel}>Trajets</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>2 ans</Text>
                    <Text style={styles.statLabel}>Expérience</Text>
                </View>
            </View>

            {/* Menu */}
            <View style={styles.menuContainer}>
                <Text style={styles.sectionTitle}>Paramètres</Text>

                {/* Toggle options */}
                <View style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.primary[50] }]}>
                            <Ionicons name="notifications-outline" size={20} color={colors.primary[600]} />
                        </View>
                        <Text style={styles.menuItemTitle}>Notifications</Text>
                    </View>
                    <Switch
                        value={notifications}
                        onValueChange={setNotifications}
                        trackColor={{ false: colors.dark[200], true: colors.primary[500] }}
                        thumbColor={'white'}
                    />
                </View>

                <View style={styles.menuItem}>
                    <View style={styles.menuItemLeft}>
                        <View style={[styles.iconContainer, { backgroundColor: colors.dark[100] }]}>
                            <Ionicons name="moon-outline" size={20} color={colors.dark[600]} />
                        </View>
                        <Text style={styles.menuItemTitle}>Mode sombre</Text>
                    </View>
                    <Switch
                        value={isDarkMode}
                        onValueChange={setIsDarkMode}
                        trackColor={{ false: colors.dark[200], true: colors.primary[500] }}
                        thumbColor={'white'}
                    />
                </View>

                {/* Action items */}
                {menuItems.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.menuItem}
                        onPress={item.onPress}
                    >
                        <View style={styles.menuItemLeft}>
                            <View style={[styles.iconContainer, { backgroundColor: colors.dark[50] }]}>
                                <Ionicons name={item.icon as any} size={20} color={colors.dark[600]} />
                            </View>
                            <Text style={styles.menuItemTitle}>{item.title}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.dark[400]} />
                    </TouchableOpacity>
                ))}

                {/* Logout */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={colors.error} />
                    <Text style={styles.logoutText}>Se déconnecter</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.versionInfo}>
                <Text style={styles.versionText}>Version 1.0.0 (Build 142)</Text>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        padding: spacing.xl,
        paddingTop: 60,
        backgroundColor: 'white',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: colors.primary[100],
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary[500],
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.dark[900],
        marginBottom: 4,
    },
    role: {
        fontSize: 14,
        color: colors.dark[500],
        textTransform: 'capitalize',
        backgroundColor: colors.dark[100],
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        overflow: 'hidden',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        marginHorizontal: spacing.xl,
        marginTop: -20,
        padding: spacing.lg,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark[900],
    },
    statLabel: {
        fontSize: 12,
        color: colors.dark[500],
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.dark[100],
    },
    menuContainer: {
        padding: spacing.xl,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.dark[900],
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        padding: spacing.md,
        borderRadius: 12,
        marginBottom: spacing.md,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.02,
        shadowRadius: 2,
        elevation: 1,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.dark[700],
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        backgroundColor: colors.error + '10', // 10% opacity
        padding: spacing.md,
        borderRadius: 12,
        marginTop: spacing.lg,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.error,
    },
    versionInfo: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    versionText: {
        fontSize: 12,
        color: colors.dark[400],
    },
})

export default ProfileScreen
