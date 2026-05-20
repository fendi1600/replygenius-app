import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { useAuthStore } from '../../stores/useAuthStore'
import { mockAccounts } from '../../data/mock'
import type { ConnectedAccount } from '../../types'

const { width } = Dimensions.get('window')

const CREATOR_FEATURES = [
  '3 connected accounts',
  '500 AI replies / month',
  'Basic analytics',
  'Email support',
]

const BUSINESS_FEATURES = [
  '10 connected accounts',
  'Unlimited AI replies',
  'Advanced analytics',
  'Priority support',
  'Custom AI tone training',
  'Team collaboration',
]

const STATUS_CONFIG: Record<ConnectedAccount['status'], { bg: string; color: string; label: string }> = {
  connected:    { bg: '#DCFCE7', color: '#15803D', label: 'Connected'    },
  limited:      { bg: '#FEF3C7', color: '#B45309', label: 'Limited'      },
  disconnected: { bg: '#F3F4F6', color: '#6B7280', label: 'Disconnected' },
}

function PlatformIconCircle({ platform }: { platform: ConnectedAccount['platform'] }) {
  const { color, label } = T.platforms[platform]
  return (
    <View style={[styles.platformCircle, { backgroundColor: color }]}>
      <Text style={styles.platformCircleText}>{label}</Text>
    </View>
  )
}

