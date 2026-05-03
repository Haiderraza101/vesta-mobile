import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, CheckCircle2, UserPlus, Layers, Package } from 'lucide-react-native';
import { AdminStatCard } from './AdminStatCard';
import { AdminStats } from '@/hooks/useAdminStats';
import { UserProfile } from '@/services/userService';

interface HomeTabProps {
  userProfile: UserProfile | null;
  stats: AdminStats;
  onProfilePress: () => void;
  onSeeAllActivity: () => void;
  scrollRef: React.RefObject<ScrollView | null>;
}

export function HomeTab({ 
  userProfile, 
  stats, 
  onProfilePress, 
  onSeeAllActivity,
  scrollRef 
}: HomeTabProps) {
  return (
    <ScrollView 
      ref={scrollRef}
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={onProfilePress}>
            <View className="w-14 h-14 rounded-2xl bg-primary/10 items-center justify-center overflow-hidden border border-slate-100">
               {userProfile?.avatar ? (
                 <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
               ) : (
                 <Text weight="bold" className="text-xl text-primary">{userProfile?.fullName?.charAt(0) || 'A'}</Text>
               )}
            </View>
          </TouchableOpacity>
          <View>
            <Text weight="bold" className="text-2xl text-slate-900">Welcome back</Text>
            <Text className="text-slate-400 text-sm font-medium">{userProfile?.fullName || 'Admin'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.9} className="mb-10">
        <LinearGradient 
          colors={['#0F172A', '#1E293B']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="rounded-[40px] p-8 shadow-2xl shadow-slate-200 relative overflow-hidden"
        >
          <View className="z-10">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 bg-emerald-500 rounded-2xl items-center justify-center">
                <Shield size={20} color="white" />
              </View>
              <Text weight="bold" className="text-white text-lg">System Active</Text>
            </View>
            <Text className="text-slate-400 text-sm leading-6 mb-6">
              All systems are running smoothly. You have {stats.pendingBookings} pending service requests to review.
            </Text>
            <TouchableOpacity 
              onPress={onSeeAllActivity}
              className="bg-white/10 self-start px-6 py-3 rounded-2xl border border-white/10"
            >
              <Text weight="bold" className="text-white text-xs tracking-widest uppercase">View Activity</Text>
            </TouchableOpacity>
          </View>
          <View className="absolute -right-10 -bottom-10 opacity-10">
            <Shield size={200} color="white" />
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View className="gap-6">
        <View className="flex-row gap-6">
          <AdminStatCard 
            label="Total Users" 
            value={stats.totalUsers} 
            icon={UserPlus} 
            color="#4C6FFF"
          />
          <AdminStatCard 
            label="Total Bookings" 
            value={stats.totalBookings} 
            icon={CheckCircle2} 
            color="#10B981"
          />
        </View>
        <View className="flex-row gap-6">
          <AdminStatCard 
            label="Categories" 
            value={stats.totalCategories} 
            icon={Layers} 
            color="#F59E0B"
          />
          <AdminStatCard 
            label="Services" 
            value={stats.totalServices} 
            icon={Package} 
            color="#8B5CF6"
          />
        </View>
      </View>
    </ScrollView>
  );
}
