import React, { ReactNode } from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView, Edge } from 'react-native-safe-area-context'
import { T } from '../../constants/theme'

interface SafeScreenProps {
  children: ReactNode
  style?: ViewStyle
  edges?: Edge[]
}

export default function SafeScreen({
  children,
  style,
  edges = ['top'],
}: SafeScreenProps) {
  return (
    <SafeAreaView style={[styles.base, style]} edges={edges}>
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
})
