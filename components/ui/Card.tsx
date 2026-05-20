import React, { ReactNode } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { T, SHADOW, RADIUS } from '../../constants/theme'

interface CardProps {
  children: ReactNode
  style?: ViewStyle
  onPress?: () => void
  padding?: number
}

export default function Card({ children, style, onPress, padding = 16 }: CardProps) {
  const cardStyle: ViewStyle = {
    backgroundColor: T.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: T.border,
    padding,
    ...SHADOW.md,
  }

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={[cardStyle, style]}
      >
        {children}
      </TouchableOpacity>
    )
  }

  return <View style={[cardStyle, style]}>{children}</View>
}