function AccountRow({ account }: { account: ConnectedAccount }) {
  const status = STATUS_CONFIG[account.status]
  return (
    <View style={styles.accountRow}>
      <PlatformIconCircle platform={account.platform} />
      <View style={styles.accountInfo}>
        <Text style={styles.accountName}>{account.name}</Text>
        <Text style={styles.accountHandle}>{account.handle}</Text>
      </View>
      <View style={styles.accountRight}>
        <View style={[styles.statusPill, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
        {account.commentsToday > 0 && (
          <Text style={styles.commentsToday}>{account.commentsToday} today</Text>
        )}
      </View>
    </View>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureRow}>
      <Feather name="check-circle" size={14} color={T.primary} />
      <Text style={styles.featureText}>{text}</Text>
    </View>
  )
}

export default function AccountsScreen() {
  const { t } = useTranslation()
  const user = useAuthStore(s => s.user)
  const [upgradeVisible, setUpgradeVisible] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Accounts</Text>
          <TouchableOpacity style={styles.addBtn}>
            <Feather name="plus" size={18} color={T.primary} />
          </TouchableOpacity>
        </View>

        {/* Connected accounts list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Accounts</Text>
          <View style={styles.card}>
            {mockAccounts.map((acc, idx) => (
              <React.Fragment key={acc.id}>
                <AccountRow account={acc} />
                {idx < mockAccounts.length - 1 && <View style={styles.rowDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Plan card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Plan</Text>
          <LinearGradient
            colors={['#F3EEFF', '#EDE9FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.planCard}
          >
            <View style={styles.planTop}>
              <View>
                <Text style={styles.planLabel}>Current Plan</Text>
                <Text style={styles.planName}>
                  {user?.plan
                    ? user.plan.charAt(0).toUpperCase() + user.plan.slice(1)
                    : 'Creator'}
                </Text>
              </View>
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>Active</Text>
              </View>
            </View>
            <View style={styles.planDivider} />
            <View style={styles.planStats}>
              <View style={styles.planStat}>
                <Text style={styles.planStatNum}>3</Text>
                <Text style={styles.planStatLbl}>Accounts</Text>
              </View>
              <View style={styles.planStatSep} />
              <View style={styles.planStat}>
                <Text style={styles.planStatNum}>500</Text>
                <Text style={styles.planStatLbl}>AI Replies/mo</Text>
              </View>
              <View style={styles.planStatSep} />
              <View style={styles.planStat}>
                <Text style={styles.planStatNum}>Basic</Text>
                <Text style={styles.planStatLbl}>Analytics</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.upgradeBtn}
              onPress={() => setUpgradeVisible(true)}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={[T.primary, T.primaryDk]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeBtnGradient}
              >
                <Feather name="zap" size={15} color="#FFFFFF" />
                <Text style={styles.upgradeBtnText}>Upgrade to Business</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Upgrade modal */}
      <Modal
        visible={upgradeVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setUpgradeVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            <Text style={styles.modalTitle}>Choose Your Plan</Text>
            <Text style={styles.modalSubtitle}>Unlock more features for your business</Text>

            <View style={styles.planCards}>
              {/* Creator */}
              <View style={styles.planCardBox}>
                <Text style={styles.planCardName}>Creator</Text>
                <Text style={styles.planCardPrice}>RM 49<Text style={styles.planCardPer}>/mo</Text></Text>
                <View style={styles.planCardFeatures}>
                  {CREATOR_FEATURES.map(f => <FeatureItem key={f} text={f} />)}
                </View>
                <TouchableOpacity style={styles.planCardBtn}>
                  <Text style={styles.planCardBtnText}>Current Plan</Text>
                </TouchableOpacity>
              </View>

              {/* Business */}
              <LinearGradient
                colors={[T.primary, T.primaryDk]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.planCardBox, styles.planCardBoxActive]}
              >
                <View style={styles.popularBadge}>
                  <Text style={styles.popularBadgeText}>POPULAR</Text>
                </View>
                <Text style={[styles.planCardName, { color: '#FFFFFF' }]}>Business</Text>
                <Text style={[styles.planCardPrice, { color: '#FFFFFF' }]}>
                  RM 129<Text style={[styles.planCardPer, { color: 'rgba(255,255,255,0.7)' }]}>/mo</Text>
                </Text>
                <View style={styles.planCardFeatures}>
                  {BUSINESS_FEATURES.map(f => (
                    <View key={f} style={styles.featureRow}>
                      <Feather name="check-circle" size={14} color="rgba(255,255,255,0.9)" />
                      <Text style={[styles.featureText, { color: 'rgba(255,255,255,0.9)' }]}>{f}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.planCardBtnWhite} activeOpacity={0.85}>
                  <Text style={[styles.planCardBtnText, { color: T.primary }]}>Upgrade Now</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setUpgradeVisible(false)}
            >
              <Text style={styles.modalCloseText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: T.navy,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.full,
    backgroundColor: T.primaryLt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.navy,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: T.border,
    overflow: 'hidden',
    ...SHADOW.sm,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  platformCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformCircleText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '700',
    color: T.navy,
    marginBottom: 2,
  },
  accountHandle: {
    fontSize: 12,
    color: T.muted,
  },
  accountRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  commentsToday: {
    fontSize: 11,
    color: T.mutedLt,
  },
  rowDivider: {
    height: 1,
    backgroundColor: T.border,
    marginHorizontal: 16,
  },

  // Plan card
  planCard: {
    borderRadius: RADIUS.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: '#C4B5FD',
    ...SHADOW.sm,
  },
  planTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planLabel: {
    fontSize: 12,
    color: T.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  planName: {
    fontSize: 20,
    fontWeight: '800',
    color: T.navy,
  },
  planBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#15803D',
  },
  planDivider: {
    height: 1,
    backgroundColor: 'rgba(108,58,232,0.15)',
    marginBottom: 16,
  },
  planStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  planStat: {
    flex: 1,
    alignItems: 'center',
  },
  planStatSep: {
    width: 1,
    backgroundColor: 'rgba(108,58,232,0.15)',
  },
  planStatNum: {
    fontSize: 18,
    fontWeight: '800',
    color: T.primary,
    marginBottom: 2,
  },
  planStatLbl: {
    fontSize: 11,
    color: T.muted,
    fontWeight: '500',
  },
  upgradeBtn: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  upgradeBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  upgradeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: RADIUS['2xl'],
    borderTopRightRadius: RADIUS['2xl'],
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: T.navy,
    textAlign: 'center',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: T.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  planCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  planCardBox: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: '#FFFFFF',
  },
  planCardBoxActive: {
    borderWidth: 0,
  },
  popularBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  planCardName: {
    fontSize: 16,
    fontWeight: '800',
    color: T.navy,
    marginBottom: 4,
  },
  planCardPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: T.navy,
    marginBottom: 12,
  },
  planCardPer: {
    fontSize: 14,
    fontWeight: '400',
    color: T.muted,
  },
  planCardFeatures: {
    gap: 8,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: T.text,
    flex: 1,
  },
  planCardBtn: {
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  planCardBtnWhite: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.full,
    paddingVertical: 10,
    alignItems: 'center',
  },
  planCardBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.text,
  },
  modalClose: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 14,
    color: T.muted,
    fontWeight: '600',
  },
})
