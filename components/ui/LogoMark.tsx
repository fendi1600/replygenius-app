import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { T, RADIUS } from '../../constants/theme'

type LogoSize = 'sm' | 'md' | 'lg'

interface LogoMarkProps {
  size?: LogoSize
  showWordmark?: boolean
}

const SIZE_MAP: Record<LogoSize, { icon: number; wordmark: number; gap: number }> = {
  sm: { icon: 28, wordmark: 16, gap: 6 },
  md: { icon: 40, wordmark: 20, gap: 8 },
  lg: { icon: 56, wordmark: 26, gap: 10 },
}

export default function LogoMark({ size = 'md', showWordmark = true }: LogoMarkProps) {
  const { icon, wordmark, gap } = SIZE_MAP[size]
  const iconRadius = Math.round(icon * 0.26)
  const emojiSize  = Math.round(icon * 0.52)

  return (
    <View style={styles.row}>
      {/* Icon square */}
      <LinearGradient
        colors={['#7B52EC', '#4C27B8']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: icon,
          height: icon,
          borderRadius: iconRadius,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ fontSize: emojiSize, lineHeight: emojiSize * 1.2 }}>⚡</Text>
      </LinearGradient>

      {/* Wordmark */}
      {showWordmark && (
        <View style={[styles.wordmarkRow, { marginLeft: gap }]}>
          <Text style={[styles.wordmarkText, { fontSize: wordmark, color: T.text }]}>
            Reply
          </Text>
          <Text style={[styles.wordmarkText, { fontSize: wordmark, color: T.primary }]}>
            Genius
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordmarkRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  wordmarkText: {
    fontWeight: '800',
    letterSpacing: -0.4,
  },
})
