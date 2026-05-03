import React from 'react';
import { View, Dimensions } from 'react-native';
import { Text } from './Text';
import { useConfig } from '@/context/ConfigContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DataPoint {
  label: string;
  value: number;
}

interface AnalyticsGraphProps {
  data: DataPoint[];
  title: string;
  color?: string;
}

export function AnalyticsGraph({ data, title, color = '#4C6FFF' }: AnalyticsGraphProps) {
  const { settings } = useConfig();
  const maxValue = Math.max(...data.map(d => d.value), 1);
  
  return (
    <View className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm shadow-slate-100">
      <View className="flex-row justify-between items-center mb-8">
        <Text weight="bold" className="text-slate-900 text-lg">{title}</Text>
        <View className="bg-slate-50 px-3 py-1 rounded-full">
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Last 7 Days</Text>
        </View>
      </View>

      <View className="flex-row items-end justify-between h-40 px-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100;
          return (
            <View key={index} className="items-center flex-1">
              <View className="relative w-full items-center">
                <View 
                  style={{ height: `${Math.max(height, 5)}%`, backgroundColor: color }}
                  className="w-3 rounded-full opacity-20 absolute bottom-0"
                />
                <View 
                  style={{ height: `${Math.max(height, 5)}%`, backgroundColor: color }}
                  className="w-3 rounded-full"
                />
              </View>
              <Text className="text-slate-400 text-[10px] mt-3 font-bold uppercase">{item.label}</Text>
            </View>
          );
        })}
      </View>

      <View className="mt-8 pt-6 border-t border-slate-50 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Weekly Total</Text>
          <Text weight="bold" className="text-slate-900 text-xl">
            {settings.currencySymbol}{data.reduce((acc, d) => acc + d.value, 0).toFixed(2)}
          </Text>
        </View>
        <View className="bg-emerald-50 px-3 py-1.5 rounded-xl">
          <Text weight="bold" className="text-emerald-600 text-[10px]">+12.5%</Text>
        </View>
      </View>
    </View>
  );
}
