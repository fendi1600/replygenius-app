export const T = {
  // Brand
  primary:   '#6C3AE8',
  primaryDk: '#5228CC',
  primaryLt: '#EDE9FF',

  // Neutrals
  navy:    '#0F172A',
  text:    '#1E293B',
  muted:   '#64748B',
  mutedLt: '#94A3B8',
  border:  '#E2E8F0',
  bg:      '#F8FAFC',
  card:    '#FFFFFF',

  // Status colours
  green:   '#22C55E',
  greenLt: '#DCFCE7',
  greenDk: '#166534',
  red:     '#EF4444',
  redLt:   '#FEF2F2',
  redDk:   '#991B1B',
  amber:   '#F59E0B',
  amberLt: '#FEF3C7',
  blue:    '#2563EB',
  sky:     '#60A5FA',
  orange:  '#FF6B35',

  // Hero gradient
  heroGradient: ['#7B52EC', '#4C27B8'] as const,

  // Platform colours
  platforms: {
    facebook:  { color: '#1877F2', bg: '#EFF6FF', label: 'FB' },
    instagram: { color: '#E1306C', bg: '#FFF0F5', label: 'IG' },
    youtube:   { color: '#FF0000', bg: '#FFF5F5', label: 'YT' },
    tiktok:    { color: '#111827', bg: '#F8FAFC', label: 'TT' },
  },

  // Sentiment badge colours
  sentiment: {
    question: { color: '#15803D', bg: '#DCFCE7', border: '#BBF7D0', label: 'Lead'      },
    negative: { color: '#DC2626', bg: '#FEE2E2', border: '#FECACA', label: 'Complaint' },
    positive: { color: '#1D4ED8', bg: '#DBEAFE', border: '#BFDBFE', label: 'Positive'  },
    neutral:  { color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB', label: 'Neutral'   },
  },
} as const

export const FONTS = {
  regular: 'Inter_400Regular',
  medium:  'Inter_500Medium',
  semibold:'Inter_600SemiBold',
  bold:    'Inter_700Bold',
  black:   'Inter_800ExtraBold',
}

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 999,
}

export const SHADOW = {
  sm:  { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4,  elevation: 2 },
  md:  { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8,  elevation: 4 },
  lg:  { shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  hero:{ shadowColor: '#5A28C8', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.40, shadowRadius: 24, elevation: 16 },
}
