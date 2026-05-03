import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ChevronRight, LucideIcon } from 'lucide-react-native';

interface ManagementItem {
  id: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  route: string;
}

interface ManagementTabProps {
  menuItems: ManagementItem[];
  onItemPress: (route: string) => void;
}

export function ManagementTab({ menuItems, onItemPress }: ManagementTabProps) {
  return (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text weight="bold" className="text-2xl text-slate-900 mb-8">Management</Text>
      <View className="gap-5 pb-32">
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            activeOpacity={0.7}
            onPress={() => onItemPress(item.route)}
            className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex-row items-center gap-6"
          >
            <View className="w-16 h-16 bg-primary/5 rounded-[24px] items-center justify-center">
              <item.icon size={28} color="#4C6FFF" strokeWidth={2} />
            </View>
            <View className="flex-1">
              <Text weight="bold" className="text-lg text-slate-900 mb-0.5">{item.title}</Text>
              <Text className="text-slate-500 text-xs leading-4">{item.subtitle}</Text>
            </View>
            <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
              <ChevronRight size={18} color="#CBD5E1" strokeWidth={3} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
