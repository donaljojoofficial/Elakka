import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDatabase } from '../../database/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Plus, Droplets, Calendar, MapPin } from 'lucide-react-native';

interface Treatment {
  id: string;
  plot_id: string;
  plot_name: string;
  type: string;
  date: number;
  notes: string;
}

export default function TreatmentsScreen() {
  const router = useRouter();
  const db = useDatabase();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTreatments = async () => {
    try {
      const result = await db.getAllAsync<Treatment>(
        `SELECT t.*, p.name as plot_name 
         FROM treatments t 
         JOIN plots p ON t.plot_id = p.id 
         ORDER BY t.date DESC`
      );
      setTreatments(result);
    } catch (error) {
      console.error('Error fetching treatments:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTreatments();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTreatments();
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
          <Text className="text-text text-2xl font-bold">Treatments</Text>
          <Text className="text-text/60 text-sm">Log of fertilizers and pesticides</Text>
        </View>
        <TouchableOpacity 
          className="bg-accent p-3 rounded-full"
          onPress={() => router.push('/add-treatment')}
        >
          <Plus size={24} color="#0d1a0f" />
        </TouchableOpacity>
      </View>

      {treatments.length === 0 ? (
        <Card className="items-center py-12">
          <Droplets size={48} color="#4ade80" opacity={0.5} />
          <Text className="text-text/60 mt-4 text-center">No treatments logged.{"\n"}Tap + to record an application.</Text>
        </Card>
      ) : (
        treatments.map((t) => (
          <TouchableOpacity key={t.id} className="mb-4">
            <Card>
              <CardHeader className="flex-row justify-between items-start">
                <View>
                  <CardTitle>{t.type}</CardTitle>
                  <View className="flex-row items-center gap-1 mt-1">
                    <MapPin size={12} color="#4ade80" opacity={0.6} />
                    <CardDescription>{t.plot_name}</CardDescription>
                  </View>
                </View>
                <View className="bg-surface border border-text/10 px-3 py-1 rounded-full">
                  <Text className="text-text/60 text-xs">{formatDate(t.date)}</Text>
                </View>
              </CardHeader>
              <CardContent className="mt-2">
                <Text className="text-text/80 text-sm italic">"{t.notes}"</Text>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))
      )}
      
      <View className="h-32" />
    </ScrollView>
  );
}
