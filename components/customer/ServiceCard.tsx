import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Star, MapPin, ChevronRight } from 'lucide-react-native';
import { Service } from '@/services/serviceService';
import { useConfig } from '@/context/ConfigContext';

interface ServiceCardProps {
  service: Service;
  onPress: () => void;
}

export function ServiceCard({ service, onPress }: ServiceCardProps) {
  const { settings } = useConfig();

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-2xl p-3 mb-4 flex-row items-center border border-slate-50 shadow-sm"
    >
      <Image 
        source={{ uri: service.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958' }} 
        className="w-20 h-20 rounded-xl"
      />
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            <Text weight="bold" className="text-sm text-slate-900 mb-0.5" numberOfLines={1}>{service.title}</Text>
            <View className="flex-row items-center gap-1">
              <MapPin size={10} color="#94A3B8" />
              <Text className="text-slate-400 text-[10px] font-medium">{service.category}</Text>
            </View>
          </View>
          <View className="bg-primary/10 px-2 py-1 rounded-lg">
            <Text weight="bold" className="text-primary text-[11px]">{settings.currencySymbol}{service.price}</Text>
          </View>
        </View>
        
        <View className="flex-row items-center justify-between mt-3">
          <View className="flex-row items-center gap-1">
            <Star size={12} color="#FBBF24" fill="#FBBF24" />
            <Text weight="bold" className="text-slate-700 text-[11px]">{service.rating || '4.8'}</Text>
            <Text className="text-slate-400 text-[10px]">({service.reviews || '120'})</Text>
          </View>
          <View className="flex-row items-center bg-slate-50 px-2 py-1 rounded-lg">
            <Text className="text-primary text-[10px] font-bold mr-1">Book</Text>
            <ChevronRight size={10} color="#4C6FFF" strokeWidth={3} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
