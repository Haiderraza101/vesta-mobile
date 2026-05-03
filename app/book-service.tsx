import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, Image, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { bookingService } from '@/services/bookingService';
import { serviceService, Service } from '@/services/serviceService';
import { ChevronLeft, Calendar as CalendarIcon, Clock, MapPin, CheckCircle2, ChevronRight, Info, Star, Briefcase, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';



const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
const DATES = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + i);
  return {
    day: d.toLocaleDateString('en-US', { weekday: 'short' }),
    date: d.toLocaleDateString('en-US', { day: '2-digit' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    full: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
  };
});

export default function BookServiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { settings } = useConfig();
  
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[1]);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [availableProviders, setAvailableProviders] = useState<Service[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<Service | null>(null);

  const { serviceId, serviceName, servicePrice, serviceImage, providerId } = params;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const data = await serviceService.getProvidersForService(serviceName as string);
        setAvailableProviders(data);
        const initial = data.find(p => p.providerId === providerId);
        if (initial) setSelectedProvider(initial);
        else if (data.length > 0) setSelectedProvider(data[0]);
      } catch (error) {
        showToast("Failed to fetch providers", "error");
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, [serviceName, providerId]);

  const handleConfirm = async () => {
    if (!user?.uid || !selectedProvider) return;
    setLoading(true);
    try {
      await bookingService.createBooking({
        customerId: user.uid,
        providerId: selectedProvider.providerId,
        serviceId: selectedProvider.id,
        serviceName: serviceName as string,
        serviceImage: serviceImage as string,
        price: selectedProvider.price.toString(),
        date: selectedDate.full,
        time: selectedTime,
        address: address,
        location: address,
        notes: notes
      });
      setStep(5);
      showToast("Booking request sent!", "success");
    } catch (error) {
      showToast("Failed to book service", "error");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!selectedProvider) {
        showToast("Please select a provider", "error");
        return;
      }
      setStep(2);
    }
    else if (step === 2) setStep(3);
    else if (step === 3) {
      if (!address.trim()) {
        showToast("Please enter your address", "error");
        return;
      }
      setStep(4);
    }
    else if (step === 4) handleConfirm();
    else router.replace("/(tabs)/bookings");
  };

  const prevStep = () => {
    if (step > 1 && step < 5) setStep(step - 1);
    else router.back();
  };

  if (loadingProviders) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
        <Text className="text-slate-400 mt-4 font-medium">Finding Specialists...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={prevStep} className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
            <ChevronLeft size={20} color="#1E293B" />
          </TouchableOpacity>
          <View className="flex-row items-center gap-2">
            {[1, 2, 3, 4].map((s) => (
              <View 
                key={s} 
                className={`h-1.5 rounded-full ${step >= s ? 'w-6 bg-primary' : 'w-2 bg-slate-100'}`} 
              />
            ))}
          </View>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          {step === 1 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="pt-4">
              <Text weight="bold" className="text-3xl text-slate-900 mb-2">Specialists</Text>
              <Text className="text-slate-500 mb-8">Choose your preferred professional</Text>

              <View className="gap-y-4">
                {availableProviders.map((provider) => (
                  <TouchableOpacity
                    key={provider.id}
                    onPress={() => setSelectedProvider(provider)}
                    className={`p-5 rounded-[32px] border ${
                      selectedProvider?.id === provider.id ? 'bg-primary/5 border-primary' : 'bg-slate-50 border-slate-50'
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-sm overflow-hidden">
                        {provider.image ? (
                          <Image source={{ uri: provider.image }} className="w-full h-full" />
                        ) : (
                          <User size={24} color="#4C6FFF" />
                        )}
                      </View>
                      <View className="flex-1 ml-4">
                        <Text weight="bold" className="text-slate-900 text-base">{provider.providerName || 'Pro'}</Text>
                        <View className="flex-row items-center gap-1 mt-1">
                          <Star size={12} color="#FBBF24" fill="#FBBF24" />
                          <Text weight="bold" className="text-slate-900 text-xs">{provider.rating}</Text>
                          <Text className="text-slate-400 text-xs">({provider.reviews} reviews)</Text>
                        </View>
                        <Text className="text-slate-500 text-[11px] mt-1" numberOfLines={1}>{provider.bio || 'Professional service'}</Text>
                      </View>
                      <View className="items-end">
                        <Text weight="bold" className="text-primary text-base">{settings.currencySymbol}{provider.price}</Text>
                        <Text className="text-slate-400 text-[10px]">Per visit</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {step === 2 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="pt-4">
              <Text weight="bold" className="text-3xl text-slate-900 mb-2">Schedule</Text>
              <Text className="text-slate-500 mb-8">When would you like the service?</Text>

              <Text weight="bold" className="text-sm text-slate-800 mb-4 uppercase tracking-widest">Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-8">
                {DATES.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedDate(item)}
                    className={`mr-3 items-center justify-center w-20 h-24 rounded-3xl border ${
                      selectedDate.date === item.date ? 'bg-primary border-primary' : 'bg-white border-slate-100'
                    }`}
                  >
                    <Text weight="bold" className={`text-[10px] uppercase ${selectedDate.date === item.date ? 'text-white/70' : 'text-slate-400'}`}>{item.day}</Text>
                    <Text weight="bold" className={`text-xl my-1 ${selectedDate.date === item.date ? 'text-white' : 'text-slate-900'}`}>{item.date}</Text>
                    <Text weight="bold" className={`text-[10px] uppercase ${selectedDate.date === item.date ? 'text-white/70' : 'text-slate-400'}`}>{item.month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text weight="bold" className="text-sm text-slate-800 mb-4 uppercase tracking-widest">Select Time</Text>
              <View className="flex-row flex-wrap gap-3">
                {TIME_SLOTS.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    onPress={() => setSelectedTime(slot)}
                    className={`px-5 py-3 rounded-2xl border ${
                      selectedTime === slot ? 'bg-primary border-primary' : 'bg-white border-slate-100'
                    }`}
                  >
                    <Text weight="semibold" className={`text-sm ${selectedTime === slot ? 'text-white' : 'text-slate-600'}`}>{slot}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {step === 3 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="pt-4">
              <Text weight="bold" className="text-3xl text-slate-900 mb-2">Location</Text>
              <Text className="text-slate-500 mb-8">Where should the professional come?</Text>

              <View className="bg-slate-50 p-6 rounded-[32px] border border-slate-100 mb-6">
                <View className="flex-row items-center gap-3 mb-4">
                  <View className="w-10 h-10 bg-white rounded-xl items-center justify-center shadow-sm">
                    <MapPin size={20} color="#4C6FFF" />
                  </View>
                  <Text weight="bold" className="text-slate-900 text-base">Service Address</Text>
                </View>
                <TextInput 
                  placeholder="Enter full address..."
                  multiline
                  numberOfLines={3}
                  className="bg-white rounded-2xl p-4 text-slate-900 font-medium border border-slate-100 min-h-[100px]"
                  textAlignVertical="top"
                  value={address}
                  onChangeText={setAddress}
                />
              </View>

              <Text weight="bold" className="text-sm text-slate-800 mb-4 uppercase tracking-widest">Additional Notes</Text>
              <TextInput 
                placeholder="Optional notes for the provider..."
                multiline
                numberOfLines={2}
                className="bg-slate-50 rounded-2xl p-4 text-slate-900 font-medium border border-slate-100 h-24"
                textAlignVertical="top"
                value={notes}
                onChangeText={setNotes}
              />
            </Animated.View>
          )}

          {step === 4 && (
            <Animated.View entering={FadeInRight} exiting={FadeOutLeft} className="pt-4">
              <Text weight="bold" className="text-3xl text-slate-900 mb-2">Review</Text>
              <Text className="text-slate-500 mb-8">Double check your booking details</Text>

              <View className="bg-slate-900 rounded-[40px] p-8 shadow-xl shadow-slate-200">
                <View className="flex-row items-center gap-4 mb-8">
                  <View className="w-16 h-16 bg-white/10 rounded-2xl items-center justify-center">
                    <Image source={{ uri: serviceImage as string }} className="w-12 h-12 rounded-xl" />
                  </View>
                  <View>
                    <Text weight="bold" className="text-white text-xl">{serviceName}</Text>
                    <Text className="text-white/50 text-sm">{selectedProvider?.providerName}</Text>
                  </View>
                </View>

                <View className="gap-y-6">
                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                      <CalendarIcon size={18} color="white" />
                    </View>
                    <View>
                      <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Date & Time</Text>
                      <Text weight="bold" className="text-white text-sm">{selectedDate.full} at {selectedTime}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center gap-4">
                    <View className="w-10 h-10 bg-white/5 rounded-xl items-center justify-center">
                      <MapPin size={18} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Address</Text>
                      <Text weight="bold" className="text-white text-sm" numberOfLines={1}>{address}</Text>
                    </View>
                  </View>

                  <View className="h-[1px] bg-white/10 my-2" />

                  <View className="flex-row justify-between items-center">
                    <Text className="text-white/60 text-base font-medium">Total Amount</Text>
                    <Text weight="bold" className="text-white text-2xl">{settings.currencySymbol}{selectedProvider?.price}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}

          {step === 5 && (
            <Animated.View entering={FadeInRight} className="flex-1 items-center justify-center pt-10">
              <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-8">
                <CheckCircle2 size={48} color="#10B981" />
              </View>
              <Text weight="bold" className="text-3xl text-slate-900 text-center mb-4">Booking Sent!</Text>
              <Text className="text-slate-500 text-center leading-6 px-6 mb-12">
                Your request has been sent to {selectedProvider?.providerName}. They will review it and confirm shortly.
              </Text>
              <Button 
                title="Go to Bookings" 
                onPress={() => router.replace("/(tabs)/bookings")}
                className="w-full h-14 rounded-2xl"
              />
            </Animated.View>
          )}
        </ScrollView>

        {step < 5 && (
          <View className="p-6 bg-white border-t border-slate-50">
            <Button 
              title={step === 4 ? "Confirm Booking" : "Continue"} 
              onPress={nextStep}
              loading={loading}
              className="h-14 rounded-2xl"
            />
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}
