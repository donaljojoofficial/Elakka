import { View, Text } from 'react-native';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <View className={`bg-surface rounded-2xl p-4 shadow-sm border border-text/10 ${className}`}>
      {children}
    </View>
  );
}

export function CardHeader({ children, className = '' }: CardProps) {
  return <View className={`mb-2 ${className}`}>{children}</View>;
}

export function CardTitle({ children, className = '' }: CardProps) {
  return <Text className={`text-text text-lg font-bold ${className}`}>{children}</Text>;
}

export function CardDescription({ children, className = '' }: CardProps) {
  return <Text className={`text-text/60 text-sm ${className}`}>{children}</Text>;
}

export function CardContent({ children, className = '' }: CardProps) {
  return <View className={className}>{children}</View>;
}
