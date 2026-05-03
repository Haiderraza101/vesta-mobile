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
    <View className="bg-white rounded-[48px] p-10 items-center justify-center border border-slate-50 shadow-sm">
      <View className="relative mb-8">
        <View className="w-28 h-28 bg-slate-50 rounded-full items-center justify-center">
          <View className="w-20 h-20 bg-white rounded-full items-center justify-center shadow-sm">
            <Icon size={32} color="#4C6FFF" strokeWidth={1.5} />
          </View>
        </View>
        <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary/20 rounded-full border-2 border-white" />
      </View>

      <Text weight="bold" className="text-xl text-slate-900 text-center mb-2">
        {title}
      </Text>
      <Text className="text-slate-400 text-center text-sm leading-5 mb-8 px-2">
        {description}
      </Text>

      {actionTitle && onAction && (
        <Button 
          title={actionTitle} 
          onPress={onAction} 
          variant="primary"
          size="sm"
          className="rounded-2xl px-8 h-12 shadow-md shadow-primary/10"
        />
      )}
    </View>
  );
}
