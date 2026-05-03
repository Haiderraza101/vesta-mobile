import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { TrendingUp, Package } from 'lucide-react-native';
import Svg, { Circle } from 'react-native-svg';
import { AdminStats } from '@/hooks/useAdminStats';

interface AnalyticsTabProps {
  stats: AdminStats;
  onManageServices: () => void;
}

export function AnalyticsTab({ stats, onManageServices }: AnalyticsTabProps) {
  return (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text weight="bold" className="text-2xl text-slate-900 mb-8">Analytics</Text>

      <View className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm mb-8">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text weight="bold" className="text-lg text-slate-900">Most popular</Text>
            <Text className="text-slate-400 text-xs mt-0.5">Top performing services</Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
            <TrendingUp size={18} color="#4C6FFF" />
          </TouchableOpacity>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="relative w-[140px] h-[140px] justify-center items-center">
            {stats.topServices.length === 0 ? (
              <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center border-4 border-white shadow-sm">
                 <Package size={24} color="#CBD5E1" />
              </View>
            ) : (
              stats.topServices.map((s, i) => {
                const sizes = [110, 80, 60, 45];
                const positions = [
                  { top: 0, left: 0 },
                  { top: 10, right: 0 },
                  { bottom: 0, left: 10 },
                  { bottom: 20, right: 10 }
                ];
                return (
                  <View 
                    key={i}
                    style={{ 
                      width: sizes[i], 
                      height: sizes[i], 
                      backgroundColor: s.color,
                      position: 'absolute',
                      ...positions[i],
                      opacity: 1 - (i * 0.15)
                    }}
                    className="rounded-full items-center justify-center border-4 border-white shadow-sm"
                  >
                    <Text weight="bold" className="text-white text-[12px]">{s.count}</Text>
                  </View>
                );
              })
            )}
          </View>

          <View className="flex-1 ml-10 gap-5">
            {stats.topServices.map((s, i) => (
              <View key={i}>
                <View className="flex-row justify-between mb-1.5">
                  <Text weight="bold" className="text-slate-800 text-[10px] flex-1 mr-2" numberOfLines={1}>{s.name}</Text>
                  <Text weight="bold" className="text-slate-400 text-[10px]">{s.count}</Text>
                </View>
                <View className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <View style={{ width: `${(s.count / (stats.topServices[0]?.count || 1)) * 100}%`, backgroundColor: s.color }} className="h-full rounded-full" />
                </View>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          onPress={onManageServices}
          className="mt-10 py-4 bg-slate-50 rounded-2xl items-center border border-slate-100"
        >
           <Text weight="bold" className="text-slate-600 text-sm tracking-widest">Manage all services</Text>
        </TouchableOpacity>
      </View>

      <View className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm mb-8">
        <Text weight="bold" className="text-lg text-slate-900 mb-6">User types</Text>
        <View className="flex-row items-center justify-between">
          <View className="gap-4">
            {['Customers', 'Providers', 'Admins'].map((label, i) => (
              <View key={label} className="flex-row items-center gap-3">
                <View className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                <Text className="text-slate-500 text-sm">{label} ({i === 0 ? stats.totalCustomers : i === 1 ? stats.totalProviders : stats.totalAdmins})</Text>
              </View>
            ))}
          </View>
          <Svg height="120" width="120" viewBox="0 0 100 100">
            <Circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
            <Circle cx="50" cy="50" r="40" stroke="#4C6FFF" strokeWidth="12" fill="none" strokeDasharray={`${(stats.totalCustomers / (stats.totalUsers || 1)) * 251}, 251`} strokeDashoffset="0" strokeLinecap="round" rotation="-90" origin="50, 50" />
            <Circle cx="50" cy="50" r="40" stroke="#10B981" strokeWidth="12" fill="none" strokeDasharray={`${(stats.totalProviders / (stats.totalUsers || 1)) * 251}, 251`} strokeDashoffset={`${- (stats.totalCustomers / (stats.totalUsers || 1)) * 251}`} strokeLinecap="round" rotation="-90" origin="50, 50" />
            <Circle cx="50" cy="50" r="40" stroke="#94A3B8" strokeWidth="12" fill="none" strokeDasharray={`${(stats.totalAdmins / (stats.totalUsers || 1)) * 251}, 251`} strokeDashoffset={`${- ((stats.totalCustomers + stats.totalProviders) / (stats.totalUsers || 1)) * 251}`} strokeLinecap="round" rotation="-90" origin="50, 50" />
          </Svg>
        </View>
      </View>
    </ScrollView>
  );
}
