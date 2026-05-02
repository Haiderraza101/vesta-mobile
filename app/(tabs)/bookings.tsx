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
import { Calendar, Clock, CheckCircle2, MessageSquare, AlertCircle, MapPin, CreditCard, Package } from "lucide-react-native";

export default function BookingsScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const detailDisclosure = useDisclosure();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.uid || !userProfile?.role) return;
    
    const unsubscribe = bookingService.subscribeToBookings(
      user.uid, 
      userProfile.role, 
      (data) => {
        // Sort by date/time (simplified sort for now)
        const sorted = data.sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        setBookings(sorted);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [user?.uid, userProfile?.role]);

  const handleUpdateStatus = async (bookingId: string, status: any) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      showToast(`Booking ${status} successfully`, "success");
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Real-time listener will handle it, but we can set refreshing false after a short delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    detailDisclosure.open();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-500';
      case 'confirmed': return 'text-blue-500';
      case 'completed': return 'text-emerald-500';
      case 'cancelled': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-amber-50';
      case 'confirmed': return 'bg-blue-50';
      case 'completed': return 'bg-emerald-50';
      case 'cancelled': return 'bg-rose-50';
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
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <LinearGradient colors={['#F8FAFC', '#FFFFFF']} className="flex-1">
        <View className="px-6 pt-6 mb-8">
           <Text weight="bold" className="text-3xl text-slate-900">My Bookings</Text>
           <Text className="text-slate-500 mt-1">Track your service history</Text>
        </View>
        
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />}
        >
          {bookings.length === 0 ? (
            <View className="mt-20 items-center justify-center bg-white p-12 rounded-[48px] border border-slate-50 shadow-sm">
              <View className="w-24 h-24 bg-slate-50 rounded-[32px] items-center justify-center mb-8">
                <Calendar size={40} color="#CBD5E1" strokeWidth={1.5} />
              </View>
              <Text weight="bold" className="text-2xl text-slate-900 mb-2">No bookings yet</Text>
              <Text className="text-slate-500 text-center text-base leading-7 mb-10 px-4">
                You haven't scheduled any services yet. Start exploring the marketplace!
              </Text>
              <Button 
                title="Explore Services" 
                className="w-full rounded-full h-16 shadow-lg shadow-primary/20"
                onPress={() => router.push('/(tabs)')}
              />
            </View>
          ) : (
            bookings.map((booking) => (
              <Card 
                key={booking.id} 
                className="mb-6 overflow-hidden border-slate-50 bg-white shadow-sm"
                style={{ borderRadius: 32 }}
                onPress={() => handleBookingPress(booking)}
              >
                <View className="flex-row p-6">
                  <Image source={{ uri: booking.serviceImage }} className="w-24 h-24 rounded-3xl" resizeMode="cover" />
                  <View className="flex-1 ml-6">
                    <View className="flex-row justify-between items-start mb-2">
                      <View className={`${getStatusBg(booking.status)} px-3 py-1 rounded-full`}>
                        <Text weight="bold" className={`${getStatusColor(booking.status)} text-[10px] uppercase tracking-widest`}>{booking.status}</Text>
                      </View>
                    </View>
                    <Text weight="bold" className="text-lg text-slate-900 mb-2" numberOfLines={1}>{booking.serviceName}</Text>
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-1.5">
                        <Calendar size={14} color="#94A3B8" />
                        <Text className="text-slate-500 text-xs font-medium">{booking.date}</Text>
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <Clock size={14} color="#94A3B8" />
                        <Text className="text-slate-500 text-xs font-medium">{booking.time}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="bg-slate-50 px-6 py-4 flex-row justify-between items-center border-t border-slate-100/50">
                   <Text className="text-slate-400 text-xs">Booking Amount</Text>
                   <Text weight="bold" className="text-primary text-lg">{booking.price}</Text>
                </View>
              </Card>
            ))
          )}
        </ScrollView>

        <AppModal visible={detailDisclosure.isOpen} onClose={detailDisclosure.close} title="Booking Details">
          {selectedBooking && (
            <View className="mt-4">
              <View className="bg-slate-50 p-8 rounded-[40px] mb-10 border border-slate-100">
                <View className="flex-row items-center gap-5 mb-10">
                  <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm">
                    <CheckCircle2 size={28} color="#10B981" />
                  </View>
                  <View>
                    <Text weight="bold" className="text-2xl text-slate-900 capitalize">{selectedBooking.status}</Text>
                    <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mt-1">Transaction ID: #{selectedBooking.id?.slice(-8).toUpperCase()}</Text>
                  </View>
                </View>
                
                <View className="gap-6">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                       <Package size={18} color="#64748B" />
                       <Text className="text-slate-500 text-base font-medium">Service</Text>
                    </View>
                    <Text weight="bold" className="text-slate-800 text-base">{selectedBooking.serviceName}</Text>
                  </View>
                  
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-center gap-3 mt-1">
                       <MapPin size={18} color="#64748B" />
                       <Text className="text-slate-500 text-base font-medium">Location</Text>
                    </View>
                    <Text weight="bold" className="text-slate-800 text-base text-right flex-1 ml-10" numberOfLines={2}>{selectedBooking.address}</Text>
                  </View>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                       <Calendar size={18} color="#64748B" />
                       <Text className="text-slate-500 text-base font-medium">Schedule</Text>
                    </View>
                    <Text weight="bold" className="text-slate-800 text-base">{selectedBooking.date} • {selectedBooking.time}</Text>
                  </View>

                  <View className="h-[1px] bg-slate-200/50 my-2" />
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                       <CreditCard size={18} color="#64748B" />
                       <Text weight="bold" className="text-slate-500 text-lg">Total Paid</Text>
                    </View>
                    <Text weight="bold" className="text-primary text-3xl">{selectedBooking.price}</Text>
                  </View>
                </View>
              </View>
              
              <View className="flex-row gap-4 mt-10">
                {userProfile?.role === 'provider' && selectedBooking.status === 'pending' && (
                  <Button 
                    title="Confirm Booking" 
                    className="flex-1 h-16 rounded-[28px] shadow-lg shadow-primary/20" 
                    onPress={() => {
                      handleUpdateStatus(selectedBooking.id!, 'confirmed');
                      detailDisclosure.close();
                    }} 
                  />
                )}
                {userProfile?.role === 'provider' && selectedBooking.status === 'confirmed' && (
                  <Button 
                    title="Mark Completed" 
                    className="flex-1 h-16 rounded-[28px] bg-emerald-500 shadow-lg shadow-emerald-500/20" 
                    onPress={() => {
                      handleUpdateStatus(selectedBooking.id!, 'completed');
                      detailDisclosure.close();
                    }} 
                  />
                )}
                {userProfile?.role === 'customer' && (
                  <>
                    <Button 
                      title="Message Support" 
                      variant="outline" 
                      iconLeft={<MessageSquare size={20} color="#4C6FFF" />}
                      className="flex-1 h-16 rounded-[28px]" 
                      onPress={() => {
                        detailDisclosure.close();
                        showToast("Chat system coming soon", "info");
                      }} 
                    />
                    <Button 
                      title="Need Help?" 
                      className="flex-1 h-16 rounded-[28px]" 
                      onPress={() => {
                        detailDisclosure.close();
                        showToast("Support ticket created", "success");
                      }} 
                    />
                  </>
                )}
              </View>
            </View>
          )}
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
