import { Redirect } from 'expo-router'
import { useAuthStore } from '../stores/useAuthStore'

export default function Index() {
  const isSignedIn = useAuthStore(s => s.isSignedIn)
  // Route to tabs if signed in, otherwise show auth flow (splash → signin)
  return <Redirect href={isSignedIn ? '/(tabs)/' : '/(auth)/splash'} />
}
