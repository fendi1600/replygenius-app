import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { T, RADIUS, SHADOW } from '../../constants/theme'
import Button from '../../components/ui/Button'
import LogoMark from '../../components/ui/LogoMark'
import SafeScreen from '../../components/layout/SafeScreen'
import { useAuthStore } from '../../stores/useAuthStore'

export default function SignUpScreen() {
  const { t } = useTranslation()
  const setUser = useAuthStore((s) => s.setUser)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [confirmFocused, setConfirmFocused] = useState(false)

  const passwordsMatch = password === confirmPassword || confirmPassword === ''
  const canSubmit = name.trim() && email.trim() && password.length >= 6 && password === confirmPassword

  async function handleSignUp() {
    if (!canSubmit) return
    setLoading(true)
    // Simulate registration request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: 'user-new',
      name: name.trim(),
      email,
      plan: 'creator',
    })
    setLoading(false)
    router.replace('/(tabs)/')
  }

  return (
    <SafeScreen edges={['bottom']} style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Hero gradient */}
          <LinearGradient
            colors={['#7B52EC', '#4C27B8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <LogoMark size="md" showWordmark />
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.title}>{t('auth.create_account', 'Create your account')}</Text>
            <Text style={styles.subtitle}>{t('auth.sign_up_subtitle', 'Start replying smarter in minutes.')}</Text>

            {/* Full Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.name_label', 'Full Name')}</Text>
              <TextInput
                style={[styles.input, nameFocused && styles.inputActive]}
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                placeholder={t('auth.name_placeholder', 'Jane Smith')}
                placeholderTextColor={T.mutedLt}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.email_label', 'Email')}</Text>
              <TextInput
                style={[styles.input, emailFocused && styles.inputActive]}
                value={email}
                onChangeText={setEmail}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                placeholder="you@example.com"
                placeholderTextColor={T.mutedLt}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.password_label', 'Password')}</Text>
              <View style={[styles.inputRow, passwordFocused && styles.inputActive]}>
                <TextInput
                  style={styles.inputFlex}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Min. 6 characters"
                  placeholderTextColor={T.mutedLt}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.confirm_password_label', 'Confirm Password')}</Text>
              <View
                style={[
                  styles.inputRow,
                  confirmFocused && styles.inputActive,
                  !passwordsMatch && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.inputFlex}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setConfirmFocused(true)}
                  onBlur={() => setConfirmFocused(false)}
                  placeholder="Re-enter password"
                  placeholderTextColor={T.mutedLt}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((v) => !v)}
                  style={styles.eyeBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
              {!passwordsMatch && (
                <Text style={styles.errorText}>
                  {t('auth.passwords_mismatch', 'Passwords do not match.')}
                </Text>
              )}
            </View>

            {/* CTA */}
            <Button
              label={t('auth.sign_up', 'Sign Up')}
              onPress={handleSignUp}
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!canSubmit}
              style={styles.ctaBtn}
            />

            {/* Terms */}
            <Text style={styles.termsText}>
              {t(
                'auth.terms',
                'By signing up you agree to our Terms of Service and Privacy Policy.',
              )}
            </Text>

            {/* Sign in link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>{t('auth.have_account', 'Already have an account? ')}</Text>
              <Link href="/(auth)/signin" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>{t('auth.sign_in', 'Sign In')}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  )
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: T.bg,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  hero: {
    height: 200,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: T.navy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: T.muted,
    marginBottom: 24,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
    marginBottom: 6,
  },
  input: {
    height: 48,
    borderWidth: 1.5,
    borderColor: T.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    fontSize: 15,
    color: T.text,
    backgroundColor: T.card,
    ...SHADOW.sm,
  },
  inputActive: {
    borderColor: T.primary,
  },
  inputError: {
    borderColor: T.red,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1.5,
    borderColor: T.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    backgroundColor: T.card,
    ...SHADOW.sm,
  },
  inputFlex: {
    flex: 1,
    fontSize: 15,
    color: T.text,
  },
  eyeBtn: {
    paddingLeft: 8,
  },
  eyeIcon: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: T.red,
    marginTop: 4,
  },
  ctaBtn: {
    width: '100%',
    marginTop: 4,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    color: T.muted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 14,
    color: T.muted,
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: T.primary,
  },
})
