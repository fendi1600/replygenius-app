import React, { useState, useMemo } from 'react'
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { SocialLogo } from '../../components/ui/SocialLogos'
import type { SocialPlatform } from '../../components/ui/SocialLogos'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { useInboxStore } from '../../stores/useInboxStore'
import Avatar from '../../components/ui/Avatar'
import PlatformBadge from '../../components/ui/PlatformBadge'
import Badge from '../../components/ui/Badge'
import type { Comment, Platform, CommentStatus, SourceType, Sentiment } from '../../types'

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const SENTIMENT_CONFIG: Record<Sentiment, { bg: string; color: string; label: string }> = {
  question: { bg: '#DCFCE7', color: '#15803D', label: 'Lead' },
  negative: { bg: '#FEE2E2', color: '#DC2626', label: 'Complaint' },
  positive: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Positive' },
  neutral:  { bg: '#F3F4F6', color: '#6B7280', label: 'Neutral' },
}

type PlatformFilter = Platform | 'all'
type StatusFilter = CommentStatus | 'all'
type SourceFilter = SourceType | 'all'

const SOURCE_LABELS: { key: SourceFilter; label: string }[] = [
  { key: 'all',     label: 'All Messages'    },
  { key: 'comment', label: 'Post Comments'   },
  { key: 'dm',      label: 'Direct Messages' },
]

type PlatformLogoConfig = {
  key: PlatformFilter
  social?: SocialPlatform
}

const PLATFORM_LOGOS: PlatformLogoConfig[] = [
  { key: 'all'       },
  { key: 'facebook',  social: 'facebook'  },
  { key: 'instagram', social: 'instagram' },
  { key: 'youtube',   social: 'youtube'   },
  { key: 'tiktok',    social: 'tiktok'    },
]

const STATUS_LABELS: { key: StatusFilter; label: string }[] = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'replied',   label: 'Replied'   },
  { key: 'approved',  label: 'Approved'  },
  { key: 'spam',      label: 'Spam'      },
  { key: 'escalated', label: 'Escalated' },
]

function FilterPill({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.pill, active && styles.pillActive]}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  )
}

function PlatformLogoPill({
  config,
  active,
  onPress,
}: {
  config: PlatformLogoConfig
  active: boolean
  onPress: () => void
}) {
  if (!config.social) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.75}
        style={[styles.pill, active && styles.pillActive]}
      >
        <Text style={[styles.pillText, active && styles.pillTextActive]}>All</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.logoPill, active && styles.logoPillActive]}
    >
      <SocialLogo platform={config.social} size={36} mono={active} />
    </TouchableOpacity>
  )
}

function CommentItem({ comment }: { comment: Comment }) {
  const router = useRouter()
  const { approve, markAsSpam, escalate } = useInboxStore()
  const sent = SENTIMENT_CONFIG[comment.sentiment]
  const isDM = comment.sourceType === 'dm'
  const isPending = comment.status === 'pending'

  return (
    <TouchableOpacity
      style={styles.commentCard}
      activeOpacity={isPending ? 0.85 : 1}
      onPress={() => isPending && router.push(`/reply/${comment.id}` as any)}
    >
      {/* Top row */}
      <View style={styles.commentTopRow}>
        <View style={styles.avatarWrap}>
          <Avatar initials={comment.userInitials} size={52} uri={comment.userAvatarUrl} />
          <View style={styles.platformBadgePos}>
            <PlatformBadge platform={comment.platform} size={18} />
          </View>
        </View>

        <View style={styles.commentMid}>
          <View style={styles.commentUserRow}>
            <Text style={styles.commentUsername} numberOfLines={1}>
              {comment.username}
            </Text>
            {isDM && (
              <View style={styles.dmBadge}>
                <Text style={styles.dmBadgeText}>DM</Text>
              </View>
            )}
          </View>
          <Text style={styles.commentAccount} numberOfLines={1}>
            {comment.accountName}
          </Text>
        </View>

        <View style={styles.commentRight}>
          <Text style={styles.commentTime}>{timeAgo(comment.timestamp)}</Text>
          <Badge label={sent.label} color={sent.color} bg={sent.bg} />
        </View>
      </View>

      {/* Comment text */}
      <View style={styles.commentTextWrap}>
        {isDM && (
          <Text style={styles.dmPrivateLabel}>Private conversation</Text>
        )}
        <Text style={styles.commentText} numberOfLines={2}>
          {comment.text}
        </Text>
      </View>

      {/* Action buttons for pending */}
      {isPending && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnAI]}
            onPress={() => router.push(`/reply/${comment.id}` as any)}
          >
            <Feather name="cpu" size={13} color={T.primary} />
            <Text style={[styles.actionBtnText, { color: T.primary }]}>AI Reply</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnGreen]}
            onPress={() => approve(comment.id)}
          >
            <Feather name="check" size={13} color='#15803D' />
            <Text style={[styles.actionBtnText, { color: '#15803D' }]}>Approve</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnOrange]}
            onPress={() => markAsSpam(comment.id)}
          >
            <Text style={[styles.actionBtnText, { color: '#B45309' }]}>🛡 Spam</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnRed]}
            onPress={() => escalate(comment.id)}
          >
            <Text style={[styles.actionBtnText, { color: '#DC2626' }]}>⚠ Escalate</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  )
}

