import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { Text } from '@/components/ui/Text';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, CheckCircle2, UserPlus, Layers, Package } from 'lucide-react-native';
import { AdminStatCard } from './AdminStatCard';
import { AdminStats } from '@/hooks/useAdminStats';
import { UserProfile } from '@/services/userService';
import { EmptyState } from '@/components/ui/EmptyState';

interface HomeTabProps {
  userProfile: UserProfile | null;
  stats: AdminStats;
  refreshing: boolean;
  onRefresh: () => void;
  onProfilePress: () => void;
  onSeeAllActivity: () => void;
  scrollRef: React.RefObject<ScrollView | null>;
}

export function HomeTab({ 
  userProfile, 
  stats, 
  refreshing, 
  onRefresh, 
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />
      }
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
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          className="p-8 rounded-[40px] shadow-xl shadow-slate-900/20"
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="bg-primary px-4 py-1.5 rounded-full">
              <Text weight="bold" className="text-white text-[10px]">Platform status</Text>
            </View>
            <Shield size={20} color="white" opacity={0.6} />
          </View>
          <Text weight="bold" className="text-white text-2xl mb-2 leading-8">Everything is running smoothly with {stats.totalBookings} total jobs</Text>
          <View className="flex-row items-center">
            <CheckCircle2 size={14} color="#10B981" />
            <Text className="text-emerald-500 text-sm ml-2">{stats.completedBookings} Completed jobs</Text>
          </View>
          
          <View className="mt-8 h-12 flex-row items-end gap-1.5">
            {[40, 60, 45, 80, 55, 90, 75, 95].map((h, i) => (
              <View key={i} style={{ height: `${h}%` }} className="flex-1 bg-primary/30 rounded-full" />
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View className="flex-row gap-4 mb-10">
        <AdminStatCard 
          label="Users"
          value={stats.totalUsers}
          subValue={stats.totalProviders}
          subLabel="Providers"
          icon={UserPlus}
          color="#4C6FFF"
        />
        <AdminStatCard 
          label="Market"
          value={stats.totalServices}
          subValue={stats.totalCategories}
          subLabel="Categories"
          icon={Layers}
          color="#F59E0B"
        />
      </View>

      <View className="mb-20">
        <View className="flex-row justify-between items-center mb-6">
          <Text weight="bold" className="text-xl text-slate-900">Recent activity</Text>
          <TouchableOpacity onPress={onSeeAllActivity}>
            <Text weight="bold" className="text-primary text-sm tracking-wider">See all</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-4">
          {stats.recentBookings.length === 0 ? (
            <EmptyState 
              title="No recent activity"
              description="New booking requests and platform updates will appear here."
              icon={Package}
            />
          ) : (
            stats.recentBookings.map((b, i) => (
              <View key={i} className="bg-white p-5 rounded-[32px] border border-slate-50 flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center">
                  <Package size={22} color="#4C6FFF" />
                </View>
                <View className="flex-1">
                  <Text weight="bold" className="text-slate-900 text-sm">{b.serviceName}</Text>
                  <Text className="text-slate-400 text-[10px] mt-0.5">{b.date}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${b.status === 'completed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                  <Text weight="bold" className={`text-[10px] ${b.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{b.status}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
