import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDatabase } from '../database/db';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Trees, Map, Check } from 'lucide-react-native';

export default function AddPlotScreen() {
  const router = useRouter();
  const db = useDatabase();
  
  const [name, setName] = useState('');
  const [area, setArea] = useState('');
  const [plants, setPlants] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !area || !plants) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const id = Math.random().toString(36).substring(2, 11);
      const now = Date.now();
      
      await db.runAsync(
        'INSERT INTO plots (id, name, area_acres, plant_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, name, parseFloat(area), parseInt(plants, 10), now, now]
      );
      
      router.back();
    } catch (error) {
      console.error('Error saving plot:', error);
      Alert.alert('Error', 'Failed to save plot. Please try again.');
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
          <Text className="text-text text-2xl font-bold">New Plot</Text>
          <Text className="text-text/60 text-sm">Define a new area for your cardamom field</Text>
        </View>

        <Card className="mb-6">
          <View className="mb-4">
            <Text className="text-accent text-sm font-bold mb-2">PLOT NAME</Text>
            <TextInput
              className="bg-background text-text p-4 rounded-xl border border-text/10"
              placeholder="e.g. North Hillside"
              placeholderTextColor="#e8f5e960"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Map size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">AREA (ACRES)</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="0.5"
                placeholderTextColor="#e8f5e960"
                keyboardType="numeric"
                value={area}
                onChangeText={setArea}
              />
            </View>

            <View className="flex-1 mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Trees size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">PLANT COUNT</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="150"
                placeholderTextColor="#e8f5e960"
                keyboardType="numeric"
                value={plants}
                onChangeText={setPlants}
              />
            </View>
          </View>
        </Card>

        <Button 
          title={loading ? "Saving..." : "Create Plot"} 
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
