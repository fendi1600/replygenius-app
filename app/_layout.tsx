import { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import '../i18n'   // initialise i18next before any screen renders

// Keep the native splash visible until we're ready
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  useEffect(() => {
    // Hide native splash — our custom animated splash screen takes over
    SplashScreen.hideAsync()
  }, [])

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)"  options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)"  options={{ headerShown: false }} />
        <Stack.Screen
          name="reply/[id]"
          options={{
            headerShown: false,
            presentation: 'card',
            animation: 'slide_from_bottom',
          }}
        />
      </Stack>
    </>
  )
}
