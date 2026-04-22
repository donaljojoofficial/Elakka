import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TouchableOpacity } from 'react-native';
import { useAuthStore } from '../../store/useAuthStore';

import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4ade80',
        tabBarInactiveTintColor: '#e8f5e960',
        tabBarStyle: { 
          backgroundColor: '#132016', 
          borderTopColor: 'transparent',
          height: 70 + insets.bottom / 2,
          paddingBottom: insets.bottom / 2 + 10,
          paddingTop: 10,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: true,
        headerStyle: { backgroundColor: '#132016', borderBottomColor: '#0d1a0f' },
        headerTintColor: '#e8f5e9',
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="house.fill" color={color} />,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => useAuthStore.getState().signOut()}
              style={{ marginRight: 20 }}
            >
              <IconSymbol size={24} name="rectangle.portrait.and.arrow.right" color="#f87171" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="plots"
        options={{
          title: 'Plots',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="leaf.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="treatments"
        options={{
          title: 'Treatments',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="drop.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="shippingbox.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="yields"
        options={{
          title: 'Yields',
          tabBarIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="chart.bar.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
