import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/Text';
import { ShieldCheck, Camera, UserCheck, LogOut, ChevronRight } from 'lucide-react-native';
import { AdminStats } from '@/hooks/useAdminStats';
import { UserProfile } from '@/services/userService';

interface ProfileTabProps {
  userProfile: UserProfile | null;
  stats: AdminStats;
  uploadingImage: boolean;
  onImageSelect: () => void;
  onEditDetails: () => void;
  onLogout: () => void;
}

export function ProfileTab({ 
  userProfile, 
  stats, 
  uploadingImage, 
  onImageSelect, 
  onEditDetails, 
  onLogout 
}: ProfileTabProps) {
  return (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text weight="bold" className="text-2xl text-slate-900 mb-8">Account</Text>
      
      <View className="bg-slate-900 p-10 rounded-[48px] shadow-2xl shadow-slate-900/30 mb-12 border border-white/5">
        <View className="items-center">
          <View className="relative mb-6">
            <View className="w-32 h-32 rounded-[40px] bg-white/10 items-center justify-center overflow-hidden border-2 border-white/20">
              {uploadingImage ? (
                <ActivityIndicator color="white" />
              ) : userProfile?.avatar ? (
                <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
              ) : (
                <Text weight="bold" className="text-4xl text-white">{userProfile?.fullName?.charAt(0) || 'A'}</Text>
              )}
            </View>
            <TouchableOpacity 
              onPress={onImageSelect}
              className="absolute -bottom-2 -right-2 w-11 h-11 bg-primary rounded-2xl items-center justify-center border-4 border-slate-900 shadow-lg"
            >
              <Camera size={18} color="white" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
          
          <Text weight="bold" className="text-white text-3xl text-center mb-2">{userProfile?.fullName || 'Admin'}</Text>
          <View className="flex-row items-center gap-2 px-5 py-2 bg-white/10 rounded-full border border-white/5">
             <ShieldCheck size={14} color="#4C6FFF" strokeWidth={2.5} />
             <Text weight="bold" className="text-white text-[10px]">Master administrator</Text>
          </View>
          
          <View className="flex-row gap-8 mt-10 w-full pt-8 border-t border-white/5">
             <View className="flex-1 items-center">
                <Text weight="bold" className="text-white text-lg">{stats.totalUsers}</Text>
                <Text className="text-slate-500 text-[10px]">Total users</Text>
             </View>
             <View className="w-[1px] h-full bg-white/5" />
             <View className="flex-1 items-center">
                <Text weight="bold" className="text-white text-lg">{stats.totalBookings}</Text>
                <Text className="text-slate-500 text-[10px]">Jobs logged</Text>
             </View>
          </View>
        </View>
      </View>

      <View className="px-2">
        <Text weight="bold" className="text-slate-400 text-[11px] mb-6 px-4">System controls</Text>
        
        <View className="bg-white rounded-[32px] border border-slate-50 shadow-sm overflow-hidden mb-6">
          <TouchableOpacity 
            onPress={onEditDetails}
            className="p-6 flex-row items-center gap-5 border-b border-slate-50"
          >
            <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
               <UserCheck size={20} color="#64748B" />
            </View>
            <View className="flex-1">
              <Text weight="bold" className="text-slate-900">Personal details</Text>
              <Text className="text-slate-400 text-xs">Manage your admin identity</Text>
            </View>
            <ChevronRight size={18} color="#CBD5E1" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={onLogout}
            className="p-6 flex-row items-center gap-5"
          >
            <View className="w-12 h-12 bg-rose-50 rounded-2xl items-center justify-center">
               <LogOut size={20} color="#F43F5E" />
            </View>
            <View className="flex-1">
              <Text weight="bold" className="text-rose-500">Sign out</Text>
              <Text className="text-rose-200 text-xs">Securely logout from portal</Text>
            </View>
            <ChevronRight size={18} color="#F43F5E" opacity={0.2} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
