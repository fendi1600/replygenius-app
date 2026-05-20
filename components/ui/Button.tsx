import React, { ReactNode } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { T, RADIUS } from '../../constants/theme'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: Variant
  size?: Size
  icon?: ReactNode
  loading?: boolean
  disabled?: boolean
  style?: ViewStyle
}

const SIZE_STYLES: Record<Size, { py: number; px: number; fontSize: number }> = {
  sm: { py: 8,  px: 16, fontSize: 13 },
  md: { py: 12, px: 20, fontSize: 15 },
  lg: { py: 16, px: 24, fontSize: 17 },
}

const VARIANT_STYLES: Record<
  Variant,
  { bg?: string; textColor: string; borderColor?: string }
> = {
  primary:     { textColor: '#FFFFFF' },
  secondary:   { bg: T.primaryLt,  textColor: T.primary,  borderColor: '#C4B5FD' },
  ghost:       { bg: 'transparent', textColor: T.primary },
  destructive: { bg: T.redLt,      textColor: T.red,      borderColor: '#FECACA' },
  success:     { bg: T.greenLt,    textColor: T.greenDk,  borderColor: '#86EFAC' },
}

export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) {
  const sz = SIZE_STYLES[size]
  const vr = VARIANT_STYLES[variant]
  const isDisabled = disabled || loading

  const innerContent = (
    <View style={styles.inner}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? '#FFFFFF' : vr.textColor}
          style={styles.spinner}
        />
      ) : (
        <>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text
            style={[
              styles.label,
              { fontSize: sz.fontSize, color: vr.textColor },
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </View>
  )

  const containerStyle: ViewStyle = {
    paddingVertical: sz.py,
    paddingHorizontal: sz.px,
    borderRadius: RADIUS.full,
    opacity: isDisabled ? 0.5 : 1,
    borderWidth: vr.borderColor ? 1.5 : 0,
    borderColor: vr.borderColor ?? 'transparent',
    backgroundColor: variant !== 'primary' ? (vr.bg ?? 'transparent') : undefined,
    overflow: 'hidden',
  }

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.82}
        style={[{ borderRadius: RADIUS.full, overflow: 'hidden', opacity: isDisabled ? 0.5 : 1 }, style]}
      >
        <LinearGradient
          colors={['#6C3AE8', '#5228CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ paddingVertical: sz.py, paddingHorizontal: sz.px }}
        >
          {innerContent}
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
      style={[containerStyle, style]}
    >
      {innerContent}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: 6,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  spinner: {
    marginHorizontal: 4,
  },
})
