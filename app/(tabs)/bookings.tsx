import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Card } from "../../components/ui/Card";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { bookingService, Booking } from "../../services/bookingService";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react-native";

export default function BookingsScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const detailDisclosure = useDisclosure();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = () => {
    if (!user?.uid || !userProfile?.role) return;
    
    return bookingService.subscribeToBookings(
      user.uid, 
      userProfile.role, 
      (data) => {
        setBookings(data);
        setLoading(false);
        setRefreshing(false);
      }
    );
  };

  useEffect(() => {
    const unsubscribe = fetchBookings();
    return () => unsubscribe && unsubscribe();
  }, [user?.uid, userProfile?.role]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    detailDisclosure.open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-500';
      case 'confirmed': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'cancelled': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50';
      case 'confirmed': return 'bg-blue-50';
      case 'completed': return 'bg-green-50';
      case 'cancelled': return 'bg-red-50';
      default: return 'bg-slate-50';
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top']}>
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="My Bookings" subtitle={userProfile?.role === 'provider' ? "Manage your jobs" : "Track your services"} />
        
        <ScrollView 
          className="flex-1 px-6 pt-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />}
        >
          <View className="pb-40">
            {bookings.length === 0 ? (
              <View className="mt-20 items-center justify-center bg-white p-12 rounded-[40px] border border-slate-50 shadow-sm">
                <View className="w-24 h-24 bg-slate-50 rounded-full items-center justify-center mb-8">
                  <Calendar size={40} color="#CBD5E1" strokeWidth={1.5} />
                </View>
                <Text weight="bold" className="text-2xl text-slate-900 mb-2">No bookings yet</Text>
                <Text className="text-slate-500 text-center text-base leading-7 mb-10 px-4">
                  Explore our wide range of professional services and make your first booking today.
                </Text>
                <Button 
                  title="Browse Services" 
                  className="w-full rounded-full h-16 shadow-lg shadow-primary/20"
                  onPress={() => router.push('/(tabs)')}
                />
              </View>
            ) : (
              bookings.map((booking) => (
                <Card 
                  key={booking.id} 
                  className="mb-6 overflow-hidden border-slate-100"
                  onPress={() => handleBookingPress(booking)}
                >
                  <View className="flex-row p-5">
                    <Image source={{ uri: booking.serviceImage }} className="w-20 h-20 rounded-2xl" resizeMode="cover" />
                    <View className="flex-1 ml-5">
                      <View className="flex-row justify-between items-start mb-2">
                        <View className={`${getStatusBg(booking.status)} px-3 py-1 rounded-full`}>
                          <Text weight="bold" className={`${getStatusColor(booking.status)} text-[10px] uppercase tracking-wider`}>{booking.status}</Text>
                        </View>
                        <Text weight="bold" className="text-primary text-base">{booking.price}</Text>
                      </View>
                      <Text weight="bold" className="text-lg text-slate-900 mb-1" numberOfLines={1}>{booking.serviceName}</Text>
                      <View className="flex-row items-center gap-4 mt-2">
                        <View className="flex-row items-center gap-1.5">
                          <Calendar size={14} color="#94A3B8" />
                          <Text className="text-slate-500 text-xs">{booking.date}</Text>
                        </View>
                        <View className="flex-row items-center gap-1.5">
                          <Clock size={14} color="#94A3B8" />
                          <Text className="text-slate-500 text-xs">{booking.time}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </Card>
              ))
            )}
          </View>
        </ScrollView>

        <AppModal visible={detailDisclosure.isOpen} onClose={detailDisclosure.close} title="Booking Details">
          {selectedBooking && (
            <View className="mt-4">
              <View className="bg-slate-50 p-7 rounded-[40px] mb-8 border border-slate-100">
                <View className="flex-row items-center gap-4 mb-8">
                  <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm">
                    <CheckCircle2 size={24} color="#10B981" />
                  </View>
                  <View>
                    <Text weight="bold" className="text-xl text-slate-900">Service {selectedBooking.status}</Text>
                    <Text className="text-slate-400 text-xs uppercase tracking-widest font-bold mt-1">ID: #{selectedBooking.id?.slice(-6).toUpperCase()}</Text>
                  </View>
                </View>
                
                <View className="gap-5">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-slate-500 text-base">Service</Text>
                    <Text weight="bold" className="text-slate-800 text-base">{selectedBooking.serviceName}</Text>
                  </View>
                  <View className="flex-row justify-between items-start">
                    <Text className="text-slate-500 text-base">Address</Text>
                    <Text weight="bold" className="text-slate-800 text-base text-right flex-1 ml-10" numberOfLines={2}>{selectedBooking.address}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-slate-500 text-base">Schedule</Text>
                    <Text weight="bold" className="text-slate-800 text-base">{selectedBooking.date} • {selectedBooking.time}</Text>
                  </View>
                  <View className="h-[1px] bg-slate-200/50 my-2" />
                  <View className="flex-row justify-between items-center">
                    <Text weight="bold" className="text-slate-500 text-lg">Amount Paid</Text>
                    <Text weight="bold" className="text-primary text-2xl">{selectedBooking.price}</Text>
                  </View>
                </View>
              </View>
              
              <View className="flex-row gap-4">
                <Button 
                  title="Message" 
                  variant="outline" 
                  iconLeft={<MessageSquare size={18} color="#4C6FFF" />}
                  className="flex-1 h-16 rounded-[24px]" 
                  onPress={() => {
                    detailDisclosure.close();
                    showToast("Chat system coming soon", "info");
                  }} 
                />
                <Button 
                  title="Support" 
                  className="flex-1 h-16 rounded-[24px]" 
                  onPress={() => {
                    detailDisclosure.close();
                    showToast("Support ticket created", "success");
                  }} 
                />
              </View>
            </View>
          )}
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
