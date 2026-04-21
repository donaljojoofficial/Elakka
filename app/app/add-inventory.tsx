import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDatabase } from '../database/db';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Package, Hash, Check, Info } from 'lucide-react-native';

const CATEGORIES = ['Chemical', 'Equipment', 'Fertilizer', 'Other'];

export default function AddInventoryScreen() {
  const router = useRouter();
  const db = useDatabase();
  
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Chemical');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !quantity || !unit) {
      Alert.alert('Missing Info', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const id = Math.random().toString(36).substring(2, 11);
      const now = Date.now();
      
      await db.runAsync(
        'INSERT INTO inventory (id, name, category, quantity, unit, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name, category, parseFloat(quantity), unit, now, now]
      );
      
      router.back();
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert('Error', 'Failed to save item. Please try again.');
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
          <Text className="text-text text-2xl font-bold">Add Item</Text>
          <Text className="text-text/60 text-sm">Add chemicals, tools, or fertilizers to stock</Text>
        </View>

        <Card className="mb-6">
          <View className="mb-4">
            <Text className="text-accent text-sm font-bold mb-2">ITEM NAME</Text>
            <TextInput
              className="bg-background text-text p-4 rounded-xl border border-text/10"
              placeholder="e.g. Copper Oxychloride"
              placeholderTextColor="#e8f5e960"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View className="mb-4">
            <Text className="text-accent text-sm font-bold mb-2">CATEGORY</Text>
            <View className="flex-row flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-full border ${
                    category === cat ? 'bg-accent border-accent' : 'bg-transparent border-text/20'
                  }`}
                >
                  <Text className={`text-sm font-bold ${category === cat ? 'text-background' : 'text-text/60'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1 mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Hash size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">QUANTITY</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="10"
                placeholderTextColor="#e8f5e960"
                keyboardType="numeric"
                value={quantity}
                onChangeText={setQuantity}
              />
            </View>

            <View className="flex-1 mb-4">
              <View className="flex-row items-center gap-2 mb-2">
                <Info size={14} color="#4ade80" />
                <Text className="text-accent text-sm font-bold">UNIT</Text>
              </View>
              <TextInput
                className="bg-background text-text p-4 rounded-xl border border-text/10"
                placeholder="Kg / Ltr"
                placeholderTextColor="#e8f5e960"
                value={unit}
                onChangeText={setUnit}
              />
            </View>
          </View>
        </Card>

        <Button 
          title={loading ? "Saving..." : "Save Item"} 
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
