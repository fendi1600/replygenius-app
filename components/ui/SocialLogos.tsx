/**
 * Actual brand SVG logos for Facebook, Instagram, YouTube, TikTok
 * Paths sourced from official brand guidelines
 */
import React from 'react'
import Svg, { Path, Rect, Circle, Defs, LinearGradient, Stop, G, ClipPath } from 'react-native-svg'

type LogoProps = { size?: number; mono?: boolean }

export function FacebookLogo({ size = 24, mono }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="6" fill={mono ? '#fff' : '#1877F2'} />
      <Path
        d="M16.5 3H14C11.79 3 10 4.79 10 7v2H7.5v3H10v9h3v-9h2.5l.5-3H13V7c0-.55.45-1 1-1h2.5V3z"
        fill={mono ? '#1877F2' : '#fff'}
      />
    </Svg>
  )
}

export function InstagramLogo({ size = 24, mono }: LogoProps) {
  const id = 'igGrad'
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id={id} x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <Stop offset="0"   stopColor="#FFDC80" />
          <Stop offset="0.2" stopColor="#FCAF45" />
          <Stop offset="0.4" stopColor="#F77737" />
          <Stop offset="0.6" stopColor="#F56040" />
          <Stop offset="0.8" stopColor="#FD1D1D" />
          <Stop offset="1"   stopColor="#833AB4" />
        </LinearGradient>
      </Defs>
      <Rect width="24" height="24" rx="6" fill={mono ? '#E1306C' : `url(#${id})`} />
      {/* Outer square */}
      <Rect x="4" y="4" width="16" height="16" rx="5" stroke="#fff" strokeWidth="1.8" fill="none" />
      {/* Circle */}
      <Circle cx="12" cy="12" r="4" stroke="#fff" strokeWidth="1.8" fill="none" />
      {/* Dot */}
      <Circle cx="17.2" cy="6.8" r="1.1" fill="#fff" />
    </Svg>
  )
}

export function YouTubeLogo({ size = 24, mono }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="6" fill={mono ? '#fff' : '#FF0000'} />
      {/* Play button */}
      <Path
        d="M20.5 7.3C20.3 6.5 19.7 5.9 18.9 5.7C17.5 5.3 12 5.3 12 5.3C12 5.3 6.5 5.3 5.1 5.7C4.3 5.9 3.7 6.5 3.5 7.3C3.1 8.7 3.1 12 3.1 12C3.1 12 3.1 15.3 3.5 16.7C3.7 17.5 4.3 18.1 5.1 18.3C6.5 18.7 12 18.7 12 18.7C12 18.7 17.5 18.7 18.9 18.3C19.7 18.1 20.3 17.5 20.5 16.7C20.9 15.3 20.9 12 20.9 12C20.9 12 20.9 8.7 20.5 7.3Z"
        fill={mono ? '#FF0000' : '#fff'}
      />
      <Path d="M10 15.2V8.8L15.5 12L10 15.2Z" fill={mono ? '#fff' : '#FF0000'} />
    </Svg>
  )
}

export function TikTokLogo({ size = 24, mono }: LogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect width="24" height="24" rx="6" fill={mono ? '#fff' : '#010101'} />
      {/* TikTok "d" music note shape */}
      <Path
        d="M19 7.1C18.1 7 17.3 6.5 16.7 5.8C16.1 5.1 15.8 4.2 15.8 3.3H12.8V15.5C12.8 16.4 12.1 17.1 11.2 17.1C10.3 17.1 9.6 16.4 9.6 15.5C9.6 14.6 10.3 13.9 11.2 13.9C11.4 13.9 11.6 13.9 11.8 14V11C11.6 11 11.4 11 11.2 11C8.8 11 6.8 13 6.8 15.5C6.8 18 8.8 20 11.2 20C13.6 20 15.6 18 15.6 15.5V9.4C16.7 10.2 18 10.6 19.3 10.6V7.6C19.2 7.6 19.1 7.1 19 7.1Z"
        fill={mono ? '#010101' : '#fff'}
      />
    </Svg>
  )
}

export type SocialPlatform = 'facebook' | 'instagram' | 'youtube' | 'tiktok'

export function SocialLogo({ platform, size = 24, mono }: { platform: SocialPlatform; size?: number; mono?: boolean }) {
  switch (platform) {
    case 'facebook':  return <FacebookLogo  size={size} mono={mono} />
    case 'instagram': return <InstagramLogo size={size} mono={mono} />
    case 'youtube':   return <YouTubeLogo   size={size} mono={mono} />
    case 'tiktok':    return <TikTokLogo    size={size} mono={mono} />
  }
}
