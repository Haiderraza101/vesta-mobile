import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { bookingService, Booking } from '@/services/bookingService';
import { Package } from 'lucide-react-native';
import { BookingCard } from './BookingCard';
import { BookingDetailModal } from './BookingDetailModal';

export function BookingsTab() {
  const { user, userProfile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'active' | 'history'>('active');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!user?.uid || !userProfile?.role) return;
    
    const unsubscribe = bookingService.subscribeToBookings(
      user.uid, 
      userProfile.role, 
      (data) => {
        const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setBookings(sorted);
        setLoading(false);
        setRefreshing(false);
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [user?.uid, userProfile?.role]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'active') return b.status === 'pending' || b.status === 'confirmed';
    return b.status === 'completed' || b.status === 'cancelled';
  });

  const handleBookingPress = (booking: Booking) => {
    setSelectedBooking(booking);
    setModalVisible(true);
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
        <ScreenHeader title="My Bookings" showProfile={false} />
        
        <View className="flex-row px-6 pb-4 gap-3">
          <TouchableOpacity 
            onPress={() => setFilter('active')}
            className={`flex-1 h-10 rounded-xl items-center justify-center border ${filter === 'active' ? 'bg-primary border-primary' : 'bg-white border-slate-100'}`}
          >
            <Text weight="bold" className={`text-xs ${filter === 'active' ? 'text-white' : 'text-slate-500'}`}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setFilter('history')}
            className={`flex-1 h-10 rounded-xl items-center justify-center border ${filter === 'history' ? 'bg-primary border-primary' : 'bg-white border-slate-100'}`}
          >
            <Text weight="bold" className={`text-xs ${filter === 'history' ? 'text-white' : 'text-slate-500'}`}>History</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {filteredBookings.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-slate-100 rounded-3xl items-center justify-center mb-4">
              <Package size={32} color="#94A3B8" />
            </View>
            <Text weight="bold" className="text-lg text-slate-900 mb-1">No bookings found</Text>
            <Text className="text-slate-500 text-sm text-center px-10">
              You don't have any {filter} bookings at the moment.
            </Text>
          </View>
        ) : (
          filteredBookings.map((booking) => (
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onPress={() => handleBookingPress(booking)}
            />
          ))
        )}
      </ScrollView>

      <BookingDetailModal 
        booking={selectedBooking}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
