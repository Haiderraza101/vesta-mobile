import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { configService, PlatformSettings } from '../../services/configService';

interface PriceProps {
  amount: number | string;
  className?: string;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  size?: number;
}

export function Price({ amount, className = "", weight = "bold", size }: PriceProps) {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);

  useEffect(() => {
    // Subscribe to real-time settings changes
    const unsubscribe = configService.subscribeToSettings((newSettings) => {
      setSettings(newSettings);
    });
    return () => unsubscribe();
  }, []);

  const numAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.]/g, '')) : amount;
  
  if (isNaN(numAmount)) return <Text className={className}>-</Text>;

  return (
    <Text 
      weight={weight} 
      className={`text-primary ${className}`}
      style={size ? { fontSize: size } : {}}
    >
      {settings?.currencySymbol || '$'}
      {numAmount.toLocaleString()}
    </Text>
  );
}
