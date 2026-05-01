import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AppModal } from "../../components/ui/AppModal";
import { ImageSourceModal } from "../../components/ui/ImageSourceModal";
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
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
  CreditCard,
  Mail,
  UserCheck
} from "lucide-react-native";
import { serviceService } from "../../services/serviceService";
import { bookingService } from "../../services/bookingService";
import { userService } from "../../services/userService";
import { storageService } from "../../services/storageService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useDisclosure } from "../../hooks/useDisclosure";
import { db } from "../../lib/firebase";
import { collection, onSnapshot, getDocs, query, orderBy, limit } from "firebase/firestore";

type TabType = 'home' | 'analytics' | 'management' | 'profile';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const logoutDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const imageSourceDisclosure = useDisclosure();
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [name, setName] = useState(userProfile?.fullName || "");
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  // Manual Data Fetch for Refresh/Focus
  const refreshStats = async () => {
    try {
      const [usersSnap, catsSnap, servsSnap, booksSnap] = await Promise.all([
        getDocs(collection(db, "users")),
        getDocs(collection(db, "categories")),
        getDocs(collection(db, "services")),
        getDocs(collection(db, "bookings"))
      ]);

      const allUsers = usersSnap.docs.map(doc => doc.data());
      const allBookings = booksSnap.docs.map(doc => doc.data());

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
        totalServices: servsSnap.size,
        totalCategories: catsSnap.size,
        recentBookings: allBookings.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3),
        topServices
      });
    } catch (error) {
      console.error("Refresh error:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
    showToast("Data updated", "success");
  };

  useFocusEffect(
    useCallback(() => {
      refreshStats();
    }, [])
  );

  useEffect(() => {
    let usersLoaded = false;
    let categoriesLoaded = false;
    let servicesLoaded = false;
    let bookingsLoaded = false;

    const checkLoading = () => {
      if (usersLoaded && categoriesLoaded && servicesLoaded && bookingsLoaded) {
        setLoading(false);
      }
    };

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      const allUsers = snapshot.docs.map(doc => doc.data());
      setStats(prev => ({
        ...prev,
        totalUsers: allUsers.length,
        totalProviders: allUsers.filter(u => u.role === 'provider').length,
        totalCustomers: allUsers.filter(u => u.role === 'customer').length,
        totalAdmins: allUsers.filter(u => u.role === 'admin').length,
      }));
      usersLoaded = true;
      checkLoading();
    });

    const unsubCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      setStats(prev => ({ ...prev, totalCategories: snapshot.size }));
      categoriesLoaded = true;
      checkLoading();
    });

    const unsubServices = onSnapshot(collection(db, "services"), (snapshot) => {
      setStats(prev => ({ ...prev, totalServices: snapshot.size }));
      servicesLoaded = true;
      checkLoading();
    });

    const unsubBookings = onSnapshot(collection(db, "bookings"), (snapshot) => {
      const allBookings = snapshot.docs.map(doc => doc.data());
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

      setStats(prev => ({
        ...prev,
        totalBookings: allBookings.length,
        pendingBookings: allBookings.filter(b => b.status === 'pending').length,
        completedBookings: allBookings.filter(b => b.status === 'completed').length,
        cancelledBookings: allBookings.filter(b => b.status === 'cancelled').length,
        recentBookings: allBookings.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3),
        topServices
      }));
      bookingsLoaded = true;
      checkLoading();
    });

    return () => {
      unsubUsers();
      unsubCategories();
      unsubServices();
      unsubBookings();
    };
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

  const handleImageSelect = async (useCamera: boolean) => {
    try {
      const uri = await storageService.pickImage(useCamera);
      if (uri) {
        setUploadingImage(true);
        const uploadUrl = await storageService.uploadImage(uri, `avatars/${user?.uid}`);
        await userService.updateUserProfile(user?.uid || '', { avatar: uploadUrl });
        showToast("Identity updated", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Update failed", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      logoutDisclosure.close();
      router.replace("/(auth)/login");
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
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />
      }
    >
      <View className="flex-row justify-between items-center mb-8">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity onPress={() => setActiveTab('profile')}>
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
        <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
          <Text className="text-slate-400 text-[10px] font-bold mb-4">Users</Text>
          <Text weight="bold" className="text-2xl text-slate-900 mb-2">{stats.totalUsers}</Text>
          <View className="flex-row items-center">
            <UserPlus size={12} color="#4C6FFF" />
            <Text className="text-primary text-[10px] font-bold ml-1">{stats.totalProviders} <Text className="text-slate-300 font-normal">Providers</Text></Text>
          </View>
        </View>
        <View className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm">
          <Text className="text-slate-400 text-[10px] font-bold mb-4">Market</Text>
          <Text weight="bold" className="text-2xl text-slate-900 mb-2">{stats.totalServices}</Text>
          <View className="flex-row items-center">
            <Layers size={12} color="#F59E0B" />
            <Text className="text-amber-500 text-[10px] font-bold ml-1">{stats.totalCategories} <Text className="text-slate-300 font-normal">Categories</Text></Text>
          </View>
        </View>
      </View>

      <View className="mb-20">
        <View className="flex-row justify-between items-center mb-6">
          <Text weight="bold" className="text-xl text-slate-900">Recent activity</Text>
          <TouchableOpacity onPress={() => setActiveTab('management')}>
            <Text weight="bold" className="text-primary text-sm tracking-wider">See all</Text>
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
                <Text weight="bold" className={`text-[10px] ${b.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>{b.status}</Text>
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
          onPress={() => setActiveTab('management')}
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
              onPress={imageSourceDisclosure.open}
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
            onPress={editDisclosure.open}
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
            onPress={logoutDisclosure.open}
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

  if (loading) return <ActivityIndicator size="large" color="#4C6FFF" className="flex-1" />;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {activeTab === 'home' && renderHome()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'management' && renderManagement()}
      {activeTab === 'profile' && renderProfile()}

      <View className="absolute bottom-14 left-6 right-6">
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

      <ImageSourceModal 
        visible={imageSourceDisclosure.isOpen}
        onClose={imageSourceDisclosure.close}
        onSelect={handleImageSelect}
      />

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
