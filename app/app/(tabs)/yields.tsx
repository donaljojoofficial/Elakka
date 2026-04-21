import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDatabase } from '../../database/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Plus, TrendingUp, MapPin, Scale } from 'lucide-react-native';

interface YieldRecord {
  id: string;
  plot_id: string;
  plot_name: string;
  date: number;
  quantity_kg: number;
  quality_grade: string;
  notes: string;
}

export default function YieldsScreen() {
  const router = useRouter();
  const db = useDatabase();
  const [records, setRecords] = useState<YieldRecord[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecords = async () => {
    try {
      const result = await db.getAllAsync<YieldRecord>(
        `SELECT y.*, p.name as plot_name 
         FROM yields y 
         LEFT JOIN plots p ON y.plot_id = p.id 
         ORDER BY y.date DESC`
      );
      setRecords(result);
    } catch (error) {
      console.error('Error fetching yields:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchRecords();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecords();
    setRefreshing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <ScrollView 
      className="flex-1 bg-background p-4"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ade80" />
      }
    >
      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-text text-2xl font-bold">Yield Tracking</Text>
          <Text className="text-text/60 text-sm">Monitor your harvest performance</Text>
        </View>
        <TouchableOpacity 
          className="bg-accent p-3 rounded-full"
          onPress={() => router.push('/add-yield')}
        >
          <Plus size={24} color="#0d1a0f" />
        </TouchableOpacity>
      </View>

      {records.length === 0 ? (
        <Card className="items-center py-12">
          <TrendingUp size={48} color="#4ade80" opacity={0.5} />
          <Text className="text-text/60 mt-4 text-center">No harvest records yet.{"\n"}Tap + to log your first yield.</Text>
        </Card>
      ) : (
        records.map((r) => (
          <TouchableOpacity key={r.id} className="mb-4">
            <Card>
              <CardHeader className="flex-row justify-between items-start">
                <View>
                  <CardTitle>{r.quantity_kg} Kg</CardTitle>
                  <View className="flex-row items-center gap-1 mt-1">
                    <MapPin size={12} color="#4ade80" opacity={0.6} />
                    <CardDescription>{r.plot_name || 'General'}</CardDescription>
                  </View>
                </View>
                <View className="items-end">
                  <View className="bg-accent/10 px-3 py-1 rounded-full border border-accent/20 mb-1">
                    <Text className="text-accent text-xs font-bold">{r.quality_grade}</Text>
                  </View>
                  <Text className="text-text/60 text-[10px]">{formatDate(r.date)}</Text>
                </View>
              </CardHeader>
              {r.notes ? (
                <CardContent className="mt-2">
                  <Text className="text-text/80 text-sm italic">"{r.notes}"</Text>
                </CardContent>
              ) : null}
            </Card>
          </TouchableOpacity>
        ))
      )}
      
      <View className="h-32" />
    </ScrollView>
  );
}
