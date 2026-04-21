import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useDatabase } from '../database/db';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { CloudRain, Thermometer, Check, Info } from 'lucide-react-native';

export default function AddWeatherScreen() {
  const router = useRouter();
  const db = useDatabase();
  
  const [temp, setTemp] = useState('');
  const [rain, setRain] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!temp && !rain) {
      Alert.alert('Missing Info', 'Please enter at least temperature or rainfall');
      return;
    }

    setLoading(true);
    try {
      const id = Math.random().toString(36).substring(2, 11);
      const now = Date.now();
      
      await db.runAsync(
        'INSERT INTO weather_log (id, date, temperature, rainfall_mm, notes, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [id, now, temp ? parseFloat(temp) : null, rain ? parseFloat(rain) : null, notes, now]
      );
      
      router.back();
    } catch (error) {
      console.error('Error saving weather:', error);
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
          <Text className="text-text text-2xl font-bold">Log Weather</Text>
          <Text className="text-text/60 text-sm">Record conditions for today's field work</Text>
        </View>

        <Card className="mb-6">
          <View className="flex-row gap-4 mb-6">
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <Thermometer size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">TEMP (°C)</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="24"
                placeholderTextColor="#e8f5e960"
                keyboardType="numeric"
                value={temp}
                onChangeText={setTemp}
              />
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-2">
                <CloudRain size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">RAIN (MM)</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="10"
                placeholderTextColor="#e8f5e960"
                keyboardType="numeric"
                value={rain}
                onChangeText={setRain}
              />
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Info size={14} color="#4ade80" />
              <Text className="text-accent text-sm font-bold">GENERAL NOTES</Text>
            </View>
            <TextInput
              className="bg-background text-text p-4 rounded-xl border border-text/10 min-h-[80px]"
              placeholder="e.g. Morning mist, clear afternoon"
              placeholderTextColor="#e8f5e960"
              multiline
              textAlignVertical="top"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </Card>

        <Button 
          title={loading ? "Saving..." : "Log Conditions"} 
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
