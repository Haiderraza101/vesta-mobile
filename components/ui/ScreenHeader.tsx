import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { Text } from './Text';
import { Bell, MapPin } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  showProfile?: boolean;
  showNotification?: boolean;
  hasUnread?: boolean;
  onNotificationPress?: () => void;
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  showProfile = true, 
  showNotification = true,
  hasUnread = true,
  onNotificationPress 
}: ScreenHeaderProps) {
  const { userProfile } = useAuth();

  return (
    <View className="px-6 py-4 flex-row items-center justify-between">
      <View className="flex-row items-center gap-3.5">
        {showProfile && (
          <View className="w-[52px] h-[52px] rounded-2xl overflow-hidden border-2 border-white shadow-xl shadow-slate-200 bg-primary/10 items-center justify-center">
            {userProfile?.avatar ? (
              <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
            ) : (
              <Text weight="bold" className="text-xl text-primary">{userProfile?.fullName?.charAt(0) || 'U'}</Text>
            )}
          </View>
        )}
        <View>
          <Text weight="bold" className="text-[18px] text-slate-900 leading-6">{title}</Text>
          {subtitle && (
            <View className="flex-row items-center gap-1 mt-0.5">
              <MapPin size={12} color="#4C6FFF" strokeWidth={2.5} />
              <Text weight="medium" className="text-slate-500 text-[13px]">{subtitle}</Text>
            </View>
          )}
        </View>
      </View>
      
      {showNotification && (
        <TouchableOpacity 
          onPress={onNotificationPress}
          className="w-[52px] h-[52px] items-center justify-center rounded-2xl bg-white shadow-lg shadow-slate-100 border border-slate-50"
        >
          <View>
            <Bell size={22} color="#1E293B" strokeWidth={2} />
            {hasUnread && (
              <View className="absolute top-[-2] right-[-2] w-3 h-3 bg-rose-500 rounded-full border-2 border-white" />
            )}
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
