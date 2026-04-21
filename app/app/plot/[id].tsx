import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useDatabase } from '../../database/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Trees, MapPin, Droplets, TrendingUp, AlertTriangle, ChevronLeft } from 'lucide-react-native';

interface PlotDetails {
  id: string;
  name: string;
  area_acres: number;
  plant_count: number;
}

interface Activity {
  id: string;
  type: string;
  date: number;
  notes: string;
  category: 'treatment' | 'yield' | 'problem';
}

export default function PlotDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const db = useDatabase();
  
  const [plot, setPlot] = useState<PlotDetails | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDetails = async () => {
    try {
      // 1. Fetch Plot Info
      const plotRes = await db.getFirstAsync<PlotDetails>('SELECT * FROM plots WHERE id = ?', [id]);
      setPlot(plotRes);

      // 2. Fetch combined activity history
      const treatments = await db.getAllAsync<any>(
        'SELECT id, type, date, notes FROM treatments WHERE plot_id = ?', [id]
      );
      const yields = await db.getAllAsync<any>(
        'SELECT id, quantity_kg as type, date, notes FROM yields WHERE plot_id = ?', [id]
      );
      const problems = await db.getAllAsync<any>(
        'SELECT id, type, date_identified as date, notes FROM problems WHERE plot_id = ?', [id]
      );

      const combined: Activity[] = [
        ...treatments.map(t => ({ ...t, category: 'treatment' as const })),
        ...yields.map(y => ({ ...y, type: `${y.type} Kg`, category: 'yield' as const })),
        ...problems.map(p => ({ ...p, category: 'problem' as const }))
      ].sort((a, b) => b.date - a.date);

      setActivities(combined);
    } catch (error) {
      console.error('Error fetching plot details:', error);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDetails();
    setRefreshing(false);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short'
    });
  };

  if (!plot) return null;

  return (
    <ScrollView 
      className="flex-1 bg-background"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4ade80" />}
    >
      <View className="p-4 pt-12">
        <TouchableOpacity onPress={() => router.back()} className="mb-4">
          <ChevronLeft size={24} color="#4ade80" />
        </TouchableOpacity>
        
        <View className="mb-6">
          <Text className="text-text text-3xl font-bold">{plot.name}</Text>
          <View className="flex-row items-center gap-4 mt-2">
            <View className="flex-row items-center gap-1">
              <Trees size={16} color="#4ade80" />
              <Text className="text-text/60">{plot.plant_count} Plants</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MapPin size={16} color="#4ade80" />
              <Text className="text-text/60">{plot.area_acres} Acres</Text>
            </View>
          </View>
        </View>

        <Text className="text-text text-xl font-bold mb-4">Activity History</Text>
        
        {activities.length === 0 ? (
          <Card className="items-center py-8">
            <Text className="text-text/40 italic">No activity recorded for this plot yet.</Text>
          </Card>
        ) : (
          activities.map((activity) => (
            <Card key={activity.id} className="mb-3 border-l-4 border-l-accent">
              <View className="flex-row justify-between items-start">
                <View className="flex-row items-center gap-3">
                  {activity.category === 'treatment' && <Droplets size={20} color="#4ade80" />}
                  {activity.category === 'yield' && <TrendingUp size={20} color="#4ade80" />}
                  {activity.category === 'problem' && <AlertTriangle size={20} color="#f87171" />}
                  <View>
                    <Text className="text-text font-bold">
                      {activity.category === 'treatment' ? 'Treatment: ' : ''}
                      {activity.category === 'yield' ? 'Harvested: ' : ''}
                      {activity.category === 'problem' ? 'Issue: ' : ''}
                      {activity.type}
                    </Text>
                    <Text className="text-text/40 text-xs">{formatDate(activity.date)}</Text>
                  </View>
                </View>
              </View>
              {activity.notes ? (
                <Text className="text-text/60 text-xs mt-2 italic">"{activity.notes}"</Text>
              ) : null}
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}
