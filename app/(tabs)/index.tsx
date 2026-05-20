import React, { useMemo } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { useInboxStore } from '../../stores/useInboxStore'
import { useAuthStore } from '../../stores/useAuthStore'
import Avatar from '../../components/ui/Avatar'
import PlatformBadge from '../../components/ui/PlatformBadge'
import Badge from '../../components/ui/Badge'
import type { Sentiment } from '../../types'

const { width } = Dimensions.get('window')

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`
  return `${Math.floor(diff / 86400)}d`
}

const SENTIMENT_CONFIG: Record<Sentiment, { bg: string; color: string; label: string }> = {
  question: { bg: '#DCFCE7', color: '#15803D', label: 'Lead' },
  negative: { bg: '#FEE2E2', color: '#DC2626', label: 'Complaint' },
  positive: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Positive' },
  neutral:  { bg: '#F3F4F6', color: '#6B7280', label: 'Neutral' },
}

const QUICK_ACTIONS = [
  { icon: 'cpu',    iconBg: '#EDE9FF', label: 'AI Reply\nGenerator',  route: '/(tabs)/inbox'     },
  { icon: 'edit-2', iconBg: '#DCFCE7', label: 'Message\nEnhancer',    route: '/(tabs)/inbox'     },
  { icon: 'search', iconBg: '#FEF3C7', label: 'Context\nAnalyzer',    route: '/(tabs)/analytics' },
  { icon: 'grid',   iconBg: '#DBEAFE', label: 'Templates',            route: '/(tabs)/templates' },
] as const

export default function HomeScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const user = useAuthStore(s => s.user)
  const comments = useInboxStore(s => s.comments)

  const firstName = user?.name?.split(' ')[0] ?? 'User'

  const stats = useMemo(() => {
    const total = 1248
    const replied = comments.filter(c => c.status === 'replied' || c.status === 'approved').length
    const pending = comments.length
    const replyRate = pending > 0 ? Math.round((replied / (pending || 1)) * 100) : 82
    const leads      = comments.filter(c => c.sentiment === 'question').length
    const complaints = comments.filter(c => c.sentiment === 'negative').length
    const spam       = comments.filter(c => c.status === 'spam').length
    return { total, replyRate, leads, complaints, spam }
  }, [comments])

  const recentComments = useMemo(() => comments.slice(0, 4), [comments])

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetTitle}>{getGreeting()}, {firstName} 👋</Text>
        <Text style={styles.greetSub}>Let's create great replies today.</Text>
      </View>

      {/* Hero Card */}
      <LinearGradient
        colors={['#7B52EC', '#4C27B8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        {/* Row 1 */}
        <View style={styles.heroRow1}>
          <Text style={styles.heroLabel}>Today Overview</Text>
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/analytics')}
            style={styles.heroBtn}
          >
            <Text style={styles.heroBtnText}>View Analytics →</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: 2-col grid */}
        <View style={styles.heroGrid2}>
          <View style={styles.heroStatBox}>
            <View style={styles.heroIconBox}>
              <Text style={styles.heroIconEmoji}>⚡</Text>
            </View>
            <Text style={styles.heroStatNum}>{stats.total.toLocaleString()}</Text>
            <Text style={styles.heroStatLbl}>Total Replies</Text>
          </View>
          <View style={styles.heroStatBox}>
            <View style={styles.heroIconBox}>
              <Text style={styles.heroIconEmoji}>📈</Text>
            </View>
            <Text style={styles.heroStatNum}>{stats.replyRate}%</Text>
            <Text style={styles.heroStatLbl}>AI Success Rate</Text>
          </View>
        </View>

        <View style={styles.heroDivider} />

        {/* Row 3: 3-col grid */}
        <View style={styles.heroGrid3}>
          <View style={styles.heroMiniStat}>
            <View style={[styles.heroMiniIcon, { backgroundColor: '#22C55E' }]} />
            <Text style={styles.heroMiniNum}>{stats.leads}</Text>
            <Text style={styles.heroMiniLbl}>Leads</Text>
          </View>
          <View style={[styles.heroMiniStat, styles.heroMiniSep]}>
            <View style={[styles.heroMiniIcon, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.heroMiniNum}>{stats.complaints}</Text>
            <Text style={styles.heroMiniLbl}>Complaints</Text>
          </View>
          <View style={[styles.heroMiniStat, styles.heroMiniSep]}>
            <View style={[styles.heroMiniIcon, { backgroundColor: '#A78BFA' }]} />
            <Text style={styles.heroMiniNum}>{stats.spam}</Text>
            <Text style={styles.heroMiniLbl}>Spam Blocked</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity>
            <Text style={styles.sectionLink}>Customize</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={styles.quickCard}
              activeOpacity={0.8}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.quickIconCircle, { backgroundColor: item.iconBg }]}>
                <Feather name={item.icon as any} size={20} color={T.primary} />
              </View>
              <Text style={styles.quickLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Conversations */}
      <View style={[styles.section, { marginBottom: 40 }]}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Conversations</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/inbox')}>
            <Text style={styles.sectionLink}>View All →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentCard}>
          {recentComments.map((c, idx) => {
            const sent = SENTIMENT_CONFIG[c.sentiment]
            return (
              <React.Fragment key={c.id}>
                <TouchableOpacity
                  style={styles.recentRow}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/reply/${c.id}` as any)}
                >
                  {/* Avatar + platform badge */}
                  <View style={styles.avatarWrap}>
                    <Avatar initials={c.userInitials} size={54} uri={c.userAvatarUrl} />
                    <View style={styles.platformBadgePos}>
                      <PlatformBadge platform={c.platform} size={18} />
                    </View>
                  </View>

                  {/* Middle content */}
                  <View style={styles.recentMid}>
                    <Text style={styles.recentUser} numberOfLines={1}>{c.username}</Text>
                    <Text style={styles.recentPreview} numberOfLines={2}>{c.text}</Text>
                  </View>

                  {/* Right: time + badge */}
                  <View style={styles.recentRight}>
                    <Text style={styles.recentTime}>{timeAgo(c.timestamp)}</Text>
                    <Badge
                      label={sent.label}
                      color={sent.color}
                      bg={sent.bg}
                    />
                  </View>
                </TouchableOpacity>
                {idx < recentComments.length - 1 && (
                  <View style={styles.rowDivider} />
                )}
              </React.Fragment>
            )
          })}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
  },
  greetTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  greetSub: {
    fontSize: 15,
    color: '#64748B',
  },

  // Hero card
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: RADIUS['2xl'],
    padding: 20,
    ...SHADOW.hero,
  },
  heroRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  heroBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  heroBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  heroGrid2: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  heroStatBox: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroIconBox: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.20)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroIconEmoji: {
    fontSize: 16,
  },
  heroStatNum: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 2,
  },
  heroStatLbl: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 12,
    fontWeight: '500',
  },
  heroDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.20)',
    marginBottom: 16,
  },
  heroGrid3: {
    flexDirection: 'row',
  },
  heroMiniStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroMiniSep: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255,255,255,0.20)',
  },
  heroMiniIcon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  heroMiniNum: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  heroMiniLbl: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Sections
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: T.navy,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: '600',
    color: T.primary,
  },

  // Quick actions
  quickGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  quickCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: T.border,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    ...SHADOW.sm,
  },
  quickIconCircle: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: T.text,
    textAlign: 'center',
    lineHeight: 15,
  },

  // Recent conversations
  recentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    ...SHADOW.md,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
    width: 54,
    height: 54,
  },
  platformBadgePos: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  recentMid: {
    flex: 1,
  },
  recentUser: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
    marginBottom: 3,
  },
  recentPreview: {
    fontSize: 12,
    color: T.muted,
    lineHeight: 17,
  },
  recentRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  recentTime: {
    fontSize: 11,
    color: T.mutedLt,
    fontWeight: '500',
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 20,
  },
})
