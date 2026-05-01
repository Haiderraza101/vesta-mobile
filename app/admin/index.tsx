import React, { useState, useEffect, useRef } from "react";
import { View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AppModal } from "../../components/ui/AppModal";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import { 
  Users, 
  Layers, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  Settings,
  ChevronRight,
  Package,
  Home,
  BarChart3,
  LayoutGrid,
  Bell,
  ArrowUpRight,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  LogOut,
  User,
  Camera,
  Shield,
  Activity,
  Cpu,
  Globe
} from "lucide-react-native";
import { serviceService } from "../../services/serviceService";
import { bookingService } from "../../services/bookingService";
import { userService } from "../../services/userService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useDisclosure } from "../../hooks/useDisclosure";

type TabType = 'home' | 'analytics' | 'management' | 'profile';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const logoutDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [name, setName] = useState(userProfile?.fullName || "");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalAdmins: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalServices: 0,
    totalCategories: 0,
    recentBookings: [] as any[],
    topServices: [] as { name: string, count: number, color: string }[]
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allUsers, allCategories, allServices] = await Promise.all([
          userService.getAllUsers(),
          serviceService.getCategories(),
          serviceService.getPopularServices()
        ]);

        const allBookings = await new Promise<any[]>((resolve) => {
          bookingService.subscribeToBookings('all', 'admin', (data) => resolve(data));
        });

        const serviceCounts: { [key: string]: number } = {};
        allBookings.forEach(b => {
          if (b.serviceName) {
            serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
          }
        });

        const colors = ['#4C6FFF', '#10B981', '#F59E0B', '#8B5CF6'];
        const topServices = Object.entries(serviceCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4)
          .map(([name, count], i) => ({
            name,
            count,
            color: colors[i] || '#4C6FFF'
          }));

        setStats({
          totalUsers: allUsers.length,
          totalProviders: allUsers.filter(u => u.role === 'provider').length,
          totalCustomers: allUsers.filter(u => u.role === 'customer').length,
          totalAdmins: allUsers.filter(u => u.role === 'admin').length,
          totalBookings: allBookings.length,
          pendingBookings: allBookings.filter(b => b.status === 'pending').length,
          completedBookings: allBookings.filter(b => b.status === 'completed').length,
          cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length,
          totalServices: allServices.length,
          totalCategories: allCategories.length,
          recentBookings: allBookings.slice(0, 3),
          topServices
        });
      } catch (error) {
        console.error("Stats fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async () => {
    if (!userProfile?.uid) return;
    setUpdating(true);
    try {
      await userService.updateUserProfile(userProfile.uid, { fullName: name });
      showToast("Profile updated", "success");
      editDisclosure.close();
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      logoutDisclosure.close();
      router.replace("/onboarding");
      showToast("Signed out", "success");
    } catch (error) {
      showToast("Sign out failed", "error");
    }
  };

  const ADMIN_MENU = [
    { id: 'cats', title: "Categories", subtitle: "Manage groupings", icon: Layers, route: "/admin/categories" },
    { id: 'services', title: "Services", subtitle: "Manage listings", icon: Briefcase, route: "/admin/services" },
    { id: 'users', title: "Users", subtitle: "Manage accounts", icon: ShieldCheck, route: "/admin/users" },
    { id: 'settings', title: "Settings", subtitle: "App configuration", icon: Settings, route: "/admin/settings" }
  ];

  const renderHome = () => (
    <ScrollView 
      ref={scrollRef}
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <View className="flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-slate-400 text-base font-medium">Welcome,</Text>
          <Text weight="bold" className="text-3xl text-slate-900">{userProfile?.fullName || 'Admin'}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => showToast("No new notifications", "success")}
          className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-slate-100 shadow-sm"
        >
          <Bell size={22} color="#4C6FFF" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity activeOpacity={0.9} className="mb-10">
        <LinearGradient 
          colors={['#0F172A', '#1E293B']} 
          start={{x: 0, y: 0}} end={{x: 1, y: 1}}
          className="p-8 rounded-[40px] shadow-xl shadow-slate-900/20"
        >
          <View className="flex-row justify-between items-start mb-6">
            <View className="bg-primary px-4 py-1.5 rounded-full">
              <Text weight="bold" className="text-white text-[10px] uppercase tracking-widest">Platform Status</Text>
            </View>
            <Shield size={20} color="white" opacity={0.6} />
          </View>
          <Text weight="bold" className="text-white text-2xl mb-2 leading-8">Everything is running smoothly with {stats.totalBookings} total jobs</Text>
          <View className="flex-row items-center">
            <CheckCircle2 size={14} color="#10B981" />
            <Text className="text-emerald-500 text-sm ml-2">{stats.completedBookings} Completed Jobs</Text>
          </View>
          
          <View className="mt-8 h-12 flex-row items-end gap-1.5">
            {[40, 60, 45, 80, 55, 90, 75, 95].map((h, i) => (
              <View key={i} style={{ height: `${h}%` }} className="flex-1 bg-primary/30 rounded-full" />
            ))}
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View className="flex-row gap-4 mb-10">
        <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
          <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-4">Users</Text>
          <Text weight="bold" className="text-2xl text-slate-900 mb-2">{stats.totalUsers}</Text>
          <View className="flex-row items-center">
            <UserPlus size={12} color="#4C6FFF" />
            <Text className="text-primary text-[10px] font-bold ml-1">{stats.totalProviders} <Text className="text-slate-300 font-normal">Providers</Text></Text>
          </View>
        </View>
        <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
          <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-4">Market</Text>
          <Text weight="bold" className="text-2xl text-slate-900 mb-2">{stats.totalServices}</Text>
          <View className="flex-row items-center">
            <Layers size={12} color="#F59E0B" />
            <Text className="text-amber-500 text-[10px] font-bold ml-1">{stats.totalCategories} <Text className="text-slate-300 font-normal">Categories</Text></Text>
          </View>
        </View>
      </View>

      <View className="mb-20">
        <View className="flex-row justify-between items-center mb-6">
          <Text weight="bold" className="text-xl text-slate-900">Recent Activity</Text>
          <TouchableOpacity onPress={() => setActiveTab('management')}>
            <Text weight="bold" className="text-primary text-sm uppercase tracking-wider">See All</Text>
          </TouchableOpacity>
        </View>
        <View className="gap-4">
          {stats.recentBookings.map((b, i) => (
            <View key={i} className="bg-white p-5 rounded-[32px] border border-slate-50 flex-row items-center gap-4">
              <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center">
                <Package size={22} color="#4C6FFF" />
              </View>
              <View className="flex-1">
                <Text weight="bold" className="text-slate-900 text-sm">{b.serviceName}</Text>
                <Text className="text-slate-400 text-[10px] mt-0.5">{b.date}</Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${b.status === 'completed' ? 'bg-emerald-50' : 'bg-amber-50'}`}>
                <Text weight="bold" className={`text-[10px] uppercase ${b.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{b.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderAnalytics = () => (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text weight="bold" className="text-2xl text-slate-900 mb-8">Analytics</Text>

      <View className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm mb-8">
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text weight="bold" className="text-lg text-slate-900">Most Popular</Text>
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
                  <Text weight="bold" className="text-slate-800 text-[10px] uppercase tracking-wider flex-1 mr-2" numberOfLines={1}>{s.name}</Text>
                  <Text weight="bold" className="text-slate-400 text-[10px]">{s.count}</Text>
                </View>
                <View className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <View style={{ width: `${(s.count / (stats.topServices[0]?.count || 1)) * 100}%`, backgroundColor: s.color }} className="h-full rounded-full" />
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm mb-8">
        <Text weight="bold" className="text-lg text-slate-900 mb-6">User Types</Text>
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

  const renderManagement = () => (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text weight="bold" className="text-2xl text-slate-900 mb-8">Management</Text>
      <View className="gap-5 pb-32">
        {ADMIN_MENU.map((item) => (
          <TouchableOpacity 
            key={item.id}
            activeOpacity={0.7}
            onPress={() => router.push(item.route as any)}
            className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm flex-row items-center gap-6"
          >
            <View className="w-16 h-16 bg-primary/5 rounded-[24px] items-center justify-center">
              <item.icon size={28} color="#4C6FFF" strokeWidth={2} />
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
    </ScrollView>
  );

  const renderProfile = () => (
    <ScrollView 
      className="flex-1 px-6 pt-4" 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 160 }}
    >
      <Text weight="bold" className="text-2xl text-slate-900 mb-8">Account</Text>
      
      <LinearGradient 
        colors={['#4C6FFF', '#3B5BDB']} 
        start={{x: 0, y: 0}} end={{x: 1, y: 1}}
        className="p-8 rounded-[40px] shadow-xl shadow-primary/30 mb-10"
      >
        <View className="flex-row items-center gap-6">
          <View className="relative">
            <View className="w-24 h-24 rounded-[32px] bg-white/20 items-center justify-center overflow-hidden border-4 border-white/20">
              {userProfile?.avatar ? (
                <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
              ) : (
                <Text weight="bold" className="text-3xl text-white">{userProfile?.fullName?.charAt(0) || 'A'}</Text>
              )}
            </View>
            <TouchableOpacity className="absolute -bottom-1 -right-1 w-9 h-9 bg-white rounded-2xl items-center justify-center border-4 border-[#4C6FFF]">
              <Camera size={14} color="#4C6FFF" strokeWidth={3} />
            </TouchableOpacity>
          </View>
          <View className="flex-1">
            <Text weight="bold" className="text-white text-2xl mb-1">{userProfile?.fullName || 'Admin'}</Text>
            <View className="flex-row items-center gap-1.5 px-3 py-1 bg-white/20 self-start rounded-full">
               <Shield size={10} color="white" />
               <Text weight="bold" className="text-white text-[9px] uppercase tracking-widest">Administrator</Text>
            </View>
            <Text className="text-white/60 text-[10px] mt-3 font-medium">Session ID: {user?.uid?.substring(0, 8)}</Text>
          </View>
        </View>
      </LinearGradient>

      <View className="mb-10">
        <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-6 px-1">System Status</Text>
        <View className="flex-row gap-4 mb-4">
          <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm items-center">
            <Activity size={24} color="#10B981" />
            <Text weight="bold" className="text-slate-900 text-xs mt-3">Active</Text>
            <Text className="text-slate-400 text-[9px] mt-1">Platform Status</Text>
          </View>
          <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm items-center">
            <Cpu size={24} color="#4C6FFF" />
            <Text weight="bold" className="text-slate-900 text-xs mt-3">v1.2.4</Text>
            <Text className="text-slate-400 text-[9px] mt-1">App Version</Text>
          </View>
        </View>
      </View>

      <View className="gap-4">
        <TouchableOpacity 
          onPress={editDisclosure.open}
          className="bg-white p-6 rounded-[32px] border border-slate-50 flex-row items-center gap-5 shadow-sm"
        >
          <View className="w-12 h-12 bg-primary/5 rounded-2xl items-center justify-center">
             <User size={20} color="#4C6FFF" />
          </View>
          <View className="flex-1">
            <Text weight="bold" className="text-[17px] text-slate-900">Profile Settings</Text>
            <Text className="text-slate-400 text-[11px]">Update your name and photo</Text>
          </View>
          <ChevronRight size={18} color="#CBD5E1" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={logoutDisclosure.open}
          className="bg-rose-50 p-6 rounded-[32px] border border-rose-100 flex-row items-center gap-5"
        >
          <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center">
             <LogOut size={20} color="#F43F5E" />
          </View>
          <View className="flex-1">
            <Text weight="bold" className="text-rose-500 text-[17px]">Sign Out</Text>
            <Text className="text-rose-300 text-[11px]">Logout from your account</Text>
          </View>
          <ChevronRight size={18} color="#F43F5E" opacity={0.3} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  if (loading) return <ActivityIndicator size="large" color="#4C6FFF" className="flex-1" />;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {activeTab === 'home' && renderHome()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'management' && renderManagement()}
      {activeTab === 'profile' && renderProfile()}

      <View className="absolute bottom-10 left-6 right-6">
        <View className="bg-slate-900 h-20 rounded-full flex-row items-center justify-around px-4 shadow-2xl shadow-slate-900/40 border border-white/5">
          <TouchableOpacity 
            onPress={() => setActiveTab('home')}
            className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'home' ? 'bg-primary' : 'transparent'}`}
          >
            <Home size={22} color={activeTab === 'home' ? "white" : "#64748B"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('analytics')}
            className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'analytics' ? 'bg-primary' : 'transparent'}`}
          >
            <BarChart3 size={22} color={activeTab === 'analytics' ? "white" : "#64748B"} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setActiveTab('management')}
            className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'management' ? 'bg-primary' : 'transparent'}`}
          >
            <LayoutGrid size={22} color={activeTab === 'management' ? "white" : "#64748B"} />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => setActiveTab('profile')}
            className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'profile' ? 'bg-primary' : 'transparent'}`}
          >
            <User size={22} color={activeTab === 'profile' ? "white" : "#64748B"} />
          </TouchableOpacity>
        </View>
      </View>

      <AppModal visible={editDisclosure.isOpen} onClose={editDisclosure.close} title="Edit Profile">
        <View className="mt-4">
          <Input label="Full Name" value={name} onChangeText={setName} />
          <Button title="Save Changes" className="mt-6 rounded-full" onPress={handleUpdateProfile} loading={updating} />
        </View>
      </AppModal>

      <AppModal visible={logoutDisclosure.isOpen} onClose={logoutDisclosure.close} title="Sign Out">
        <View className="mt-4 items-center">
          <Text className="text-slate-500 text-center mb-8">Are you sure you want to sign out?</Text>
          <View className="flex-row gap-4 w-full">
            <Button title="Cancel" variant="outline" className="flex-1 rounded-2xl" onPress={logoutDisclosure.close} />
            <Button title="Sign Out" variant="destructive" className="flex-1 rounded-2xl" onPress={handleLogout} />
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}
