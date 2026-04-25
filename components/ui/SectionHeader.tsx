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
      <Text weight="bold" className="text-[19px] text-slate-900">{title}</Text>
      {onSeeAll && (
        <TouchableOpacity activeOpacity={0.6} onPress={onSeeAll}>
          <Text className="text-slate-400 text-sm font-medium">See all</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
