import React, { useEffect, useRef } from 'react'
import { Animated, Pressable, StyleSheet } from 'react-native'

interface ToggleProps {
  value: boolean
  onChange: (next: boolean) => void
}

const TRACK_W = 44
const TRACK_H = 24
const THUMB   = 18
const TRAVEL  = TRACK_W - THUMB - 6 // 20

export default function Toggle({ value, onChange }: ToggleProps) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start()
  }, [value])

  const translateX = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: [3, 3 + TRAVEL],
  })

  const bgColor = anim.interpolate({
    inputRange:  [0, 1],
    outputRange: ['#CBD5E1', '#6C3AE8'],
  })

  return (
    <Pressable onPress={() => onChange(!value)} hitSlop={8}>
      <Animated.View style={[styles.track, { backgroundColor: bgColor }]}>
        <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  track: {
    width: TRACK_W,
    height: TRACK_H,
    borderRadius: TRACK_H / 2,
    justifyContent: 'center',
  },
  thumb: {
    width: THUMB,
    height: THUMB,
    borderRadius: THUMB / 2,
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 3,
    elevation: 3,
  },
})
