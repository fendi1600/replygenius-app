import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { T } from '../../constants/theme'

type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok'

interface PlatformBadgeProps {
  platform: Platform
  size?: number
}

export default function PlatformBadge({ platform, size = 20 }: PlatformBadgeProps) {
  const { color, label } = T.platforms[platform]
  const fontSize = Math.max(6, Math.round(size * 0.4))

  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    >
      <Text style={[styles.label, { fontSize }]}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '800',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
})
