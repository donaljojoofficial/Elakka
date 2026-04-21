import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useDatabase } from '../../database/db';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Plus, Package, Box } from 'lucide-react-native';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
}

export default function InventoryScreen() {
  const router = useRouter();
  const db = useDatabase();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      const result = await db.getAllAsync<InventoryItem>('SELECT * FROM inventory ORDER BY name ASC');
      setItems(result);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchItems();
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
          <Text className="text-text text-2xl font-bold">Inventory</Text>
          <Text className="text-text/60 text-sm">Track your supplies and equipment</Text>
        </View>
        <TouchableOpacity 
          className="bg-accent p-3 rounded-full"
          onPress={() => router.push('/add-inventory')}
        >
          <Plus size={24} color="#0d1a0f" />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <Card className="items-center py-12">
          <Package size={48} color="#4ade80" opacity={0.5} />
          <Text className="text-text/60 mt-4 text-center">No items in stock.{"\n"}Tap + to add supplies.</Text>
        </Card>
      ) : (
        items.map((item) => (
          <TouchableOpacity key={item.id} className="mb-4">
            <Card>
              <CardHeader className="flex-row justify-between items-start">
                <View>
                  <CardTitle>{item.name}</CardTitle>
                  <View className="flex-row items-center gap-1">
                    <Box size={12} color="#4ade80" opacity={0.6} />
                    <CardDescription>{item.category}</CardDescription>
                  </View>
                </View>
                <View className="bg-accent px-4 py-2 rounded-xl">
                  <Text className="text-background font-bold">{item.quantity} {item.unit}</Text>
                </View>
              </CardHeader>
            </Card>
          </TouchableOpacity>
        ))
      )}
      
      <View className="h-32" />
    </ScrollView>
  );
}
