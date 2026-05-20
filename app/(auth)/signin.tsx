import { useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

export default function SignInScreen() {
  const { t } = useTranslation()
  const setUser = useAuthStore((s) => s.setUser)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSignIn() {
    if (!email || !password) return
    setLoading(true)
    // Simulate auth request
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: 'user-1',
      name: 'User',
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
            <Text style={styles.heroTagline}>{t('splash.tagline')}</Text>
          </LinearGradient>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.title}>Welcome back 👋</Text>
            <Text style={styles.subtitle}>{t('auth.sign_in_subtitle')}</Text>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>{t('auth.email_label', 'Email')}</Text>
              <TextInput
                style={[
                  styles.input,
                  emailFocused && styles.inputActive,
                ]}
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
                  placeholder="••••••••"
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

            {/* Forgot password */}
            <Pressable style={styles.forgotWrap} onPress={() => {}}>
              <Text style={styles.forgotText}>
                {t('auth.forgot_password', 'Forgot password?')}
              </Text>
            </Pressable>

            {/* Primary CTA */}
            <Button
              label={t('auth.sign_in', 'Sign In')}
              onPress={handleSignIn}
              variant="primary"
              size="lg"
              loading={loading}
              style={styles.ctaBtn}
            />

            {/* OR divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.or', 'or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social buttons */}
            <View style={styles.socialRow}>
              <Button
                label={t('auth.facebook', 'Facebook')}
                onPress={() => {}}
                variant="secondary"
                size="md"
                icon={<Text style={styles.socialIcon}>📘</Text>}
                style={styles.socialBtn}
              />
              <Button
                label={t('auth.google', 'Google')}
                onPress={() => {}}
                variant="secondary"
                size="md"
                icon={<Text style={styles.socialIcon}>🔍</Text>}
                style={styles.socialBtn}
              />
            </View>

            {/* Sign up link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>{t('auth.no_account', "Don't have an account? ")}</Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text style={styles.linkText}>{t('auth.sign_up_free', 'Sign up free')}</Text>
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
    height: 260,
    borderBottomLeftRadius: 48,
    borderBottomRightRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 32,
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 8,
    letterSpacing: 0.2,
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
  forgotWrap: {
    alignItems: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.primary,
  },
  ctaBtn: {
    width: '100%',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: T.border,
  },
  dividerText: {
    fontSize: 13,
    color: T.muted,
    marginHorizontal: 12,
    fontWeight: '500',
  },
  socialRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },
  socialBtn: {
    flex: 1,
  },
  socialIcon: {
    fontSize: 15,
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
