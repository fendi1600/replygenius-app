import { useState } from 'react'
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import Toggle from '../../components/ui/Toggle'
import { mockAutoRules } from '../../data/mock'
import type { AutoRule } from '../../types'

export default function RulesScreen() {
  const { t } = useTranslation()

  const [autoRules, setAutoRules] = useState<AutoRule[]>(mockAutoRules)
  const [smartRules, setSmartRules] = useState<AutoRule[]>([
    { id: 'S-001', name: 'Detect Leads',      desc: 'Identify potential customers',  on: true  },
    { id: 'S-002', name: 'Detect Complaints', desc: 'Flag unhappy customers',        on: true  },
    { id: 'S-003', name: 'Hide Spam',         desc: 'Auto-hide spam comments',       on: true  },
  ])

  const toggle = (
    list: AutoRule[],
    setList: (r: AutoRule[]) => void,
    id: string,
  ) => setList(list.map(r => r.id === id ? { ...r, on: !r.on } : r))

  const RuleList = ({ items, setItems }: { items: AutoRule[]; setItems: (r: AutoRule[]) => void }) => (
    <View style={styles.card}>
      {items.map((rule, i) => (
        <View key={rule.id}>
          <View style={styles.ruleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.ruleName}>{rule.name}</Text>
              <Text style={styles.ruleDesc}>{rule.desc}</Text>
            </View>
            <Toggle value={rule.on} onChange={() => toggle(items, setItems, rule.id)} />
          </View>
          {i < items.length - 1 && <View style={styles.divider} />}
        </View>
      ))}
    </View>
  )

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t('rules.title')}</Text>
        <Text style={styles.subtitle}>{t('rules.subtitle')}</Text>

        <Text style={styles.sectionLabel}>{t('rules.auto_reply_rules')}</Text>
        <RuleList items={autoRules} setItems={setAutoRules} />

        <Text style={styles.sectionLabel}>{t('rules.smart_detection')}</Text>
        <RuleList items={smartRules} setItems={setSmartRules} />

        {/* Phase 2 teaser */}
        <View style={styles.teaser}>
          <Text style={styles.teaserTitle}>{t('rules.phase2_title')}</Text>
          <Text style={styles.teaserBody}>{t('rules.phase2_body')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: '#fff' },
  content:      { padding: 20, paddingBottom: 40, gap: 12 },
  title:        { fontSize: 24, fontWeight: '800', color: T.text },
  subtitle:     { fontSize: 13, color: T.muted, marginTop: 2, marginBottom: 4 },
  sectionLabel: { fontSize: 13, fontWeight: '700', color: T.text, marginTop: 4 },
  card:         { backgroundColor: '#fff', borderRadius: RADIUS.xl, borderWidth: 1, borderColor: T.border, overflow: 'hidden', ...SHADOW.sm },
  ruleRow:      { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  ruleName:     { fontSize: 14, fontWeight: '700', color: T.text },
  ruleDesc:     { fontSize: 12, color: T.muted, marginTop: 2 },
  divider:      { height: 1, backgroundColor: T.border, marginHorizontal: 16 },
  teaser:       { backgroundColor: T.primaryLt, borderWidth: 1, borderColor: `${T.primary}28`, borderRadius: RADIUS.lg, padding: 16, marginTop: 4 },
  teaserTitle:  { fontSize: 13, fontWeight: '700', color: T.primary, marginBottom: 6 },
  teaserBody:   { fontSize: 12, color: T.muted, lineHeight: 18 },
})
