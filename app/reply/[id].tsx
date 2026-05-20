import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Animated,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { useInboxStore } from '../../stores/useInboxStore'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import PlatformBadge from '../../components/ui/PlatformBadge'
import type { Sentiment, ReplyTone } from '../../types'

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

const SENTIMENT_CONFIG: Record<Sentiment, { bg: string; color: string; label: string }> = {
  question: { bg: '#DCFCE7', color: '#15803D', label: 'Lead'      },
  negative: { bg: '#FEE2E2', color: '#DC2626', label: 'Complaint' },
  positive: { bg: '#DBEAFE', color: '#1D4ED8', label: 'Positive'  },
  neutral:  { bg: '#F3F4F6', color: '#6B7280', label: 'Neutral'   },
}

const TONES: { key: ReplyTone; label: string; emoji: string }[] = [
  { key: 'friendly',     label: 'Friendly',     emoji: '😊' },
  { key: 'professional', label: 'Professional', emoji: '💼' },
  { key: 'sales',        label: 'Sales',        emoji: '🚀' },
]

export default function ReplyScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { id } = useLocalSearchParams<{ id: string }>()

  const { comments, selectedTone, setTone, sendReply, markAsSpam } = useInboxStore()
  const comment = comments.find(c => c.id === id)

  const [tone, setLocalTone] = useState<ReplyTone>(selectedTone)
  const [selectedSuggestionIdx, setSelectedSuggestionIdx] = useState(0)
  const [editText, setEditText] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const successOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (comment) {
      const suggestion = comment.aiSuggestions.find(s => s.tone === tone)
      setEditText(suggestion?.text ?? '')
      setSelectedSuggestionIdx(0)
    }
  }, [tone, comment?.id])

  const handleToneChange = (t: ReplyTone) => {
    setLocalTone(t)
    setTone(t)
  }

  const handleSuggestionSelect = (idx: number) => {
    setSelectedSuggestionIdx(idx)
    if (comment) {
      setEditText(comment.aiSuggestions[idx]?.text ?? '')
    }
  }

  const handleSend = () => {
    if (!comment) return
    sendReply(comment.id)
    setShowSuccess(true)
    Animated.timing(successOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
    setTimeout(() => {
      router.back()
    }, 1500)
  }

  const handleSkip = () => {
    router.back()
  }

  if (!comment) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Feather name="alert-circle" size={48} color={T.mutedLt} />
          <Text style={styles.notFoundText}>Comment not found</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
            <Text style={styles.backLinkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const sent = SENTIMENT_CONFIG[comment.sentiment]
  const suggestions = comment.aiSuggestions.filter(s => s.tone === tone)

  if (showSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.successScreen, { opacity: successOpacity }]}>
          <LinearGradient
            colors={[T.primary, T.primaryDk]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.successIconWrap}
          >
            <Feather name="check" size={36} color="#FFFFFF" />
          </LinearGradient>
          <Text style={styles.successTitle}>Reply Sent!</Text>
          <Text style={styles.successSub}>Your reply has been approved and sent.</Text>
        </Animated.View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Back bar */}
      <View style={styles.backBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={T.text} />
        </TouchableOpacity>
        <Text style={styles.backTitle}>Reply to Comment</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Comment bubble */}
        <View style={styles.commentBubbleWrap}>
          <View style={styles.commentUserRow}>
            <View style={styles.avatarWrap}>
              <Avatar initials={comment.userInitials} size={44} uri={comment.userAvatarUrl} />
              <View style={styles.platformBadgePos}>
                <PlatformBadge platform={comment.platform} size={16} />
              </View>
            </View>
            <View style={styles.commentUserInfo}>
              <Text style={styles.commentUsername}>{comment.username}</Text>
              <Text style={styles.commentTime}>{timeAgo(comment.timestamp)}</Text>
            </View>
            <Badge label={sent.label} color={sent.color} bg={sent.bg} />
          </View>
          <View style={styles.commentBubble}>
            <Text style={styles.commentBubbleText}>{comment.text}</Text>
          </View>
        </View>

        {/* Tone selector */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionLabel}>Reply Tone</Text>
          <View style={styles.toneRow}>
            {TONES.map(({ key, label, emoji }) => (
              <TouchableOpacity
                key={key}
                style={[styles.tonePill, tone === key && styles.tonePillActive]}
                onPress={() => handleToneChange(key)}
                activeOpacity={0.75}
              >
                <Text style={styles.toneEmoji}>{emoji}</Text>
                <Text style={[styles.tonePillText, tone === key && styles.tonePillTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <View style={styles.sectionWrap}>
            <Text style={styles.sectionLabel}>AI Suggestions</Text>
            <View style={{ gap: 10 }}>
              {suggestions.map((s, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.suggestionCard,
                    selectedSuggestionIdx === idx && styles.suggestionCardActive,
                  ]}
                  onPress={() => handleSuggestionSelect(idx)}
                  activeOpacity={0.82}
                >
                  {selectedSuggestionIdx === idx && (
                    <View style={styles.suggestionCheck}>
                      <Feather name="check-circle" size={16} color={T.primary} />
                    </View>
                  )}
                  <Text style={styles.suggestionText}>{s.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Edit box */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionLabel}>Edit Your Reply</Text>
          <TextInput
            style={styles.editBox}
            value={editText}
            onChangeText={setEditText}
            multiline
            placeholder="Write your reply here..."
            placeholderTextColor={T.mutedLt}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{editText.length} characters</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipBtnText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.sendBtn, !editText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!editText.trim()}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[T.primary, T.primaryDk]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.sendBtnGradient}
          >
            <Feather name="send" size={16} color="#FFFFFF" />
            <Text style={styles.sendBtnText}>Approve & Send</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  backBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: T.navy,
  },
  scroll: {
    flex: 1,
  },

  // Comment bubble
  commentBubbleWrap: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    ...SHADOW.sm,
  },
  commentUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  avatarWrap: {
    position: 'relative',
    width: 44,
    height: 44,
  },
  platformBadgePos: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  commentUserInfo: {
    flex: 1,
  },
  commentUsername: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
    marginBottom: 2,
  },
  commentTime: {
    fontSize: 12,
    color: T.muted,
  },
  commentBubble: {
    backgroundColor: T.bg,
    borderRadius: RADIUS.md,
    padding: 12,
  },
  commentBubbleText: {
    fontSize: 14,
    color: T.text,
    lineHeight: 21,
  },

  // Tone selector
  sectionWrap: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
    marginBottom: 10,
  },
  toneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  tonePill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: '#FFFFFF',
  },
  tonePillActive: {
    borderColor: T.primary,
    backgroundColor: T.primaryLt,
  },
  toneEmoji: {
    fontSize: 14,
  },
  tonePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: T.muted,
  },
  tonePillTextActive: {
    color: T.primary,
    fontWeight: '700',
  },

  // Suggestions
  suggestionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 14,
    position: 'relative',
  },
  suggestionCardActive: {
    borderColor: T.primary,
    backgroundColor: '#FAFBFF',
  },
  suggestionCheck: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  suggestionText: {
    fontSize: 13,
    color: T.text,
    lineHeight: 20,
    paddingRight: 24,
  },

  // Edit box
  editBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.md,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 14,
    fontSize: 14,
    color: T.text,
    lineHeight: 21,
    minHeight: 120,
  },
  charCount: {
    fontSize: 11,
    color: T.mutedLt,
    marginTop: 6,
    textAlign: 'right',
  },

  // Bottom bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: T.border,
    ...SHADOW.md,
  },
  skipBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  skipBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: T.muted,
  },
  sendBtn: {
    flex: 1,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  sendBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Success screen
  successScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  successIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: T.navy,
  },
  successSub: {
    fontSize: 15,
    color: T.muted,
    textAlign: 'center',
  },

  // Not found
  notFound: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFoundText: {
    fontSize: 17,
    fontWeight: '700',
    color: T.text,
  },
  backLink: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: T.primary,
    fontWeight: '600',
  },
})
