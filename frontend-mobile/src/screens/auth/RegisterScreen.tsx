import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { colors, spacing } from '../../constants/theme'
import { authApi } from '../../services/api'

const RegisterScreen = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<'passenger' | 'driver'>('passenger')
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !phone) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs')
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.register({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
      })

      Alert.alert(
        'Compte créé',
        'Votre compte a été créé avec succès. Veuillez vous connecter.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login' as never) }]
      )

    } catch (error: any) {
      console.error(error)
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription.'
      Alert.alert('Erreur', message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoignez la communauté RohWinBghit</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.roleContainer}>
          <TouchableOpacity
            style={[styles.roleButton, role === 'passenger' && styles.roleButtonActive]}
            onPress={() => setRole('passenger')}
          >
            <Ionicons
              name="person-outline"
              size={24}
              color={role === 'passenger' ? colors.primary[600] : colors.dark[400]}
            />
            <Text style={[styles.roleText, role === 'passenger' && styles.roleTextActive]}>
              Passager
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, role === 'driver' && styles.roleButtonActive]}
            onPress={() => setRole('driver')}
          >
            <Ionicons
              name="car-outline"
              size={24}
              color={role === 'driver' ? colors.primary[600] : colors.dark[400]}
            />
            <Text style={[styles.roleText, role === 'driver' && styles.roleTextActive]}>
              Conducteur
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={colors.dark[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={20} color={colors.dark[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.dark[400]} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={colors.dark[400]}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Création...' : 'Créer mon compte'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Déjà un compte? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
              <Text style={styles.loginLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: spacing.xl,
  },
  header: {
    marginTop: 40,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.dark[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.dark[500],
  },
  roleContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.dark[200],
    gap: spacing.sm,
  },
  roleButtonActive: {
    borderColor: colors.primary[600],
    backgroundColor: colors.primary[50],
  },
  roleText: {
    color: colors.dark[600],
    fontWeight: '500',
  },
  roleTextActive: {
    color: colors.primary[600],
  },
  form: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfWidth: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.dark[200],
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.dark[900],
  },
  registerButton: {
    backgroundColor: colors.primary[600],
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  loginText: {
    color: colors.dark[500],
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary[600],
    fontSize: 14,
    fontWeight: '600',
  },
})

export default RegisterScreen
