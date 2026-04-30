import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { bookingService } from "../services/bookingService";
import { cn } from "../utils/utils";
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react-native";

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
  
  const [selectedDate, setSelectedDate] = useState(DATES[0].date);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const { serviceId, serviceName, servicePrice, serviceImage, providerId } = params;

  const handleConfirm = async () => {
    if (!user?.uid) return;
    
    setLoading(true);
    try {
      await bookingService.createBooking({
        customerId: user.uid,
        providerId: providerId as string,
        serviceId: serviceId as string,
        serviceName: serviceName as string,
        serviceImage: serviceImage as string,
        price: servicePrice as string,
        date: `${selectedDate} May 2026`,
        time: selectedTime,
        address: address,
      });

      showToast("Booking confirmed successfully!", "success");
      router.replace("/(tabs)/bookings");
    } catch (error) {
      showToast("Failed to create booking", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-8 pt-6">
        <View className="flex-row items-center gap-4 mb-10">
          <TouchableOpacity onPress={() => router.back()} className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl">
            <ArrowLeft size={22} color="#0F172A" strokeWidth={2.5} />
          </TouchableOpacity>
          <View>
            <Text weight="bold" className="text-2xl text-slate-900">Book Service</Text>
            <Text className="text-slate-500">{serviceName}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-6">
              <CalendarIcon size={18} color="#4C6FFF" strokeWidth={2.5} />
              <Text weight="bold" className="text-lg text-slate-800">Select Date</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-8 px-8">
              <View className="flex-row gap-4">
                {DATES.map((d) => (
                  <TouchableOpacity
                    key={d.date}
                    onPress={() => setSelectedDate(d.date)}
                    className={cn(
                      "w-24 h-28 items-center justify-center border rounded-[32px] transition-all",
                      selectedDate === d.date ? "bg-primary border-primary shadow-lg shadow-primary/30" : "bg-white border-slate-100 shadow-sm"
                    )}
                  >
                    <Text weight="bold" className={cn("text-[10px] uppercase mb-1 tracking-widest", selectedDate === d.date ? "text-white/60" : "text-slate-400")}>
                      {d.day}
                    </Text>
                    <Text weight="bold" className={cn("text-2xl", selectedDate === d.date ? "text-white" : "text-slate-900")}>
                      {d.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-6">
              <Clock size={18} color="#4C6FFF" strokeWidth={2.5} />
              <Text weight="bold" className="text-lg text-slate-800">Select Time</Text>
            </View>
            <View className="flex-row flex-wrap gap-4">
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  onPress={() => setSelectedTime(slot)}
                  className={cn(
                    "px-7 py-4 border rounded-[24px]",
                    selectedTime === slot ? "bg-primary border-primary shadow-md" : "bg-white border-slate-100 shadow-sm"
                  )}
                >
                  <Text weight="bold" className={cn("text-base", selectedTime === slot ? "text-white" : "text-slate-700")}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-6">
              <MapPin size={18} color="#4C6FFF" strokeWidth={2.5} />
              <Text weight="bold" className="text-lg text-slate-800">Service Location</Text>
            </View>
            <Input 
              placeholder="Enter your full address" 
              value={address}
              onChangeText={setAddress}
              leftIcon={<MapPin size={20} color="#94A3B8" />}
              className="h-16"
            />
          </View>
        </ScrollView>

        <View className="py-8 bg-white -mx-8 px-8 border-t border-slate-50">
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-slate-400 text-sm">Total Price</Text>
              <Text weight="bold" className="text-3xl text-slate-900">{servicePrice}</Text>
            </View>
            <Text className="text-primary font-bold">Includes Tax</Text>
          </View>
          <Button 
            title={loading ? "Confirming..." : "Confirm Booking"} 
            size="lg"
            onPress={handleConfirm}
            disabled={loading}
            className="rounded-full h-16 shadow-lg shadow-primary/30"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
