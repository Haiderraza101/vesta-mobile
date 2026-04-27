import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
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
import { Search, SlidersHorizontal, ArrowUpRight, Sparkles, Star, Clock, X, CheckCircle2, Package, Calendar } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH * 0.85;

export default function HomeDashboard() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const filterDisclosure = useDisclosure();
  const searchDisclosure = useDisclosure();
  const notifDisclosure = useDisclosure();
  
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularServices, setPopularServices] = useState<Service[]>([]);
  const [incomingBookings, setIncomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const isProvider = userProfile?.role === 'provider';

  const fetchData = async () => {
    try {
      const [cats, services] = await Promise.all([
        serviceService.getCategories(),
        serviceService.getPopularServices()
      ]);
      setCategories(cats);
      setPopularServices(services);

      if (isProvider && user?.uid) {
        const bookings = await bookingService.getProviderBookings(user.uid);
        setIncomingBookings(bookings);
      }
    } catch (error) {
      showToast("Error loading data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isProvider, user?.uid]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleUpdateStatus = async (bookingId: string, status: any) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      showToast(`Booking ${status} successfully`, "success");
      fetchData();
    } catch (error) {
      showToast("Failed to update booking", "error");
    }
  };

  const filteredServices = activeCategory === "All" 
    ? popularServices 
    : popularServices.filter(s => s.category === activeCategory);

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
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
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
              <View className="px-6 mt-6 mb-6">
                <Text weight="bold" className="text-[28px] leading-[38px] text-slate-900">
                  Which services{"\n"}would you like to use
                </Text>
              </View>

              <View className="px-6 flex-row items-center gap-3 mb-8">
                <TouchableOpacity 
                  activeOpacity={0.9}
                  onPress={searchDisclosure.open}
                  className="flex-1 flex-row items-center bg-white rounded-2xl px-5 h-[56px] shadow-sm border border-slate-100"
                >
                  <Search size={20} color="#94A3B8" />
                  <Text className="text-slate-400 ml-3 flex-1 text-[15px]">Search Service..</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  activeOpacity={0.8}
                  onPress={filterDisclosure.open}
                  className="w-[56px] h-[56px] items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100"
                >
                  <SlidersHorizontal size={20} color="#1E293B" />
                </TouchableOpacity>
              </View>

              <View className="px-6 mb-10">
                <SectionHeader title="Service Category" onSeeAll={() => router.push('/categories')} />
                <View className="flex-row justify-between flex-wrap gap-y-4">
                  {categories.map((cat) => (
                    <TouchableOpacity 
                      key={cat.id} 
                      className="items-center"
                      style={{ width: '22%' }}
                      onPress={() => setActiveCategory(cat.name)}
                    >
                      <View className={`w-full aspect-square rounded-2xl overflow-hidden mb-2.5 shadow-sm border ${activeCategory === cat.name ? 'border-primary border-2' : 'border-slate-50 bg-white'}`}>
                        <Image source={{ uri: cat.image }} className="w-full h-full" resizeMode="cover" />
                      </View>
                      <Text weight="bold" className={`text-[12px] text-center ${activeCategory === cat.name ? 'text-primary' : 'text-slate-600'}`}>{cat.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="px-6 pb-20">
                <SectionHeader title="Popular Service" onSeeAll={() => router.push('/bookings')} />
                <View className="gap-y-6">
                  {filteredServices.map((service) => (
                    <Card 
                      key={service.id} 
                      className="overflow-hidden"
                      style={{ width: '100%' }}
                      onPress={() => setSelectedService(service)}
                    >
                      <View className="aspect-[16/9] w-full relative">
                        <Image source={{ uri: service.image }} className="w-full h-full" resizeMode="cover" />
                        <View className="absolute bottom-3 left-3 bg-white/95 px-3 py-1.5 rounded-full flex-row items-center gap-1 shadow-sm">
                          <Text weight="bold" className="text-primary text-[13px]">{service.price}</Text>
                        </View>
                        <View className="absolute top-3 right-3 bg-white/90 p-2 rounded-xl shadow-sm">
                          <View className="flex-row items-center gap-1">
                            <Star size={12} color="#F59E0B" fill="#F59E0B" />
                            <Text weight="bold" className="text-slate-800 text-[11px]">{service.rating}</Text>
                          </View>
                        </View>
                      </View>
                      <View className="p-4">
                        <Text weight="bold" className="text-lg text-slate-900" numberOfLines={1}>{service.title}</Text>
                        <Text className="text-slate-500 text-sm mt-1" numberOfLines={2}>{service.description}</Text>
                      </View>
                    </Card>
                  ))}
                </View>
              </View>
            </>
          ) : (
            // Provider View
            <View className="px-6 py-8">
              <View className="flex-row justify-between items-center mb-8">
                <View>
                  <Text weight="bold" className="text-3xl text-slate-900">Incoming Jobs</Text>
                  <Text className="text-slate-500 text-lg mt-1">Manage your service requests</Text>
                </View>
                <View className="bg-primary/10 p-4 rounded-3xl">
                  <Package size={24} color="#4C6FFF" />
                </View>
              </View>

              {incomingBookings.length === 0 ? (
                <View className="bg-white p-10 rounded-[40px] items-center border border-slate-50 shadow-sm mt-10">
                  <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-6">
                    <Calendar size={32} color="#CBD5E1" />
                  </View>
                  <Text weight="bold" className="text-xl text-slate-900 mb-2">No jobs yet</Text>
                  <Text className="text-slate-500 text-center text-base leading-6">When customers book your services, they will appear here.</Text>
                </View>
              ) : (
                <View className="gap-y-6">
                  {incomingBookings.map((booking) => (
                    <Card key={booking.id} className="p-6 bg-white border-slate-100">
                      <View className="flex-row gap-4 mb-5">
                        <Image source={{ uri: booking.serviceImage }} className="w-20 h-20 rounded-2xl" />
                        <View className="flex-1 justify-center">
                          <Text weight="bold" className="text-lg text-slate-900">{booking.serviceName}</Text>
                          <Text className="text-slate-500 mt-1">{booking.date} at {booking.time}</Text>
                          <View className="flex-row items-center gap-1.5 mt-2">
                            <View className={`w-2 h-2 rounded-full ${booking.status === 'pending' ? 'bg-amber-400' : 'bg-green-500'}`} />
                            <Text weight="bold" className={`text-xs uppercase tracking-widest ${booking.status === 'pending' ? 'text-amber-500' : 'text-green-500'}`}>{booking.status}</Text>
                          </View>
                        </View>
                      </View>
                      
                      {booking.status === 'pending' && (
                        <View className="flex-row gap-3 pt-4 border-t border-slate-50">
                          <Button 
                            title="Decline" 
                            variant="outline" 
                            className="flex-1 h-12 rounded-2xl" 
                            onPress={() => handleUpdateStatus(booking.id!, 'cancelled')} 
                          />
                          <Button 
                            title="Accept" 
                            className="flex-1 h-12 rounded-2xl" 
                            onPress={() => handleUpdateStatus(booking.id!, 'confirmed')} 
                          />
                        </View>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <Button 
                          title="Mark Completed" 
                          className="w-full h-12 rounded-2xl" 
                          onPress={() => handleUpdateStatus(booking.id!, 'completed')} 
                        />
                      )}
                    </Card>
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Modal for Service Details */}
        <AppModal visible={!!selectedService} onClose={() => setSelectedService(null)} title="Service Details">
          {selectedService && (
            <View className="mt-4">
              <Image source={{ uri: selectedService.image }} className="w-full h-48 rounded-[32px] mb-6" resizeMode="cover" />
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 pr-4">
                  <Text weight="bold" className="text-2xl text-slate-900 leading-8">{selectedService.title}</Text>
                  <View className="flex-row items-center gap-4 mt-2">
                    <View className="flex-row items-center gap-1">
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <Text weight="bold" className="text-slate-700">{selectedService.rating}</Text>
                    </View>
                    <Text className="text-slate-300">|</Text>
                    <Text className="text-slate-500">{selectedService.reviews} Reviews</Text>
                  </View>
                </View>
                <Text weight="bold" className="text-2xl text-primary">{selectedService.price}</Text>
              </View>
              <Text className="text-slate-500 leading-6 text-base mb-10">{selectedService.description}</Text>
              <Button title="Book Now" size="lg" className="rounded-full shadow-lg shadow-primary/30" onPress={() => {
                setSelectedService(null);
                router.push({
                  pathname: "/book-service",
                  params: { 
                    serviceId: selectedService.id,
                    serviceName: selectedService.title,
                    servicePrice: selectedService.price,
                    serviceImage: selectedService.image,
                    providerId: selectedService.providerId
                  }
                });
              }} />
            </View>
          )}
        </AppModal>

        {/* Other Modals (Search, Notifications, Filter) stay mostly the same but could be connected later */}
      </LinearGradient>
    </SafeAreaView>
  );
}
