import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import LogoMark from '../../components/ui/LogoMark'

export default function SplashScreen() {
  const { t } = useTranslation()

  const scale = useRef(new Animated.Value(0.5)).current
  const opacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start()

    const timer = setTimeout(() => {
      router.replace('/(auth)/signin')
    }, 2000)

    return () => clearTimeout(timer)
  }, [opacity, scale])

  return (
    <LinearGradient
      colors={['#7B52EC', '#4C27B8']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <StatusBar style="light" />

      <Animated.View style={[styles.logoWrap, { transform: [{ scale }], opacity }]}>
        <LogoMark size="lg" showWordmark={false} />
      </Animated.View>

      <Animated.View style={[styles.textWrap, { opacity }]}>
        <Text style={styles.appName}>ReplyGenius</Text>
        <Text style={styles.tagline}>{t('splash.tagline')}</Text>
      </Animated.View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    marginBottom: 24,
  },
  textWrap: {
    alignItems: 'center',
  },
  appName: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  tagline: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 0.1,
  },
})
