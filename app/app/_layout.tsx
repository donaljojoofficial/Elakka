import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '../database/db';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../utils/supabase';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, checkSession, setSession, isLoading } = useAuthStore();
  const router = useRouter();


  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle redirection based on auth state
  useEffect(() => {
    if (isLoading) return;

    if (session) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/landing');
    }
  }, [session, isLoading]);

  if (isLoading) {
    return null; 
  }


  return (
    <SQLiteProvider databaseName="elakka.db" onInit={initDatabase}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)/landing" />
            <Stack.Screen name="(auth)/login" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(auth)/signup" options={{ presentation: 'modal' }} />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="add-plot" options={{ presentation: 'modal', title: 'Add New Plot' }} />
            <Stack.Screen name="add-inventory" options={{ presentation: 'modal', title: 'Add Inventory Item' }} />
            <Stack.Screen name="add-treatment" options={{ presentation: 'modal', title: 'Log Treatment' }} />
            <Stack.Screen name="add-yield" options={{ presentation: 'modal', title: 'Record Yield' }} />
            <Stack.Screen name="add-problem" options={{ presentation: 'modal', title: 'Report Issue' }} />
            <Stack.Screen name="add-weather" options={{ presentation: 'modal', title: 'Log Weather' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}




