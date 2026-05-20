import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { router } from 'expo-router'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { mockNotifications } from '../../data/mock'
import type { Notification } from '../../types'

const TYPE_CONFIG = {
  comment: { emoji: '💬', bg: '#EDE9FF', color: T.primary },
  reply:   { emoji: '📤', bg: '#DCFCE7', color: T.green   },
  auto:    { emoji: '⚡', bg: '#FEF3C7', color: T.amber   },
  system:  { emoji: '🔔', bg: '#DBEAFE', color: T.blue    },
  spam:    { emoji: '🛡️', bg: '#FEF2F2', color: T.red     },
}

const GROUPS = ['Today', 'Yesterday', 'This Week'] as const

export default function NotificationsScreen() {
  const { t } = useTranslation()
  const [notifs, setNotifs] = useState<Notification[]>(mockNotifications)

  const markAll = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))
  const unreadCount = notifs.filter(n => n.unread).length

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('notifications.title')}</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAll}>
            <Text style={styles.markAll}>{t('common.mark_all_read')}</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {GROUPS.map(group => {
          const items = notifs.filter(n => n.group === group)
          if (!items.length) return null
          return (
            <View key={group} style={styles.group}>
              <Text style={styles.groupLabel}>
                {t(`notifications.${group.toLowerCase().replace(' ', '_')}` as any)}
              </Text>
              <View style={styles.card}>
                {items.map((n, i) => {
                  const cfg = TYPE_CONFIG[n.type]
                  return (
                    <View key={n.id}>
                      <View style={[styles.row, n.unread && styles.rowUnread]}>
                        {/* Icon */}
                        <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
                          <Text style={styles.iconEmoji}>{cfg.emoji}</Text>
                        </View>
                        {/* Content */}
                        <View style={styles.content}>
                          <Text style={[styles.notifTitle, n.unread && styles.notifTitleUnread]}>
                            {n.title}
                          </Text>
                          <Text style={styles.notifSub}>{n.subtitle}</Text>
                        </View>
                        {/* Unread dot */}
                        {n.unread && <View style={styles.dot} />}
                      </View>
                      {i < items.length - 1 && <View style={styles.divider} />}
                    </View>
                  )
                })}
              </View>
            </View>
          )
        })}

        {notifs.length === 0 && (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>{t('notifications.empty')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#fff' },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backBtn:       { marginRight: 8, padding: 4 },
  backArrow:     { fontSize: 28, color: T.text, lineHeight: 32 },
  title:         { flex: 1, fontSize: 22, fontWeight: '800', color: T.text },
  markAll:       { fontSize: 13, fontWeight: '700', color: T.primary },
  scroll:        { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 32, gap: 20 },
  group:         { gap: 10 },
  groupLabel:    { fontSize: 13, fontWeight: '700', color: T.muted },
  card:          { backgroundColor: '#fff', borderRadius: RADIUS.xl, borderWidth: 1, borderColor: T.border, overflow: 'hidden', ...SHADOW.md },
  row:           { flexDirection: 'row', alignItems: 'flex-start', padding: 16, gap: 12 },
  rowUnread:     { backgroundColor: '#F5F3FF' },
  iconCircle:    { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  iconEmoji:     { fontSize: 20 },
  content:       { flex: 1 },
  notifTitle:    { fontSize: 14, fontWeight: '600', color: T.text, marginBottom: 2 },
  notifTitleUnread: { fontWeight: '800' },
  notifSub:      { fontSize: 12, color: T.muted },
  dot:           { width: 8, height: 8, borderRadius: 4, backgroundColor: T.primary, marginTop: 6, flexShrink: 0 },
  divider:       { height: 1, backgroundColor: T.border, marginHorizontal: 16 },
  empty:         { alignItems: 'center', paddingVertical: 60 },
  emptyIcon:     { fontSize: 48, marginBottom: 12 },
  emptyText:     { fontSize: 15, fontWeight: '700', color: T.muted },
})
