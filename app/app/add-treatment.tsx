import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDatabase } from '../database/db';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { FlaskConical, Calendar, Check, Info } from 'lucide-react-native';

const TYPES = ['Fertilizer', 'Pesticide', 'Fungicide', 'Other'];

interface Plot {
  id: string;
  name: string;
}

export default function AddTreatmentScreen() {
  const router = useRouter();
  const db = useDatabase();
  
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [type, setType] = useState('Fertilizer');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPlots = async () => {
      const result = await db.getAllAsync<Plot>('SELECT id, name FROM plots ORDER BY name ASC');
      setPlots(result);
      if (result.length > 0) setSelectedPlotId(result[0].id);
    };
    fetchPlots();
  }, []);

  const handleSave = async () => {
    if (!selectedPlotId || !type) {
      Alert.alert('Missing Info', 'Please select a plot and treatment type');
      return;
    }

    setLoading(true);
    try {
      const id = Math.random().toString(36).substring(2, 11);
      const now = Date.now();
      
      await db.runAsync(
        'INSERT INTO treatments (id, plot_id, type, date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, selectedPlotId, type, now, notes, now]
      );
      
      router.back();
    } catch (error) {
      console.error('Error saving treatment:', error);
      Alert.alert('Error', 'Failed to save treatment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background"
    >
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-text text-2xl font-bold">Log Treatment</Text>
          <Text className="text-text/60 text-sm">Record fertilizer or pesticide application</Text>
        </View>

        <Card className="mb-6">
          <View className="mb-6">
            <Text className="text-accent text-sm font-bold mb-3">SELECT PLOT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
              {plots.map((plot) => (
                <TouchableOpacity
                  key={plot.id}
                  onPress={() => setSelectedPlotId(plot.id)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedPlotId === plot.id ? 'bg-accent border-accent' : 'bg-transparent border-text/20'
                  }`}
                >
                  <Text className={`text-sm font-bold ${selectedPlotId === plot.id ? 'text-background' : 'text-text/60'}`}>
                    {plot.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {plots.length === 0 && (
              <Text className="text-red-400 text-xs mt-2">No plots found. Create a plot first.</Text>
            )}
          </View>

          <View className="mb-6">
            <Text className="text-accent text-sm font-bold mb-3">TREATMENT TYPE</Text>
            <View className="flex-row flex-wrap gap-2">
              {TYPES.map((t) => (
                <TouchableOpacity
                  key={t}
                  onPress={() => setType(t)}
                  className={`px-4 py-2 rounded-full border ${
                    type === t ? 'bg-accent border-accent' : 'bg-transparent border-text/20'
                  }`}
                >
                  <Text className={`text-sm font-bold ${type === t ? 'text-background' : 'text-text/60'}`}>
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Info size={14} color="#4ade80" />
              <Text className="text-accent text-sm font-bold">NOTES / QUANTITY</Text>
            </View>
            <TextInput
              className="bg-background text-text p-4 rounded-xl border border-text/10 min-h-[100px]"
              placeholder="e.g. Applied 2kg of NPK fertilizer. Used 10L of water."
              placeholderTextColor="#e8f5e960"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </Card>

        <Button 
          title={loading ? "Saving..." : "Log Treatment"} 
          onPress={handleSave}
          icon={<Check size={20} color="#0d1a0f" />}
          className="mb-4"
        />
        
        <Button 
          title="Cancel" 
          variant="ghost" 
          onPress={() => router.back()} 
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
