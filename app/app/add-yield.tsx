import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDatabase } from '../database/db';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Scale, Check, Info, Calendar } from 'lucide-react-native';

const GRADES = ['A (Premium)', 'B (Standard)', 'C (Low)', 'Ungraded'];

interface Plot {
  id: string;
  name: string;
}

export default function AddYieldScreen() {
  const router = useRouter();
  const db = useDatabase();
  
  const [plots, setPlots] = useState<Plot[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [grade, setGrade] = useState('B (Standard)');
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
    if (!selectedPlotId || !quantity) {
      Alert.alert('Missing Info', 'Please select a plot and enter quantity');
      return;
    }

    setLoading(true);
    try {
      const id = Math.random().toString(36).substring(2, 11);
      const now = Date.now();
      
      await db.runAsync(
        'INSERT INTO yields (id, plot_id, date, quantity_kg, quality_grade, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, selectedPlotId, now, parseFloat(quantity), grade, notes, now]
      );
      
      router.back();
    } catch (error) {
      console.error('Error saving yield:', error);
      Alert.alert('Error', 'Failed to save record. Please try again.');
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
          <Text className="text-text text-2xl font-bold">Record Harvest</Text>
          <Text className="text-text/60 text-sm">Log your cardamom yield for today</Text>
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
          </View>

          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <Scale size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">QUANTITY (KG)</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="25.5"
                placeholderTextColor="#e8f5e960"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-accent text-sm font-bold mb-3">QUALITY GRADE</Text>
            <View className="flex-row flex-wrap gap-2">
              {GRADES.map((g) => (
                <TouchableOpacity
                  key={g}
                  onPress={() => setGrade(g)}
                  className={`px-4 py-2 rounded-full border ${
                    grade === g ? 'bg-accent border-accent' : 'bg-transparent border-text/20'
                  }`}
                >
                  <Text className={`text-sm font-bold ${grade === g ? 'text-background' : 'text-text/60'}`}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Info size={14} color="#4ade80" />
              <Text className="text-accent text-sm font-bold">NOTES</Text>
            </View>
            <TextInput
              className="bg-background text-text p-4 rounded-xl border border-text/10"
              placeholder="Any specific details about the harvest..."
              placeholderTextColor="#e8f5e960"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </Card>

        <Button 
          title={loading ? "Saving..." : "Record Yield"} 
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
