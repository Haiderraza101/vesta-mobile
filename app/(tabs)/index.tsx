import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Card } from "../../components/ui/Card";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { serviceService, Category, Service } from "../../services/serviceService";
import { bookingService, Booking } from "../../services/bookingService";
import { notificationService, Notification } from "../../services/notificationService";
import { providerService, ProviderStats } from "../../services/providerService";
import { Search, SlidersHorizontal, ArrowUpRight, Sparkles, Star, Clock, X, CheckCircle2, Package, Calendar, Bell, Ticket, TrendingUp, Users, DollarSign } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useMarketplace } from "../../hooks/useMarketplace";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HomeDashboard() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const notifDisclosure = useDisclosure();
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const { categories, services: popularServices, loading } = useMarketplace();
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [providerStats, setProviderStats] = useState<ProviderStats>({
    totalEarnings: 0,
    totalBookings: 0,
    averageRating: 0,
    activeBookings: 0
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const isProvider = userProfile?.role === 'provider';

  useEffect(() => {
    // Real-time notifications
    let unsubNotifs: (() => void) | undefined;
    let unsubStats: (() => void) | undefined;

    if (user?.uid) {
      unsubNotifs = notificationService.subscribeToNotifications(user.uid, (data) => {
        setNotifications(data);
      });

      if (isProvider) {
        unsubStats = providerService.subscribeToProviderStats(user.uid, (data) => {
          setProviderStats(data);
        });
        
        bookingService.getProviderBookings(user.uid).then(setIncomingBookings);
      }
    }
    return () => {
      unsubNotifs && unsubNotifs();
      unsubStats && unsubStats();
    };
  }, [user?.uid]);

  useEffect(() => {
    if (params.category) {
      setActiveCategory(params.category);
    }
  }, [params.category]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Real-time listeners will handle the update, but we can force a re-fetch if needed
    setRefreshing(false);
  };

  const handleUpdateStatus = async (bookingId: string, status: any) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      showToast(`Booking ${status} successfully`, "success");
      
      // Update local state for immediate feedback if not real-time
      setIncomingBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    } catch (error) {
      showToast("Failed to update booking", "error");
    }
  };

  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');

  const filteredServices = popularServices
    .filter((s: Service) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a: Service, b: Service) => {
      if (sortOrder === 'none') return 0;
      const priceA = parseFloat(a.price.replace('$', ''));
      const priceB = parseFloat(b.price.replace('$', ''));
      return sortOrder === 'asc' ? priceA - priceB : priceB - priceA;
    });

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#FFFFFF']} className="flex-1">
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />}
        >
          <ScreenHeader 
            title={`Hello, ${userProfile?.fullName || 'User'}`} 
            subtitle={isProvider ? "Service Provider" : "Customer"} 
            onNotificationPress={notifDisclosure.open} 
          />

          {!isProvider ? (
            // Customer View
            <>
              <View className="px-6 mt-8 mb-6">
                <Text weight="bold" className="text-[32px] leading-[42px] text-slate-900">
                  Find the best{"\n"}services for you
                </Text>
              </View>

              <View className="px-6 flex-row items-center mb-10">
                <View className="flex-1 flex-row items-center bg-white rounded-3xl px-6 h-[64px] shadow-sm border border-slate-50">
                  <Search size={22} color="#94A3B8" />
                  <Input 
                    placeholder="Search for any service..." 
                    className="flex-1 mb-0 border-0 h-[64px] ml-2"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>
                <TouchableOpacity 
                  onPress={() => setSortOrder(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
                  className={`ml-4 w-[64px] h-[64px] rounded-3xl items-center justify-center border border-slate-50 shadow-sm ${sortOrder !== 'none' ? 'bg-primary' : 'bg-white'}`}
                >
                  <SlidersHorizontal size={22} color={sortOrder !== 'none' ? 'white' : '#4C6FFF'} />
                </TouchableOpacity>
              </View>

              <View className="px-6 mb-12">
                <SectionHeader title="Categories" onSeeAll={() => router.push('/categories')} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
                  <View className="flex-row gap-5">
                    <TouchableOpacity 
                      onPress={() => setActiveCategory("All")}
                      className={`px-8 py-4 rounded-2xl border ${activeCategory === "All" ? 'bg-primary border-primary shadow-md' : 'bg-white border-slate-50 shadow-sm'}`}
                    >
                      <Text weight="bold" className={activeCategory === "All" ? 'text-white' : 'text-slate-500'}>All</Text>
                    </TouchableOpacity>
                    {categories.map((cat: Category) => (
                      <TouchableOpacity 
                        key={cat.id} 
                        onPress={() => setActiveCategory(cat.name)}
                        className={`px-8 py-4 rounded-2xl border ${activeCategory === cat.name ? 'bg-primary border-primary shadow-md' : 'bg-white border-slate-50 shadow-sm'}`}
                      >
                        <Text weight="bold" className={activeCategory === cat.name ? 'text-white' : 'text-slate-500'}>{cat.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              <View className="px-6 pb-20">
                <SectionHeader title="Popular Services" />
                <View className="gap-y-8">
                  {filteredServices.length === 0 ? (
                    <View className="py-20 items-center bg-white rounded-[40px] border border-slate-50 shadow-sm">
                       <Package size={48} color="#CBD5E1" strokeWidth={1.5} />
                       <Text className="text-slate-400 mt-4 text-base font-medium">No services found in this category</Text>
                    </View>
                  ) : (
                    filteredServices.map((service: Service) => (
                      <Card 
                        key={service.id} 
                        className="overflow-hidden bg-white border-slate-50 shadow-sm"
                        style={{ width: '100%', borderRadius: 32 }}
                        onPress={() => router.push(`/service/${service.id}`)}
                      >
                        <View className="aspect-[16/10] w-full relative">
                          <Image source={{ uri: service.image }} className="w-full h-full" resizeMode="cover" />
                          <View className="absolute bottom-4 left-4 bg-white/95 px-4 py-2 rounded-2xl flex-row items-center shadow-lg">
                            <Text weight="bold" className="text-primary text-base">${service.price}</Text>
                          </View>
                          <View className="absolute top-4 right-4 bg-white/95 px-3 py-1.5 rounded-xl shadow-lg flex-row items-center gap-1">
                            <Star size={14} color="#F59E0B" fill="#F59E0B" />
                            <Text weight="bold" className="text-slate-800 text-xs">{service.rating}</Text>
                          </View>
                        </View>
                        <View className="p-6">
                          <View className="flex-row justify-between items-center mb-2">
                             <View className="bg-primary/5 px-3 py-1 rounded-full">
                               <Text weight="bold" className="text-primary text-[10px] uppercase tracking-wider">{service.category}</Text>
                             </View>
                          </View>
                          <Text weight="bold" className="text-xl text-slate-900 mb-2" numberOfLines={1}>{service.title}</Text>
                          <Text className="text-slate-500 text-sm leading-6" numberOfLines={2}>{service.description}</Text>
                        </View>
                      </Card>
                    ))
                  )}
                </View>
              </View>
            </>
          ) : (
            // Provider View
            <View className="px-6 py-8">
              <View className="bg-slate-900 p-8 rounded-[48px] shadow-2xl shadow-slate-900/40 mb-10 border border-white/5">
                <Text weight="bold" className="text-white/60 text-xs uppercase tracking-[4px] mb-6">Business Overview</Text>
                <View className="flex-row justify-between">
                  <View>
                    <Text className="text-white/40 text-xs mb-1">Total Earnings</Text>
                    <Text weight="bold" className="text-4xl text-white">${providerStats.totalEarnings.toLocaleString()}</Text>
                  </View>
                  <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/30">
                    <TrendingUp size={24} color="white" />
                  </View>
                </View>

                <View className="mt-8">
                   <View className="flex-row justify-between mb-2">
                      <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Monthly Goal Progress</Text>
                      <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">84%</Text>
                   </View>
                   <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <View className="h-full bg-primary w-[84%] rounded-full shadow-sm shadow-primary/50" />
                   </View>
                </View>

                <View className="mt-6 flex-row items-center gap-2">
                   <View className="bg-emerald-500/20 px-2 py-1 rounded-lg">
                      <Text weight="bold" className="text-emerald-400 text-[10px]">+12.5%</Text>
                   </View>
                   <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">vs Last Month</Text>
                </View>
                
                <View className="h-[1px] bg-white/10 w-full my-8" />
                
                <View className="flex-row justify-between">
                  <View className="items-center">
                    <Text weight="bold" className="text-white text-xl">{providerStats.totalBookings}</Text>
                    <Text className="text-white/40 text-[10px] uppercase mt-1">Bookings</Text>
                  </View>
                  <View className="w-[1px] h-8 bg-white/10" />
                  <View className="items-center">
                    <Text weight="bold" className="text-white text-xl">{providerStats.activeBookings}</Text>
                    <Text className="text-white/40 text-[10px] uppercase mt-1">Active</Text>
                  </View>
                  <View className="w-[1px] h-8 bg-white/10" />
                  <View className="items-center">
                    <Text weight="bold" className="text-white text-xl">{providerStats.averageRating}</Text>
                    <Text className="text-white/40 text-[10px] uppercase mt-1">Rating</Text>
                  </View>
                </View>

                <View className="mt-8">
                   <View className="flex-row justify-between mb-2">
                      <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Monthly Goal Progress</Text>
                      <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">84%</Text>
                   </View>
                   <View className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <View className="h-full bg-primary w-[84%] rounded-full shadow-sm shadow-primary/50" />
                   </View>
                </View>

                <View className="mt-6 flex-row items-center gap-2">
                   <View className="bg-emerald-500/20 px-2 py-1 rounded-lg">
                      <Text weight="bold" className="text-emerald-400 text-[10px]">+12.5%</Text>
                   </View>
                   <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">vs Last Month</Text>
                </View>
              </View>

              <View className="mb-10 flex-row gap-4">
                 <TouchableOpacity 
                   onPress={() => router.push('/provider/services')}
                   className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm items-center justify-center gap-3"
                 >
                    <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center">
                       <Package size={24} color="#4C6FFF" />
                    </View>
                    <Text weight="bold" className="text-slate-900 text-sm">Manage Services</Text>
                 </TouchableOpacity>
                 <TouchableOpacity 
                   onPress={() => router.push('/(tabs)/bookings')}
                   className="flex-1 bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm items-center justify-center gap-3"
                 >
                    <View className="w-12 h-12 bg-emerald-50 rounded-2xl items-center justify-center">
                       <Calendar size={24} color="#10B981" />
                    </View>
                    <Text weight="bold" className="text-slate-900 text-sm">View Schedule</Text>
                 </TouchableOpacity>
              </View>

              <SectionHeader title="Active Bookings" onSeeAll={() => router.push('/(tabs)/bookings')} />
              <View className="gap-y-6 mt-4">
                 {incomingBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').length === 0 ? (
                   <View className="bg-white p-12 rounded-[40px] items-center border border-slate-50 shadow-sm">
                      <Clock size={40} color="#CBD5E1" strokeWidth={1.5} />
                      <Text className="text-slate-400 mt-4 font-medium">No active bookings</Text>
                   </View>
                 ) : (
                   incomingBookings.filter(b => b.status === 'pending' || b.status === 'confirmed').slice(0, 3).map((booking) => (
                     <Card key={booking.id} className="p-5 bg-white border-slate-50 shadow-sm" style={{ borderRadius: 32 }}>
                        <View className="flex-row items-center gap-5 mb-5">
                           <Image source={{ uri: booking.serviceImage }} className="w-16 h-16 rounded-2xl" />
                           <View className="flex-1">
                              <Text weight="bold" className="text-slate-900 text-base" numberOfLines={1}>{booking.serviceName}</Text>
                              <Text className="text-slate-500 text-xs mt-1">{booking.date} • {booking.time}</Text>
                           </View>
                           <View className={`px-3 py-1.5 rounded-xl ${booking.status === 'confirmed' ? 'bg-blue-50' : 'bg-amber-50'}`}>
                              <Text weight="bold" className={`text-[10px] uppercase tracking-wider ${booking.status === 'confirmed' ? 'text-blue-500' : 'text-amber-500'}`}>{booking.status}</Text>
                           </View>
                        </View>
                        
                        <View className="flex-row gap-2 pt-4 border-t border-slate-50">
                           {booking.status === 'pending' && (
                             <TouchableOpacity 
                               onPress={() => handleUpdateStatus(booking.id!, 'confirmed')}
                               className="flex-1 bg-primary/10 h-11 rounded-2xl items-center justify-center border border-primary/10"
                             >
                                <Text weight="bold" className="text-primary text-[10px] uppercase tracking-widest">Confirm</Text>
                             </TouchableOpacity>
                           )}
                           {booking.status === 'confirmed' && (
                             <TouchableOpacity 
                               onPress={() => handleUpdateStatus(booking.id!, 'completed')}
                               className="flex-1 bg-emerald-500 h-11 rounded-2xl items-center justify-center shadow-lg shadow-emerald-500/20"
                             >
                                <Text weight="bold" className="text-white text-[10px] uppercase tracking-widest">Complete</Text>
                             </TouchableOpacity>
                           )}
                           <TouchableOpacity 
                              onPress={() => handleUpdateStatus(booking.id!, 'cancelled')}
                              className="flex-1 bg-slate-50 h-11 rounded-2xl items-center justify-center border border-slate-100"
                           >
                              <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-widest">Cancel</Text>
                           </TouchableOpacity>
                        </View>
                     </Card>
                   ))
                 )}
              </View>
            </View>
          )}
        </ScrollView>

        <AppModal visible={!!selectedService} onClose={() => setSelectedService(null)} title="Service Details">
          {selectedService && (
            <View className="mt-4">
              <View className="relative">
                <Image source={{ uri: selectedService.image }} className="w-full h-56 rounded-[40px] mb-8" resizeMode="cover" />
                <View className="absolute top-4 right-4 bg-white/95 px-4 py-2 rounded-2xl shadow-xl flex-row items-center gap-1.5">
                   <Star size={18} color="#F59E0B" fill="#F59E0B" />
                   <Text weight="bold" className="text-slate-900 text-lg">{selectedService.rating}</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-start mb-6">
                <View className="flex-1 pr-6">
                  <Text weight="bold" className="text-[28px] text-slate-900 leading-9 mb-1">{selectedService.title}</Text>
                  <View className="flex-row items-center gap-2">
                    <View className="w-2 h-2 rounded-full bg-emerald-500" />
                    <Text className="text-slate-500 font-medium text-sm">{selectedService.category} Service</Text>
                  </View>
                </View>
                <View className="items-end">
                   <Text weight="bold" className="text-3xl text-primary">${selectedService.price}</Text>
                   <Text className="text-slate-400 text-xs mt-1">per session</Text>
                </View>
              </View>

              <View className="bg-slate-50 p-6 rounded-[32px] mb-10 border border-slate-100">
                <Text className="text-slate-600 leading-7 text-base">{selectedService.description}</Text>
              </View>

              <Button title="Book Service Now" size="lg" className="rounded-full h-16 shadow-xl shadow-primary/30" onPress={() => {
                setSelectedService(null);
                router.push({
                  pathname: "/book-service",
                  params: { 
                    serviceId: selectedService.id,
                    serviceName: selectedService.title,
                    servicePrice: selectedService.price.toString().startsWith('$') ? selectedService.price : `$${selectedService.price}`,
                    serviceImage: selectedService.image,
                    providerId: selectedService.providerId
                  }
                });
              }} />
            </View>
          )}
        </AppModal>

        {/* Notification Modal simplified for brevity */}
      </LinearGradient>
    </SafeAreaView>
  );
}
