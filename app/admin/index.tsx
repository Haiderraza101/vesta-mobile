import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Users, 
  Layers, 
  Briefcase, 
  TrendingUp, 
  ArrowRight, 
  ShieldCheck, 
  Plus, 
  Settings,
  ChevronRight,
  Package
} from "lucide-react-native";
import { serviceService } from "../../services/serviceService";
import { bookingService } from "../../services/bookingService";
import { userService } from "../../services/userService";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allUsers = await userService.getAllUsers();
        const allBookings = await new Promise<any[]>((resolve) => {
          bookingService.subscribeToBookings('all', 'admin', (data) => resolve(data));
        });

        const providers = allUsers.filter(u => u.role === 'provider').length;
        const revenue = allBookings.reduce((acc, b) => acc + (b.status === 'completed' ? parseInt(b.price.replace('$', '')) : 0), 0);

        setStats({
          totalUsers: allUsers.length,
          totalProviders: providers,
          totalBookings: allBookings.length,
          totalRevenue: revenue
        });
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const ADMIN_MENU = [
    { 
      id: 'cats', 
      title: "Category Management", 
      subtitle: "Add or edit service categories", 
      icon: Layers, 
      route: "/admin/categories",
      color: "#4C6FFF"
    },
    { 
      id: 'services', 
      title: "Service Management", 
      subtitle: "Manage standard service listings", 
      icon: Briefcase, 
      route: "/admin/services",
      color: "#8B5CF6"
    },
    { 
      id: 'providers', 
      title: "User Management", 
      subtitle: "Manage roles and verification", 
      icon: ShieldCheck, 
      route: "/admin/users",
      color: "#10B981"
    },
    { 
      id: 'bookings', 
      title: "Global Bookings", 
      subtitle: "Monitor all platform activity", 
      icon: Package, 
      route: "/(tabs)/bookings",
      color: "#F59E0B"
    },
    { 
      id: 'settings', 
      title: "Platform Settings", 
      subtitle: "Global currency & configuration", 
      icon: Settings, 
      route: "/admin/settings",
      color: "#64748B"
    }
  ];

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="Admin Portal" subtitle="Platform Management" showProfile={false} />
        
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          {/* Stats Grid */}
          <View className="flex-row flex-wrap gap-4 mb-10">
            <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm" style={{ width: '47%' }}>
              <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mb-3">
                <Users size={20} color="#4C6FFF" />
              </View>
              <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Users</Text>
              <Text weight="bold" className="text-2xl text-slate-900">{stats.totalUsers}</Text>
            </View>
            <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm" style={{ width: '47%' }}>
              <View className="w-10 h-10 bg-green-50 rounded-xl items-center justify-center mb-3">
                <TrendingUp size={20} color="#10B981" />
              </View>
              <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Revenue</Text>
              <Text weight="bold" className="text-2xl text-slate-900">${stats.totalRevenue}</Text>
            </View>
            <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm" style={{ width: '47%' }}>
              <View className="w-10 h-10 bg-amber-50 rounded-xl items-center justify-center mb-3">
                <Briefcase size={20} color="#F59E0B" />
              </View>
              <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Providers</Text>
              <Text weight="bold" className="text-2xl text-slate-900">{stats.totalProviders}</Text>
            </View>
            <View className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm" style={{ width: '47%' }}>
              <View className="w-10 h-10 bg-rose-50 rounded-xl items-center justify-center mb-3">
                <Package size={20} color="#F43F5E" />
              </View>
              <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">Bookings</Text>
              <Text weight="bold" className="text-2xl text-slate-900">{stats.totalBookings}</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mb-10">
            <Text weight="bold" className="text-xl text-slate-900 mb-6 px-1">Control Panel</Text>
            <View className="gap-5 pb-20">
              {ADMIN_MENU.map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => router.push(item.route as any)}
                  className="bg-white p-6 rounded-[40px] border border-slate-50 shadow-sm flex-row items-center gap-6"
                >
                  <View 
                    className="w-16 h-16 rounded-[24px] items-center justify-center shadow-sm"
                    style={{ backgroundColor: `${item.color}10` }}
                  >
                    <item.icon size={28} color={item.color} strokeWidth={2} />
                  </View>
                  <View className="flex-1">
                    <Text weight="bold" className="text-lg text-slate-900 mb-0.5">{item.title}</Text>
                    <Text className="text-slate-500 text-xs leading-4">{item.subtitle}</Text>
                  </View>
                  <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                    <ChevronRight size={18} color="#CBD5E1" strokeWidth={3} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
