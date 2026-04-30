import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { LucideIcon, Inbox } from 'lucide-react-native';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionTitle?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = Inbox, 
  actionTitle, 
  onAction 
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-10 py-20">
      <View className="w-24 h-24 bg-slate-50 rounded-[32px] items-center justify-center mb-8">
        <Icon size={40} color="#94A3B8" />
      </View>
      <Text weight="bold" className="text-2xl text-slate-900 text-center mb-3">
        {title}
      </Text>
      <Text className="text-slate-500 text-center leading-6 mb-10">
        {description}
      </Text>
      {actionTitle && onAction && (
        <Button 
          title={actionTitle} 
          onPress={onAction} 
          variant="outline"
          className="rounded-full px-10"
        />
      )}
    </View>
  );
}
