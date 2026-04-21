import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useDatabase } from '../../database/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, MapPin, Trees } from 'lucide-react-native';

interface Plot {
  id: string;
  name: string;
  area_acres: number;
  plant_count: number;
}

import { useRouter, useFocusEffect } from 'expo-router';

export default function PlotsScreen() {
  const router = useRouter();
  const db = useDatabase();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPlots = async () => {
    try {
      const result = await db.getAllAsync<Plot>('SELECT * FROM plots ORDER BY created_at DESC');
      setPlots(result);
    } catch (error) {
      console.error('Error fetching plots:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchPlots();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPlots();
    setRefreshing(false);
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
          <Text className="text-text text-2xl font-bold">Your Plots</Text>
          <Text className="text-text/60 text-sm">Manage your cardamom field sections</Text>
        </View>
        <TouchableOpacity 
          className="bg-accent p-3 rounded-full"
          onPress={() => router.push('/add-plot')}
        >
          <Plus size={24} color="#0d1a0f" />
        </TouchableOpacity>
      </View>

      {plots.length === 0 ? (
        <Card className="items-center py-12">
          <MapPin size={48} color="#4ade80" opacity={0.5} />
          <Text className="text-text/60 mt-4 text-center">No plots added yet.{"\n"}Tap the + button to start.</Text>
        </Card>
      ) : (
        plots.map((plot) => (
          <TouchableOpacity 
            key={plot.id} 
            className="mb-4"
            onPress={() => router.push(`/plot/${plot.id}`)}
          >
            <Card>
              <CardHeader className="flex-row justify-between items-start">
                <View>
                  <CardTitle>{plot.name}</CardTitle>
                  <CardDescription>ID: {plot.id.slice(0, 8)}</CardDescription>
                </View>
                <View className="bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
                  <Text className="text-accent text-xs font-bold">{plot.area_acres} Acres</Text>
                </View>
              </CardHeader>
              <CardContent className="flex-row gap-6 mt-2">
                <View className="flex-row items-center gap-2">
                  <Trees size={16} color="#4ade80" />
                  <Text className="text-text/80">{plot.plant_count} Plants</Text>
                </View>
              </CardContent>
            </Card>
          </TouchableOpacity>
        ))
      )}
      
      <View className="h-32" />
    </ScrollView>
  );
}
