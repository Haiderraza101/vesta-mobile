import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Trash2 } from 'lucide-react-native';
import { Category } from '@/services/serviceService';

interface CategoryListItemProps {
  category: Category;
  onDelete: (id: string) => void;
}

export function CategoryListItem({ category, onDelete }: CategoryListItemProps) {
  return (
    <View className="bg-slate-50 p-5 rounded-[32px] flex-row items-center gap-5 border border-slate-100">
      <Image source={{ uri: category.image }} className="w-16 h-16 rounded-2xl" />
      <View className="flex-1">
        <Text weight="bold" className="text-lg text-slate-900">{category.name}</Text>
        <Text className="text-slate-400 text-xs mt-0.5">ID: {category.id?.slice(-6)}</Text>
      </View>
      <TouchableOpacity 
        className="w-11 h-11 bg-white rounded-2xl items-center justify-center border border-slate-100"
        onPress={() => onDelete(category.id)}
      >
        <Trash2 size={18} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
}
