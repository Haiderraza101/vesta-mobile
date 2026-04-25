import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from './Text';
import { Bell, MapPin } from 'lucide-react-native';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  showNotification?: boolean;
  onNotificationPress?: () => void;
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  showProfile = true, 
  showNotification = true,
  onNotificationPress 
}: ScreenHeaderProps) {
  return (
    <View className="px-6 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3">
        {showProfile && (
          <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
            <Image 
              source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop" }} 
              className="w-full h-full"
            />
          </View>
        )}
        <View>
          <Text weight="bold" className="text-[17px] text-slate-900">{title}</Text>
          {subtitle && (
            <View className="flex-row items-center gap-1 mt-0.5">
              <MapPin size={13} color="#94A3B8" />
              <Text className="text-slate-500 text-[13px]">{subtitle}</Text>
            </View>
          )}
        </View>
      </View>
      
      {showNotification && (
        <TouchableOpacity 
          onPress={onNotificationPress}
          className="w-11 h-11 items-center justify-center rounded-[14px] bg-white shadow-sm border border-slate-50"
        >
          <Bell size={20} color="#1E293B" />
        </TouchableOpacity>
      )}
    </View>
  );
}
