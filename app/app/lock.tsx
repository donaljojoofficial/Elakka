import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuthStore } from '../store/useAuthStore';
import * as Haptics from 'expo-haptics';
import { Fingerprint, Delete, ShieldAlert, ShieldCheck } from 'lucide-react-native';

export default function LockScreen() {
  const { hasPinSet, checkPinSet, setPin, unlock, isLocked } = useAuthStore();
  const [input, setInput] = useState('');
  const [setupStep, setSetupStep] = useState(1); // 1: Enter new, 2: Confirm new
  const [tempPin, setTempPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    checkPinSet();
  }, []);

  const handlePress = (num: string) => {
    if (input.length < 6) {
      const newInput = input + num;
      setInput(newInput);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (newInput.length === 6) {
        processInput(newInput);
      }
    }
  };

  const handleDelete = () => {
    setInput(input.slice(0, -1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const processInput = async (finalInput: string) => {
    if (!hasPinSet) {
      if (setupStep === 1) {
        setTempPin(finalInput);
        setSetupStep(2);
        setInput('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        if (finalInput === tempPin) {
          await setPin(finalInput);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        } else {
          setError(true);
          setInput('');
          setSetupStep(1);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          setTimeout(() => setError(false), 2000);
        }
      }
    } else {
      const success = await unlock(finalInput);
      if (!success) {
        setError(true);
        setInput('');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setTimeout(() => setError(false), 2000);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  };

  const renderKey = (num: string) => (
    <TouchableOpacity
      key={num}
      onPress={() => handlePress(num)}
      className="w-20 h-20 items-center justify-center rounded-full bg-surface m-2"
    >
      <Text className="text-text text-3xl font-semibold">{num}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center px-8">
      <View className="mb-12 items-center">
        {error ? (
          <ShieldAlert size={64} color="#ef4444" />
        ) : (
          <ShieldCheck size={64} color="#4ade80" />
        )}
        <Text className="text-text text-2xl font-bold mt-4">
          {!hasPinSet 
            ? (setupStep === 1 ? 'Set Up PIN' : 'Confirm PIN')
            : 'Enter PIN'}
        </Text>
        <Text className="text-text/60 text-sm mt-2">
          {error ? 'PINs do not match' : 'Protect your farm data'}
        </Text>
      </View>

      <View className="flex-row gap-4 mb-12">
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            className={`w-4 h-4 rounded-full border-2 border-accent ${
              input.length > i ? 'bg-accent' : 'bg-transparent'
            }`}
          />
        ))}
      </View>

      <View className="flex-row flex-wrap justify-center max-w-[300px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(renderKey)}
        <View className="w-20 h-20 m-2" />
        {renderKey('0')}
        <TouchableOpacity
          onPress={handleDelete}
          className="w-20 h-20 items-center justify-center rounded-full m-2"
        >
          <Delete size={32} color="#e8f5e9" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
