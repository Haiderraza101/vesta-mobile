import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, Image, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { bookingService, Booking } from '@/services/bookingService';
import { Briefcase, Calendar, Clock, MapPin, CheckCircle2, XCircle, Star, MessageSquare } from 'lucide-react-native';

export function ProviderJobsTab() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = bookingService.subscribeToBookings(user.uid, 'provider', (data) => {
      setBookings(data);
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubscribe && unsubscribe();
  }, [user]);

  const handleStatusUpdate = async (id: string, status: any) => {
    try {
      await bookingService.updateBookingStatus(id, status);
      showToast(`Job ${status}`, "success");
    } catch (error) {
      showToast("Update failed", "error");
    }
  };

  const handleRateCustomer = async () => {
    if (!selectedBooking) return;
    setSubmitting(true);
    try {
      await bookingService.rateCustomer(selectedBooking.id!, selectedBooking.customerId, rating, review);
      showToast("Customer rated successfully!", "success");
      setIsRatingModalOpen(false);
      setSelectedBooking(null);
      setRating(5);
      setReview("");
    } catch (error) {
      showToast("Rating failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !refreshing) return <LoadingState />;

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <ScreenHeader title="My Jobs" subtitle="Manage your service requests" />
      </SafeAreaView>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
      >
        {bookings.length === 0 ? (
          <EmptyState title="No jobs yet" description="New requests will appear here" icon={Briefcase} />
        ) : (
          <View className="gap-6">
            {bookings.map((booking) => (
              <View key={booking.id} className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm">
                <View className="flex-row justify-between items-start mb-6">
                  <View className="flex-1 mr-4">
                    <Text weight="bold" className="text-lg text-slate-900 mb-1">{booking.serviceName}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className={`w-2 h-2 rounded-full ${booking.status === 'pending' ? 'bg-amber-400' : booking.status === 'confirmed' ? 'bg-blue-400' : 'bg-emerald-400'}`} />
                      <Text weight="bold" className="text-[10px] uppercase text-slate-400 tracking-widest">{booking.status}</Text>
                    </View>
                  </View>
                  <Text weight="bold" className="text-primary text-lg">${booking.price}</Text>
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
                      onPress={() => handleStatusUpdate(booking.id!, 'cancelled')}
                      className="flex-1 h-12 bg-rose-50 rounded-xl items-center justify-center"
                    >
                      <Text weight="bold" className="text-rose-600 text-sm">Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => handleStatusUpdate(booking.id!, 'confirmed')}
                      className="flex-2 h-12 bg-primary rounded-xl items-center justify-center"
                    >
                      <Text weight="bold" className="text-white text-sm">Accept Job</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {booking.status === 'completed' && !booking.customerRating && (
                  <Button 
                    title="Rate Customer" 
                    onPress={() => {
                      setSelectedBooking(booking);
                      setIsRatingModalOpen(true);
                    }}
                    variant="outline"
                    className="h-12 rounded-xl"
                  />
                )}

                {booking.customerRating && (
                  <View className="bg-emerald-50 p-4 rounded-xl flex-row items-center gap-3">
                    <CheckCircle2 size={16} color="#10B981" />
                    <Text weight="bold" className="text-emerald-600 text-xs">Mutual Feedback Complete</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <ModalLayout
        visible={isRatingModalOpen}
        onClose={() => setIsRatingModalOpen(false)}
        title="Rate Customer"
      >
        <View className="p-6">
          <Text className="text-slate-500 text-center mb-8">How was your experience working with this customer?</Text>
          
          <View className="flex-row justify-center gap-3 mb-10">
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Star size={40} color={s <= rating ? "#FBBF24" : "#E2E8F0"} fill={s <= rating ? "#FBBF24" : "transparent"} />
              </TouchableOpacity>
            ))}
          </View>

          <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-8">
            <View className="flex-row items-center gap-2 mb-3">
              <MessageSquare size={16} color="#64748B" />
              <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-widest">Feedback</Text>
            </View>
            <TextInput 
              placeholder="Write a brief review about the customer..." 
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              className="text-slate-900 text-sm h-24 pt-0"
              textAlignVertical="top"
            />
          </View>

          <Button 
            title="Submit Feedback" 
            onPress={handleRateCustomer}
            loading={submitting}
            className="h-14 rounded-2xl"
          />
        </View>
      </ModalLayout>
    </View>
  );
}
