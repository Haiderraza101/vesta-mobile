import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { Service } from '@/services/serviceService';
import { useMarketplace } from '@/hooks/useMarketplace';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ServiceCard } from './ServiceCard';
import { AnalyticsGraph } from '@/components/ui/AnalyticsGraph';
import { useConfig } from '@/context/ConfigContext';
import { bookingService } from '@/services/bookingService';
import { useEffect } from 'react';
import { ProfileSetupCard } from '@/components/ui/ProfileSetupCard';

export function HomeTab() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { categories, services, loading } = useMarketplace();
  const { settings } = useConfig();
  
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = bookingService.subscribeToBookings(user.uid, 'customer', (data) => {
      setBookings(data);
    });
    return () => unsubscribe && unsubscribe();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getWeeklySpendings = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        label: days[d.getDay()],
        dateStr: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        value: 0
      };
    });

    bookings.filter(b => b.status === 'completed').forEach(booking => {
      const dayIndex = last7Days.findIndex(d => d.dateStr === booking.date);
      if (dayIndex !== -1) {
        last7Days[dayIndex].value += Number(booking.price) || 0;
      }
    });

    return last7Days;
  };

  const weeklySpendings = getWeeklySpendings();

  const filteredServices = services.filter((s: Service) => {
    const matchesCategory = activeCategory === "All" || s.category === activeCategory;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading && !refreshing) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <ScreenHeader 
          title={`Hello, ${userProfile?.fullName?.split(' ')[0] || 'User'}`} 
          subtitle={userProfile?.location || 'N/A'}
        />
        
        <View className="px-6 pb-4">
          <View className="flex-row items-center gap-3">
            <View className="flex-1 flex-row items-center bg-slate-50 h-11 rounded-xl px-4 border border-slate-100">
              <Search size={18} color="#94A3B8" />
              <TextInput 
                placeholder="Search services..." 
                className="flex-1 ml-2 text-slate-900 text-sm font-medium h-full"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 mt-6">
          <ProfileSetupCard userProfile={userProfile} role="customer" />
        </View>

        <View className="px-6 mt-6">
          <AnalyticsGraph 
            title="My Spendings" 
            data={weeklySpendings}
          />
        </View>

        <View className="px-6 py-6">
          <LinearGradient
            colors={['#4C6FFF', '#3b5edb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 relative overflow-hidden"
          >
            <View className="z-10">
              <Text weight="bold" className="text-white text-xl mb-1">Get 25% Off</Text>
              <Text className="text-white/80 text-[13px] mb-4">On your first home cleaning service</Text>
              <TouchableOpacity className="bg-white self-start px-4 py-2 rounded-lg">
                <Text weight="bold" className="text-primary text-xs">Book Now</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-5">
            <Text weight="bold" className="text-xl text-slate-900">Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/categories')}>
              <Text weight="bold" className="text-primary text-sm">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2 px-2">
            {categories.map((cat: any) => (
              <TouchableOpacity 
                key={cat.id} 
                onPress={() => setActiveCategory(cat.name)}
                className={`px-6 py-3 rounded-2xl mx-1 border ${
                  activeCategory === cat.name ? 'bg-primary border-primary' : 'bg-white border-slate-50'
                }`}
              >
                <Text weight="bold" className={`text-sm ${activeCategory === cat.name ? 'text-white' : 'text-slate-500'}`}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-6">
          <Text weight="bold" className="text-xl text-slate-900 mb-5">Top Services</Text>
          {filteredServices.map((service: Service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onPress={() => router.push({
                pathname: "/book-service",
                params: { 
                  serviceId: service.id, 
                  serviceName: service.title, 
                  servicePrice: service.price,
                  serviceImage: service.image,
                  providerId: service.providerId
                }
              })}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
