import React from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Price } from '@/components/ui/Price';
import { Trash2 } from 'lucide-react-native';
import { Service } from '@/services/serviceService';

interface ServiceListItemProps {
  service: Service;
  onDelete: (id: string) => void;
}

export function ServiceListItem({ service, onDelete }: ServiceListItemProps) {
  return (
    <View className="bg-slate-50 p-5 rounded-[32px] border border-slate-100 flex-row gap-5">
      <Image source={{ uri: service.image }} className="w-20 h-20 rounded-2xl" />
      <View className="flex-1">
        <Text weight="bold" className="text-base text-slate-900">{service.title}</Text>
        <Price amount={service.price} className="mt-1" />
        <View className="bg-white border border-slate-100 self-start px-2.5 py-1 rounded-full mt-2">
          <Text weight="bold" className="text-[10px] text-slate-400 uppercase tracking-widest">{service.category}</Text>
        </View>
      </View>
      <TouchableOpacity 
        className="w-11 h-11 bg-white rounded-2xl items-center justify-center self-center border border-slate-100"
        onPress={() => onDelete(service.id)}
      >
        <Trash2 size={18} color="#64748B" />
      </TouchableOpacity>
    </View>
  );
}