export default function InboxScreen() {
  const { t } = useTranslation()
  const { comments, filters, setFilter } = useInboxStore()

  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('pending')

  const filtered = useMemo(() => {
    return comments.filter(c => {
      if (sourceFilter !== 'all' && c.sourceType !== sourceFilter) return false
      if (platformFilter !== 'all' && c.platform !== platformFilter) return false
      if (statusFilter !== 'all' && c.status !== statusFilter) return false
      return true
    })
  }, [comments, sourceFilter, platformFilter, statusFilter])

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Feather name="search" size={20} color={T.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Feather name="sliders" size={20} color={T.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter bar */}
      <View style={styles.filterContainer}>
        {/* Source type */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {SOURCE_LABELS.map(({ key, label }) => (
            <FilterPill
              key={key}
              label={label}
              active={sourceFilter === key}
              onPress={() => setSourceFilter(key)}
            />
          ))}
        </ScrollView>

        {/* Platform pills — logo icons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {PLATFORM_LOGOS.map((cfg) => (
            <PlatformLogoPill
              key={cfg.key}
              config={cfg}
              active={platformFilter === cfg.key}
              onPress={() => setPlatformFilter(cfg.key)}
            />
          ))}
        </ScrollView>

        {/* Status pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
          style={styles.filterScroll}
        >
          {STATUS_LABELS.map(({ key, label }) => (
            <FilterPill
              key={key}
              label={label}
              active={statusFilter === key}
              onPress={() => setStatusFilter(key)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Comment list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CommentItem comment={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Feather name="inbox" size={48} color={T.mutedLt} />
            <Text style={styles.emptyText}>No messages found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters</Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: T.navy,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    paddingVertical: 8,
  },
  filterScroll: {
    marginVertical: 3,
  },
  filterRow: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  pillActive: {
    backgroundColor: T.primaryLt,
    borderColor: T.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: T.muted,
  },
  pillTextActive: {
    color: T.primary,
  },
  logoPill: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.45,
  },
  logoPillActive: {
    opacity: 1,
    ...SHADOW.sm,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  separator: {
    height: 12,
  },
  commentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    ...SHADOW.sm,
  },
  commentTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  avatarWrap: {
    position: 'relative',
    width: 52,
    height: 52,
  },
  platformBadgePos: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  commentMid: {
    flex: 1,
  },
  commentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
    flex: 1,
  },
  commentAccount: {
    fontSize: 12,
    color: T.muted,
  },
  commentRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  commentTime: {
    fontSize: 11,
    color: T.mutedLt,
    fontWeight: '500',
  },
  dmBadge: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  dmBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0369A1',
  },
  commentTextWrap: {
    marginBottom: 10,
  },
  dmPrivateLabel: {
    fontSize: 11,
    color: '#0369A1',
    fontWeight: '600',
    marginBottom: 2,
  },
  commentText: {
    fontSize: 13,
    color: T.text,
    lineHeight: 19,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  actionBtnAI: {
    backgroundColor: T.primaryLt,
    borderColor: '#C4B5FD',
  },
  actionBtnGreen: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  actionBtnOrange: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  actionBtnRed: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FECACA',
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
  },
  emptySubText: {
    fontSize: 14,
    color: T.muted,
  },
})
