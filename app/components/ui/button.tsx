import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  icon?: React.ReactNode;
}

export function Button({ 
  onPress, 
  title, 
  variant = 'primary', 
  className = '', 
  icon 
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-accent';
      case 'secondary':
        return 'bg-surface border border-text/10';
      case 'outline':
        return 'bg-transparent border border-accent';
      case 'ghost':
        return 'bg-transparent';
      default:
        return 'bg-accent';
    }
  };

  const getTextStyles = () => {
    switch (variant) {
      case 'primary':
        return 'text-background';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return 'text-accent';
      default:
        return 'text-background';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-center rounded-xl px-6 py-3 ${getVariantStyles()} ${className}`}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={`text-base font-bold ${getTextStyles()}`}>{title}</Text>
    </TouchableOpacity>
  );
}
