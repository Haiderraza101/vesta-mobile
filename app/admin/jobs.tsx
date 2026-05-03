import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { bookingService, Booking } from '@/services/bookingService';
import { ChevronLeft, Calendar, Clock, MapPin, Package, CheckCircle2, XCircle } from 'lucide-react-native';

export default function AdminJobsScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user?.uid || !userProfile?.role) return;
    
    const unsubscribe = bookingService.subscribeToBookings(
      user.uid, 
      userProfile.role, 
      (data) => {
        setBookings(data);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [user?.uid, userProfile?.role]);

  const handleUpdateStatus = async (bookingId: string, status: any) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      showToast(`Request ${status} successfully`, "success");
    } catch (error) {
      showToast("Failed to update status", "error");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <View className="px-6 py-4 flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-100"
          >
            <ChevronLeft size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text weight="bold" className="text-xl text-slate-900">Service Requests</Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {bookings.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-slate-100 rounded-3xl items-center justify-center mb-4">
              <Package size={32} color="#94A3B8" />
            </View>
            <Text weight="bold" className="text-lg text-slate-900 mb-1">No requests yet</Text>
            <Text className="text-slate-500 text-sm text-center px-10">
              New booking requests will appear here once customers book your services.
            </Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <View 
              key={booking.id}
              className="bg-white rounded-[32px] p-6 mb-6 border border-slate-50 shadow-sm"
            >
              <View className="flex-row items-center mb-6">
                <Image source={{ uri: booking.serviceImage }} className="w-14 h-14 rounded-2xl" />
                <View className="ml-4 flex-1">
                  <Text weight="bold" className="text-base text-slate-900">{booking.serviceName}</Text>
                  <Text className="text-primary text-sm font-bold mt-0.5">${booking.price}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${booking.status === 'pending' ? 'bg-amber-50' : 'bg-emerald-50'}`}>
                  <Text weight="bold" className={`text-[10px] uppercase ${booking.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {booking.status}
                  </Text>
                </View>
              </View>

              <View className="bg-slate-50 rounded-2xl p-4 mb-6 gap-y-3">
                <View className="flex-row items-center gap-3">
                  <Calendar size={14} color="#64748B" />
                  <Text className="text-slate-600 text-xs font-medium">{booking.date}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Clock size={14} color="#64748B" />
                  <Text className="text-slate-600 text-xs font-medium">{booking.time}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <MapPin size={14} color="#64748B" />
                  <Text className="text-slate-600 text-xs font-medium" numberOfLines={1}>{booking.address}</Text>
                </View>
              </View>

              {booking.status === 'pending' && (
                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    onPress={() => handleUpdateStatus(booking.id!, 'cancelled')}
                    className="flex-1 h-12 bg-rose-50 rounded-xl items-center justify-center flex-row gap-2"
                  >
                    <XCircle size={18} color="#E11D48" />
                    <Text weight="bold" className="text-rose-600 text-sm">Reject</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleUpdateStatus(booking.id!, 'confirmed')}
                    className="flex-2 h-12 bg-primary rounded-xl items-center justify-center flex-row gap-2 px-6"
                  >
                    <CheckCircle2 size={18} color="white" />
                    <Text weight="bold" className="text-white text-sm">Accept Request</Text>
                  </TouchableOpacity>
                </View>
              )}

              {booking.status === 'confirmed' && (
                <View className="bg-emerald-50 p-4 rounded-xl items-center justify-center flex-row gap-2">
                  <CheckCircle2 size={18} color="#10B981" />
                  <Text weight="bold" className="text-emerald-600 text-sm">Job Confirmed</Text>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
