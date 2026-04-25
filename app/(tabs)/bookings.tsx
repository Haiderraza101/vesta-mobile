import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Card } from "../../components/ui/Card";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { ComingSoon } from "../../components/ui/ComingSoon";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Clock, CheckCircle2 } from "lucide-react-native";

const BOOKINGS = [
  { 
    id: 1, 
    service: "Home Cleaning", 
    date: "24 Oct 2023", 
    time: "10:00 AM", 
    status: "Upcoming",
    price: "$120",
    provider: "CleanCo Solutions",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300"
  },
  { 
    id: 2, 
    service: "Plumbing Repair", 
    date: "21 Oct 2023", 
    time: "02:30 PM", 
    status: "Completed",
    price: "$180",
    provider: "QuickFix Plumbers",
    image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=300"
  },
];

export default function BookingsScreen() {
  const { showToast } = useToast();
  const detailDisclosure = useDisclosure();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  const handleBookingPress = (booking: any) => {
    setSelectedBooking(booking);
    detailDisclosure.open();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top', 'bottom']}>
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="My Bookings" subtitle="Track your services" />
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <View className="pb-40">
            {BOOKINGS.map((booking) => (
              <Card 
                key={booking.id} 
                className="mb-6 overflow-hidden"
                onPress={() => handleBookingPress(booking)}
              >
                <View className="flex-row p-5">
                  <Image source={{ uri: booking.image }} className="w-24 h-24 rounded-2xl" resizeMode="cover" />
                  <View className="flex-1 ml-5">
                    <View className="flex-row justify-between items-start">
                      <View className="bg-primary/5 px-3 py-1 rounded-full mb-2">
                        <Text weight="bold" className="text-primary text-[10px] uppercase tracking-wider">{booking.status}</Text>
                      </View>
                      <Text weight="bold" className="text-primary text-base">{booking.price}</Text>
                    </View>
                    <Text weight="bold" className="text-lg text-slate-900 mb-1">{booking.service}</Text>
                    <Text className="text-slate-500 text-sm mb-3">{booking.provider}</Text>
                    <View className="flex-row items-center gap-4">
                      <View className="flex-row items-center gap-1.5">
                        <Calendar size={14} color="#94A3B8" />
                        <Text className="text-slate-400 text-xs">{booking.date}</Text>
                      </View>
                      <View className="flex-row items-center gap-1.5">
                        <Clock size={14} color="#94A3B8" />
                        <Text className="text-slate-400 text-xs">{booking.time}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </ScrollView>

        <AppModal visible={detailDisclosure.isOpen} onClose={detailDisclosure.close} title="Booking Details">
          {selectedBooking && (
            <View className="mt-4">
              <View className="bg-slate-50 p-6 rounded-[32px] mb-8 border border-slate-100">
                <View className="flex-row items-center gap-4 mb-6">
                  <CheckCircle2 size={24} color="#10B981" />
                  <Text weight="bold" className="text-xl text-slate-900">Service {selectedBooking.status}</Text>
                </View>
                <View className="gap-4">
                  <View className="flex-row justify-between">
                    <Text className="text-slate-500">Service</Text>
                    <Text weight="bold" className="text-slate-800">{selectedBooking.service}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-slate-500">Provider</Text>
                    <Text weight="bold" className="text-slate-800">{selectedBooking.provider}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-slate-500">Date & Time</Text>
                    <Text weight="bold" className="text-slate-800">{selectedBooking.date} at {selectedBooking.time}</Text>
                  </View>
                  <View className="h-[1px] bg-slate-200 my-2" />
                  <View className="flex-row justify-between">
                    <Text weight="bold" className="text-slate-800">Total Price</Text>
                    <Text weight="bold" className="text-primary text-xl">{selectedBooking.price}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row gap-4">
                <Button title="Reschedule" variant="outline" className="flex-1" onPress={() => {
                  detailDisclosure.close();
                  showToast("Rescheduling coming soon", "info");
                }} />
                <Button title="Contact" className="flex-1" onPress={() => {
                  detailDisclosure.close();
                  showToast("Chat system coming soon", "info");
                }} />
              </View>
            </View>
          )}
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
