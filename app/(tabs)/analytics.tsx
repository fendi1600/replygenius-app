import React, { useState } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { mockAccounts } from '../../data/mock'

const { width } = Dimensions.get('window')

const CHART_DAYS = ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon']
const CHART_DATA = [45, 68, 55, 82, 91, 78, 85]
const CHART_MAX  = Math.max(...CHART_DATA)
const CHART_H    = 100

const OVERVIEW_CARDS = [
  { label: 'Total Comments', value: '1,842',     sub: '',          subColor: T.muted  },
  { label: 'Replied',        value: '1,512',      sub: '82%',       subColor: '#15803D'},
  { label: 'Leads',          value: '89',          sub: '↑ 12.7%',  subColor: '#15803D'},
  { label: 'Complaints',     value: '23',          sub: '↓ 4.2%',   subColor: '#DC2626'},
]

const PLATFORM_REPLY_RATES: Record<string, number> = {
  instagram: 88,
  facebook:  85,
  youtube:   74,
  tiktok:    62,
}

export default function AnalyticsScreen() {
  const { t } = useTranslation()
  const [weekLabel, setWeekLabel] = useState('This Week')

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <TouchableOpacity style={styles.weekBtn}>
            <Feather name="calendar" size={14} color={T.primary} />
            <Text style={styles.weekBtnText}>{weekLabel}</Text>
            <Feather name="chevron-down" size={14} color={T.primary} />
          </TouchableOpacity>
        </View>

        {/* Overview 2x2 grid */}
        <View style={styles.overviewGrid}>
          {OVERVIEW_CARDS.map((card) => (
            <View key={card.label} style={styles.overviewCard}>
              <Text style={styles.overviewValue}>{card.value}</Text>
              <Text style={styles.overviewLabel}>{card.label}</Text>
              {card.sub ? (
                <Text style={[styles.overviewSub, { color: card.subColor }]}>
                  {card.sub}
                </Text>
              ) : null}
            </View>
          ))}
        </View>

        {/* Reply Rate card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Reply Rate</Text>
            <Text style={styles.bigRate}>82%</Text>
          </View>

          {/* Bar chart */}
          <View style={styles.chartWrap}>
            {CHART_DATA.map((val, idx) => {
              const barH = Math.max(8, (val / CHART_MAX) * CHART_H)
              const isLast = idx === CHART_DATA.length - 1
              return (
                <View key={idx} style={styles.barCol}>
                  <View style={[styles.barBg, { height: CHART_H }]}>
                    {isLast ? (
                      <LinearGradient
                        colors={[T.primary, T.primaryDk]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={[styles.bar, { height: barH }]}
                      />
                    ) : (
                      <View
                        style={[
                          styles.bar,
                          { height: barH, backgroundColor: T.primaryLt },
                        ]}
                      />
                    )}
                  </View>
                  <Text style={[styles.barLabel, isLast && styles.barLabelActive]}>
                    {CHART_DAYS[idx]}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>

        {/* Avg Response Time */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Avg Response Time</Text>
            <Text style={styles.responseTime}>2.4 hrs</Text>
          </View>
          <View style={styles.progressTrack}>
            <LinearGradient
              colors={[T.primary, T.primaryDk]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: '62%' }]}
            />
          </View>
          <Text style={styles.progressHint}>62% faster than industry average</Text>
        </View>

        {/* Platform Breakdown */}
        <View style={[styles.card, { marginBottom: 32 }]}>
          <Text style={styles.cardTitle}>Platform Breakdown</Text>
          <View style={{ marginTop: 12, gap: 14 }}>
            {mockAccounts.map(acc => {
              const rate = PLATFORM_REPLY_RATES[acc.platform] ?? 70
              const { color } = T.platforms[acc.platform]
              return (
                <View key={acc.id} style={styles.platformRow}>
                  <View style={[styles.platformDot, { backgroundColor: color }]} />
                  <View style={styles.platformInfo}>
                    <View style={styles.platformTop}>
                      <Text style={styles.platformName}>{acc.name}</Text>
                      <Text style={styles.platformRate}>{rate}%</Text>
                    </View>
                    <View style={styles.platformTrack}>
                      <View
                        style={[
                          styles.platformFill,
                          { width: `${rate}%` as any, backgroundColor: color },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              )
            })}
          </View>
        </View>
      </ScrollView>
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
  weekBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.primaryLt,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  weekBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.primary,
  },

  // 2x2 grid
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  overviewCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    ...SHADOW.sm,
  },
  overviewValue: {
    fontSize: 24,
    fontWeight: '800',
    color: T.navy,
    marginBottom: 4,
  },
  overviewLabel: {
    fontSize: 12,
    color: T.muted,
    fontWeight: '500',
  },
  overviewSub: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },

  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    ...SHADOW.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.navy,
  },
  bigRate: {
    fontSize: 28,
    fontWeight: '800',
    color: T.primary,
  },

  // Bar chart
  chartWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barBg: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: RADIUS.sm,
  },
  barLabel: {
    fontSize: 10,
    color: T.mutedLt,
    fontWeight: '600',
  },
  barLabelActive: {
    color: T.primary,
    fontWeight: '800',
  },

  // Response time
  responseTime: {
    fontSize: 22,
    fontWeight: '800',
    color: T.primary,
  },
  progressTrack: {
    height: 8,
    backgroundColor: T.primaryLt,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
  },
  progressHint: {
    fontSize: 12,
    color: T.muted,
    marginTop: 8,
  },

  // Platform breakdown
  platformRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  platformDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  platformInfo: {
    flex: 1,
  },
  platformTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  platformName: {
    fontSize: 13,
    fontWeight: '600',
    color: T.text,
  },
  platformRate: {
    fontSize: 13,
    fontWeight: '700',
    color: T.navy,
  },
  platformTrack: {
    height: 6,
    backgroundColor: T.bg,
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: T.border,
  },
  platformFill: {
    height: '100%',
    borderRadius: RADIUS.full,
    opacity: 0.8,
  },
})
