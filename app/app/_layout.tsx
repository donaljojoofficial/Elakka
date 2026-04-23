import { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';

import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from '../database/db';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '../store/useAuthStore';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../utils/supabase';
import * as Linking from 'expo-linking';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session, checkSession, setSession, isLoading } = useAuthStore();
  const router = useRouter();
  const initialized = useRef(false);
  const url = Linking.useURL();

  useEffect(() => {
    if (!initialized.current) {
      checkSession();
      initialized.current = true;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('AUTH: onAuthStateChange event:', event, 'session exists:', !!session);
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle deep links (Email confirmation, OAuth)
  useEffect(() => {
    if (url) {
      const { queryParams } = Linking.parse(url);
      
      // If it's a supabase auth link, it usually has access_token in the fragment or query
      // supabase-js handles these automatically if detectSessionInUrl is true, 
      // but on Native we sometimes need to help it.
      
      // Actually, for most native flows, just receiving the link is enough for 
      // onAuthStateChange to fire if the Supabase client is correctly configured.
      
      console.log('Deep link received:', url);
    }
  }, [url]);

  // Handle redirection based on auth state
  useEffect(() => {
    if (isLoading) return;

    if (session) {
      router.replace('/(tabs)');
    }
  }, [session, isLoading]);

  return (
    <SQLiteProvider databaseName="elakka.db" onInit={initDatabase}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1 }}>
            {isLoading ? (
              <View style={{ flex: 1, backgroundColor: '#0d1a0f', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#4ade80' }}>Initializing Elakka...</Text>
              </View>
            ) : (
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
            )}
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </SQLiteProvider>
  );
}
