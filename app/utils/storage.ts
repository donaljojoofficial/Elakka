import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const isWeb = Platform.OS === 'web';

export const getItemAsync = async (key: string): Promise<string | null> => {
  if (isWeb && typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }
  if (!isWeb) {
    return await SecureStore.getItemAsync(key);
  }
  return null;
};

export const setItemAsync = async (key: string, value: string): Promise<void> => {
  if (isWeb && typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
    return;
  }
  if (!isWeb) {
    await SecureStore.setItemAsync(key, value);
  }
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  if (isWeb && typeof window !== 'undefined') {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
    return;
  }
  if (!isWeb) {
    await SecureStore.deleteItemAsync(key);
  }
};

