import React, { useState } from 'react';
import { ScrollView, View, Text, RefreshControl, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useDatabase } from '../../database/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { LayoutDashboard, TrendingUp, AlertTriangle, Leaf, AlertCircle, CloudRain, Thermometer } from 'lucide-react-native';

export default function HomeScreen() {
  const router = useRouter();
  const db = useDatabase();
  const [stats, setStats] = useState({
    plotCount: 0,
    monthlyYield: 0,
    lowStockCount: 0,
    activeProblems: 0,
    weather: { temp: null as number | null, rain: null as number | null }
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      // 1. Plot Count
      const plotRes = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM plots');
      
      // 2. Monthly Yield
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const yieldRes = await db.getFirstAsync<{ total: number }>(
        'SELECT SUM(quantity_kg) as total FROM yields WHERE date >= ?',
        [startOfMonth.getTime()]
      );

      // 3. Low Stock (less than 5 units)
      const stockRes = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM inventory WHERE quantity < 5'
      );

      // 4. Active Problems
      const problemRes = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM problems WHERE status = 'active'"
      );

      // 5. Latest Weather
      const weatherRes = await db.getFirstAsync<{ temperature: number, rainfall_mm: number }>(
        'SELECT temperature, rainfall_mm FROM weather_log ORDER BY date DESC LIMIT 1'
      );

      setStats({
        plotCount: plotRes?.count || 0,
        monthlyYield: yieldRes?.total || 0,
        lowStockCount: stockRes?.count || 0,
        activeProblems: problemRes?.count || 0,
        weather: { 
          temp: weatherRes?.temperature ?? null, 
          rain: weatherRes?.rainfall_mm ?? null 
        }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStats();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  return (
    <ScrollView 
      className="flex-1 bg-background p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ade80" />
      }
    >
      <View className="mb-6">
        <Text className="text-text text-3xl font-bold">Field Overview</Text>
        <Text className="text-text/60">Welcome back to your cardamom farm</Text>
      </View>

      <View className="flex-row flex-wrap gap-4 mb-6">
        <Card className="flex-1 min-w-[150px]">
          <Leaf size={24} color="#4ade80" />
          <Text className="text-text text-2xl font-bold mt-2">{stats.plotCount}</Text>
          <Text className="text-text/60 text-xs">Total Plots</Text>
        </Card>

        <Card className="flex-1 min-w-[150px]">
          <TrendingUp size={24} color="#4ade80" />
          <Text className="text-text text-2xl font-bold mt-2">{stats.monthlyYield} Kg</Text>
          <Text className="text-text/60 text-xs">Yield (This Month)</Text>
        </Card>
      </View>

      <Card className="mb-6">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-text text-xl font-bold">Today's Conditions</Text>
            <Text className="text-text/60 text-xs">Based on your latest log</Text>
          </View>
          <View className="flex-row gap-4">
            <View className="items-center">
              <Thermometer size={20} color="#4ade80" />
              <Text className="text-text font-bold mt-1">{stats.weather.temp ?? '--'}°C</Text>
            </View>
            <View className="items-center">
              <CloudRain size={20} color="#4ade80" />
              <Text className="text-text font-bold mt-1">{stats.weather.rain ?? '--'} mm</Text>
            </View>
          </View>
        </View>
      </Card>

      <View className="flex-row gap-4 mb-6">
        <Card className={`flex-1 ${stats.activeProblems > 0 ? 'bg-red-900/20 border-red-500/30' : ''}`}>
          <View className="flex-row items-center gap-3">
            <AlertTriangle size={24} color={stats.activeProblems > 0 ? "#f87171" : "#4ade80"} />
            <View>
              <Text className="text-text font-bold">
                {stats.activeProblems === 0 
                  ? 'No Active Issues' 
                  : `${stats.activeProblems} Open Issues`}
              </Text>
              <Text className="text-text/60 text-xs">Farm health monitoring</Text>
            </View>
          </View>
        </Card>

        <Card className={`flex-1 ${stats.lowStockCount > 0 ? 'bg-orange-900/20 border-orange-500/30' : ''}`}>
          <View className="flex-row items-center gap-3">
            <AlertCircle size={24} color={stats.lowStockCount > 0 ? "#fb923c" : "#4ade80"} />
            <View>
              <Text className="text-text font-bold">
                {stats.lowStockCount === 0 
                  ? 'Stock Healthy' 
                  : `${stats.lowStockCount} Low Items`}
              </Text>
              <Text className="text-text/60 text-xs">Inventory check</Text>
            </View>
          </View>
        </Card>
      </View>

      <View className="mb-4">
        <Text className="text-text text-xl font-bold mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap gap-4">
          <TouchableOpacity 
            onPress={() => router.push('/add-plot')}
            className="bg-surface p-4 rounded-2xl border border-text/10 items-center justify-center flex-1 min-w-[100px]"
          >
            <Leaf size={24} color="#4ade80" />
            <Text className="text-text text-xs mt-1 font-bold">New Plot</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/add-treatment')}
            className="bg-surface p-4 rounded-2xl border border-text/10 items-center justify-center flex-1 min-w-[100px]"
          >
            <TrendingUp size={24} color="#4ade80" />
            <Text className="text-text text-xs mt-1 font-bold">Log Spray</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/add-yield')}
            className="bg-surface p-4 rounded-2xl border border-text/10 items-center justify-center flex-1 min-w-[100px]"
          >
            <LayoutDashboard size={24} color="#4ade80" />
            <Text className="text-text text-xs mt-1 font-bold">Yield</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/add-problem')}
            className="bg-surface p-4 rounded-2xl border border-text/10 items-center justify-center flex-1 min-w-[100px]"
          >
            <AlertCircle size={24} color="#f87171" />
            <Text className="text-text text-xs mt-1 font-bold text-red-400">Report</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/add-weather')}
            className="bg-surface p-4 rounded-2xl border border-text/10 items-center justify-center flex-1 min-w-[100px]"
          >
            <CloudRain size={24} color="#4ade80" />
            <Text className="text-text text-xs mt-1 font-bold">Weather</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-32" />
    </ScrollView>
  );
}
