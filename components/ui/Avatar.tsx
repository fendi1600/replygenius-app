import React from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

interface AvatarProps {
  initials: string
  size?: number
  uri?: string
}

export default function Avatar({ initials, size = 44, uri }: AvatarProps) {
  const borderRadius = size / 2
  const fontSize = size * 0.36

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={{ width: size, height: size, borderRadius }}
      />
    )
  }

  return (
    <LinearGradient
      colors={['#a78bfa', '#7c3aed']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius, alignItems: 'center', justifyContent: 'center' }}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {initials.toUpperCase().slice(0, 2)}
      </Text>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  initials: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
})
