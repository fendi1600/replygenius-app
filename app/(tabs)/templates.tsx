import React from 'react'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import { T, SHADOW, RADIUS } from '../../constants/theme'
import { mockTemplates } from '../../data/mock'
import type { Template } from '../../types'

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Sales:    { bg: '#EDE9FF', color: T.primary   },
  General:  { bg: '#DCFCE7', color: '#15803D'   },
  Support:  { bg: '#FEF3C7', color: '#B45309'   },
  Delivery: { bg: '#DBEAFE', color: '#1D4ED8'   },
}

function TemplateCard({ template }: { template: Template }) {
  const cat = CATEGORY_COLORS[template.category] ?? { bg: T.bg, color: T.muted }
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.82}>
      <View style={styles.cardTop}>
        <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
          <Text style={[styles.catText, { color: cat.color }]}>{template.category}</Text>
        </View>
        <Text style={styles.langBadge}>{template.language.toUpperCase()}</Text>
      </View>
      <Text style={styles.cardTitle}>{template.title}</Text>
      <Text style={styles.cardBody} numberOfLines={2}>{template.body}</Text>
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.useBtn}>
          <Feather name="send" size={12} color={T.primary} />
          <Text style={styles.useBtnText}>Use Template</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn}>
          <Feather name="edit-2" size={14} color={T.mutedLt} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

export default function TemplatesScreen() {
  const { t } = useTranslation()

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Templates</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Feather name="plus" size={18} color={T.primary} />
          <Text style={styles.addBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockTemplates}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TemplateCard template={item} />}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: T.bg,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: T.primaryLt,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#C4B5FD',
  },
  addBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: T.primary,
  },
  list: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    ...SHADOW.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  catBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  catText: {
    fontSize: 11,
    fontWeight: '700',
  },
  langBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: T.mutedLt,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: T.navy,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 13,
    color: T.muted,
    lineHeight: 19,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  useBtn: {
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
  useBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: T.primary,
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
