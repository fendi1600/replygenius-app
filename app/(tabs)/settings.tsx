import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { useAuthStore } from '../../stores/useAuthStore'
import { router } from 'expo-router'
import i18n from '../../i18n'

const PLAN_LABELS: Record<string, string> = {
  free: 'Free', creator: 'Creator', business: 'Business', agency: 'Agency',
}

export default function SettingsScreen() {
  const { t } = useTranslation()
  const { user, signOut } = useAuthStore()
  const [lang, setLang] = useState<'en' | 'ms'>(i18n.language as 'en' | 'ms')

  const toggleLang = () => {
    const next = lang === 'en' ? 'ms' : 'en'
    setLang(next)
    i18n.changeLanguage(next)
  }

  const handleSignOut = () => {
    Alert.alert(t('auth.sign_out'), t('auth.sign_out_confirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.sign_out'), style: 'destructive',
        onPress: () => { signOut(); router.replace('/(auth)/signin') },
      },
    ])
  }

  const settingRows = [
    { label: t('settings.profile'),       icon: '👤', onPress: () => {} },
    { label: t('settings.notifications'), icon: '🔔', onPress: () => {} },
    { label: t('settings.business_hours'), icon: '🕘', value: '9AM – 9PM', onPress: () => {} },
    { label: t('settings.auto_reply'),    icon: '🤖', onPress: () => {} },
    { label: t('settings.ai_tone'),       icon: '💬', value: 'Friendly', onPress: () => {} },
    { label: t('settings.privacy'),       icon: '🔒', onPress: () => {} },
  ]

  const supportRows = [
    { label: t('settings.help'),    icon: '❓', onPress: () => {} },
    { label: t('settings.support'), icon: '📧', onPress: () => {} },
  ]

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('settings.title')}</Text>

        {/* Profile card */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>{user?.name?.[0] ?? 'M'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{user?.name ?? 'MintG Team'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            <View style={styles.planPill}>
              <Text style={styles.planPillText}>👑 {PLAN_LABELS[user?.plan ?? 'creator']} Plan</Text>
            </View>
          </View>
        </View>

        {/* Language toggle */}
        <View style={[styles.card, styles.langCard]}>
          <Text style={styles.langLabel}>🌐  {t('settings.language')}</Text>
          <View style={styles.langToggle}>
            <TouchableOpacity
              onPress={() => { setLang('en'); i18n.changeLanguage('en') }}
              style={[styles.langBtn, lang === 'en' && styles.langBtnActive]}
            >
              <Text style={[styles.langBtnText, lang === 'en' && styles.langBtnTextActive]}>EN</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setLang('ms'); i18n.changeLanguage('ms') }}
              style={[styles.langBtn, lang === 'ms' && styles.langBtnActive]}
            >
              <Text style={[styles.langBtnText, lang === 'ms' && styles.langBtnTextActive]}>BM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings rows */}
        <Text style={styles.sectionLabel}>{t('settings.section_settings')}</Text>
        <View style={styles.card}>
          {settingRows.map((r, i) => (
            <View key={r.label}>
              <TouchableOpacity style={styles.row} onPress={r.onPress}>
                <View style={styles.rowIcon}><Text style={styles.rowEmoji}>{r.icon}</Text></View>
                <Text style={styles.rowLabel}>{r.label}</Text>
                {r.value && <Text style={styles.rowValue}>{r.value}</Text>}
                <Text style={styles.rowArrow}>›</Text>
              </TouchableOpacity>
              {i < settingRows.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        {/* Support rows */}
        <Text style={styles.sectionLabel}>{t('settings.section_support')}</Text>
        <View style={styles.card}>
          {supportRows.map((r, i) => (
            <View key={r.label}>
              <TouchableOpacity style={styles.row} onPress={r.onPress}>
                <View style={styles.rowIcon}><Text style={styles.rowEmoji}>{r.icon}</Text></View>
                <Text style={styles.rowLabel}>{r.label}</Text>
                <Text style={styles.rowArrow}>›</Text>
              </TouchableOpacity>
              {i < supportRows.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <Text style={styles.version}>{t('settings.version', { version: '1.0.0' })}</Text>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t('auth.sign_out')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: '#fff' },
  content:         { padding: 20, paddingBottom: 40, gap: 12 },
  title:           { fontSize: 24, fontWeight: '800', color: T.text, marginBottom: 4 },
  card:            { backgroundColor: '#fff', borderRadius: RADIUS.xl, borderWidth: 1, borderColor: T.border, overflow: 'hidden', ...SHADOW.sm },
  profileCard:     { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  profileAvatar:   { width: 52, height: 52, borderRadius: 16, backgroundColor: T.primary, alignItems: 'center', justifyContent: 'center' },
  profileInitial:  { fontSize: 22, color: '#fff', fontWeight: '800' },
  profileName:     { fontSize: 16, fontWeight: '800', color: T.text },
  profileEmail:    { fontSize: 13, color: T.muted, marginTop: 1 },
  planPill:        { marginTop: 6, backgroundColor: '#FFFBEB', borderWidth: 1, borderColor: '#FDE68A', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  planPillText:    { fontSize: 11, fontWeight: '800', color: '#92400E' },
  langCard:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  langLabel:       { fontSize: 14, fontWeight: '600', color: T.text },
  langToggle:      { flexDirection: 'row', backgroundColor: T.bg, borderRadius: 10, padding: 3, gap: 3 },
  langBtn:         { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 8 },
  langBtnActive:   { backgroundColor: T.primary },
  langBtnText:     { fontSize: 13, fontWeight: '700', color: T.muted },
  langBtnTextActive: { color: '#fff' },
  sectionLabel:    { fontSize: 11, fontWeight: '700', color: T.muted, letterSpacing: 0.8, marginTop: 4, marginLeft: 4 },
  row:             { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  rowIcon:         { width: 36, height: 36, borderRadius: 10, backgroundColor: T.bg, alignItems: 'center', justifyContent: 'center' },
  rowEmoji:        { fontSize: 18 },
  rowLabel:        { flex: 1, fontSize: 14, fontWeight: '600', color: T.text },
  rowValue:        { fontSize: 12, color: T.muted, marginRight: 4 },
  rowArrow:        { fontSize: 18, color: T.mutedLt },
  divider:         { height: 1, backgroundColor: T.border, marginHorizontal: 14 },
  version:         { textAlign: 'center', fontSize: 12, color: T.mutedLt, marginTop: 8 },
  signOutBtn:      { backgroundColor: T.redLt, borderRadius: RADIUS.lg, padding: 16, alignItems: 'center', marginTop: 4 },
  signOutText:     { fontSize: 15, fontWeight: '800', color: T.red },
})
