import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
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
import LockScreen from './lock';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLocked, checkPinSet } = useAuthStore();

  useEffect(() => {
    checkPinSet();
  }, []);

  if (isLocked) {
    return (
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <LockScreen />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <SQLiteProvider databaseName="elakka.db" onInit={initDatabase}>
      <SafeAreaProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
