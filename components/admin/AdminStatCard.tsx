import React from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/Text';
import { LucideIcon } from 'lucide-react-native';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  subValue?: string | number;
  subLabel?: string;
  icon: LucideIcon;
  color: string;
}

export function AdminStatCard({ label, value, subValue, subLabel, icon: Icon, color }: AdminStatCardProps) {
  return (
    <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
      <Text className="text-slate-400 text-[10px] font-bold mb-4 uppercase tracking-wider">{label}</Text>
      <Text weight="bold" className="text-2xl text-slate-900 mb-2">{value}</Text>
      {subValue !== undefined && (
        <View className="flex-row items-center">
          <Icon size={12} color={color} />
          <Text style={{ color }} className="text-[10px] font-bold ml-1">
            {subValue} {subLabel && <Text className="text-slate-300 font-normal">{subLabel}</Text>}
          </Text>
        </View>
      )}
    </View>
  );
}
