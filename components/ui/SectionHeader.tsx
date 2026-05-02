import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';

interface SectionHeaderProps {
  title: string;
  onSeeAll?: () => void;
  className?: string;
}

export function SectionHeader({ title, onSeeAll, className = '' }: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between mb-6 ${className}`}>
      <Text weight="bold" className="text-[20px] tracking-tight text-slate-900">{title}</Text>
      {onSeeAll && (
        <TouchableOpacity 
          activeOpacity={0.7} 
          onPress={onSeeAll}
          className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
        >
          <Text weight="bold" className="text-[#4C6FFF] text-[12px] uppercase tracking-widest">See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
