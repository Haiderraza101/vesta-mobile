import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { Selector } from "../components/ui/Selector";
import { useToast } from "../context/ToastContext";
import { cn } from "../utils/utils";
import { ArrowLeft, Calendar as CalendarIcon, Clock } from "lucide-react-native";

const TIME_SLOTS = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];
const DATES = [
  { day: "Mon", date: "28" },
  { day: "Tue", date: "29" },
  { day: "Wed", date: "30" },
  { day: "Thu", date: "01" },
  { day: "Fri", date: "02" },
];

export default function BookServiceScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState("28");
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [serviceType, setServiceType] = useState("");

  const SERVICE_OPTIONS = [
    { label: "General Maintenance", value: "general" },
    { label: "Deep Cleaning", value: "deep" },
    { label: "Emergency Repair", value: "emergency" },
  ];

  const handleConfirm = () => {
    showToast("Booking confirmed successfully!", "success");
    router.replace("/(tabs)/bookings");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-6">
        <View className="flex-row items-center gap-4 mb-10">
          <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center -ml-2">
            <ArrowLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text variant="h2" weight="bold">Book Service</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mb-10">
            <Text variant="h4" weight="bold" className="mb-4 uppercase tracking-widest text-xs text-slate-400">Step 1: Select Service</Text>
            <Selector 
              label="Service Type"
              options={SERVICE_OPTIONS}
              value={serviceType}
              onSelect={setServiceType}
              placeholder="Choose service type..."
            />
          </View>

          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-4">
              <CalendarIcon size={16} color="#64748B" />
              <Text variant="h4" weight="bold" className="uppercase tracking-widest text-xs text-slate-400">Step 2: Select Date</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
              <View className="flex-row gap-4">
                {DATES.map((d) => (
                  <TouchableOpacity
                    key={d.date}
                    onPress={() => setSelectedDate(d.date)}
                    className={cn(
                      "w-20 h-24 items-center justify-center border rounded-[20px]",
                      selectedDate === d.date ? "bg-primary border-primary" : "bg-white border-slate-100 shadow-sm"
                    )}
                  >
                    <Text weight="bold" className={cn("text-[10px] uppercase mb-1", selectedDate === d.date ? "text-white/60" : "text-slate-400")}>
                      {d.day}
                    </Text>
                    <Text variant="h2" weight="bold" className={selectedDate === d.date ? "text-white" : "text-slate-900"}>
                      {d.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View className="mb-10">
            <View className="flex-row items-center gap-2 mb-4">
              <Clock size={16} color="#64748B" />
              <Text variant="h4" weight="bold" className="uppercase tracking-widest text-xs text-slate-400">Step 3: Select Time</Text>
            </View>
            <View className="flex-row flex-wrap gap-3">
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  onPress={() => setSelectedTime(slot)}
                  className={cn(
                    "px-6 py-4 border rounded-[20px]",
                    selectedTime === slot ? "bg-primary border-primary" : "bg-white border-slate-100 shadow-sm"
                  )}
                >
                  <Text weight="bold" className={selectedTime === slot ? "text-white" : "text-slate-700"}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View className="py-8 bg-white border-t border-slate-50 -mx-6 px-6">
          <Button 
            title="Confirm Booking" 
            size="lg"
            onPress={handleConfirm}
            disabled={!serviceType}
            className="rounded-full shadow-lg shadow-primary/20"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
