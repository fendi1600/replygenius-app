import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { RADIUS } from '../../constants/theme'

interface BadgeProps {
  label: string
  color: string
  bg: string
  border?: string
}

export default function Badge({ label, color, bg, border }: BadgeProps) {
  const containerStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderWidth: border ? 1 : 0,
    borderColor: border ?? 'transparent',
    alignSelf: 'flex-start',
  }

  return (
    <View style={containerStyle}>
      <Text style={[styles.label, { color }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
})
