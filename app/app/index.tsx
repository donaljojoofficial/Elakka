import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';


export default function Index() {
  const { session, isLoading } = useAuthStore();
  console.log('Index rendering, isLoading:', isLoading, 'session:', !!session);

  if (isLoading) return null;

  if (!session) {
    console.log('Index: No session, redirecting to landing');
    return <Redirect href="/(auth)/landing" />;
  }

  console.log('Index: Session found, redirecting to tabs');
  return <Redirect href="/(tabs)" />;
}
