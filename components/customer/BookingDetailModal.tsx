import React, { useState } from 'react';
import { View, TouchableOpacity,  TextInput, ScrollView } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { useToast } from '@/context/ToastContext';
import { bookingService, Booking } from '@/services/bookingService';
import { Star, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react-native';

interface BookingDetailModalProps {
  booking: Booking | null;
  visible: boolean;
  onClose: () => void;
}

export function BookingDetailModal({ booking, visible, onClose }: BookingDetailModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [step, setStep] = useState<'detail' | 'rate'>('detail');

  if (!booking) return null;

  const handleMarkDone = () => {
    setStep('rate');
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      showToast("Please select a rating", "error");
      return;
    }
    setLoading(true);
    try {
      await bookingService.rateProvider(booking.id!, booking.providerId, rating, review);
      showToast("Thank you for your rating!", "success");
      onClose();
    } catch (error) {
      showToast("Failed to submit rating", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('detail');
    onClose();
  };

  return (
    <ModalLayout
      visible={visible}
      onClose={handleClose}
      title={step === 'detail' ? 'Booking Details' : 'Rate Service'}
    >
      <View className="pb-8">
        {step === 'detail' ? (
          <View>
            <View className="bg-slate-50 p-6 rounded-3xl mb-8 border border-slate-100">
              <Text weight="bold" className="text-lg text-slate-900 mb-4">{booking.serviceName}</Text>
              
              <View className="gap-y-4">
                <View className="flex-row items-center gap-3">
                  <Calendar size={16} color="#4C6FFF" />
                  <Text className="text-slate-600 text-sm font-medium">{booking.date}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <Clock size={16} color="#4C6FFF" />
                  <Text className="text-slate-600 text-sm font-medium">{booking.time}</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <MapPin size={16} color="#4C6FFF" />
                  <Text className="text-slate-600 text-sm font-medium">{booking.address}</Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center bg-slate-900 p-5 rounded-2xl mb-8">
              <View>
                <Text className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Status</Text>
                <Text weight="bold" className="text-white text-base capitalize">{booking.status}</Text>
              </View>
              {booking.status === 'confirmed' && (
                <View className="w-10 h-10 bg-emerald-500 rounded-full items-center justify-center">
                  <CheckCircle2 size={20} color="white" />
                </View>
              )}
            </View>

            {booking.status === 'confirmed' && (
              <Button 
                title="Mark as Done" 
                onPress={handleMarkDone}
                className="h-14 rounded-2xl bg-primary"
              />
            )}
          </View>
        ) : (
          <View>
            <Text className="text-slate-500 text-center mb-8 px-4 leading-6">
              How was your experience with {booking.serviceName}? Your feedback helps our community.
            </Text>

            <View className="flex-row justify-center gap-4 mb-10">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setRating(star)}>
                  <Star 
                    size={40} 
                    color={star <= rating ? "#FBBF24" : "#E2E8F0"} 
                    fill={star <= rating ? "#FBBF24" : "transparent"} 
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              placeholder="Write a brief review (optional)..."
              multiline
              numberOfLines={4}
              className="bg-slate-50 rounded-2xl p-5 text-slate-900 font-bold border border-slate-100 h-32 mb-8"
              textAlignVertical="top"
              value={review}
              onChangeText={setReview}
            />

            <Button 
              title="Submit Rating" 
              loading={loading}
              onPress={handleSubmitRating}
              className="h-14 rounded-2xl bg-emerald-500"
            />
          </View>
        )}
      </View>
    </ModalLayout>
  );
}
