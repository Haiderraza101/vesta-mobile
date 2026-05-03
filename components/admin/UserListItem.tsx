import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Shield, Briefcase, User as UserIcon, Mail, ChevronRight } from 'lucide-react-native';
import { UserProfile } from '@/services/userService';

interface UserListItemProps {
  user: UserProfile;
  onPress: (user: UserProfile) => void;
}

export function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      onPress={() => onPress(user)}
      className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm flex-row items-center gap-5"
    >
      <View className={`w-14 h-14 rounded-2xl items-center justify-center ${
        user.role === 'admin' ? 'bg-primary/10' : user.role === 'provider' ? 'bg-primary/5' : 'bg-slate-50'
      }`}>
        {user.role === 'admin' ? <Shield size={24} color="#4C6FFF" /> : 
         user.role === 'provider' ? <Briefcase size={24} color="#4C6FFF" /> : 
         <UserIcon size={24} color="#4C6FFF" />}
      </View>
      <View className="flex-1">
        <Text weight="bold" className="text-lg text-slate-900 mb-0.5">{user.fullName}</Text>
        <View className="flex-row items-center gap-2">
          <Mail size={12} color="#4C6FFF" />
          <Text className="text-slate-400 text-xs">{user.email}</Text>
        </View>
      </View>
      <View className={`px-2.5 py-1 rounded-full ${
        user.role === 'admin' ? 'bg-primary/10' : user.role === 'provider' ? 'bg-primary/5' : 'bg-slate-100'
      }`}>
        <Text weight="bold" className="text-[10px] text-primary uppercase tracking-widest">{user.role}</Text>
      </View>
      <ChevronRight size={18} color="#CBD5E1" strokeWidth={3} />
    </TouchableOpacity>
  );
}
