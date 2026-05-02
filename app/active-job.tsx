import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Phone, MessageCircle, MapPin, Navigation, CheckCircle } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import ProgressStepper from "../components/ui/ProgressStepper";
import { getBookingById, updateBookingStatus, Booking } from "../services/db";
import { Colors, Shadows } from "../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveJobScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    if (!id) return;
    try {
      const data = await getBookingById(id);
      setBooking(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!booking) return;
    setCompleting(true);
    try {
      await updateBookingStatus(booking.id, "completed");
      router.replace({ pathname: "/job-completed", params: { id: booking.id, price: String(booking.price || 150) } });
    } catch (e) {
      Alert.alert("Error", "Failed to complete job.");
    } finally {
      setCompleting(false);
    }
  };

  const steps = [
    { label: "Job Accepted", time: "Confirmed", status: "completed" as const },
    { label: "En Route", time: "On the way", status: "completed" as const },
    { label: "Work In Progress", time: "Started", status: "current" as const },
    { label: "Completed", time: "Pending", status: "pending" as const },
  ];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={Colors.secondary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4 gap-4">
          <View className="rounded-lg p-4 flex-row items-center gap-2" style={{ borderColor: "#6ee7b7", borderWidth: 1, backgroundColor: "#ecfdf5" }}>
            <View className="w-2 h-2 rounded-full" style={{ backgroundColor: Colors.emerald500 }} />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#065f46" }}>In Progress</Text>
          </View>

          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-4" style={Shadows.md}>
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-secondary-fixed items-center justify-center border border-outline-variant">
                <Text style={{ fontFamily: "Manrope-Bold", fontSize: 24, color: Colors.secondary }}>
                  {(booking?.customerName || "C").charAt(0)}
                </Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
                  {booking?.customerName || "Customer"}
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant mt-1">
                  {booking?.serviceCategory || "Service"}
                </Text>
              </View>
            </View>
            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg border border-secondary">
                <Phone size={16} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg border border-secondary">
                <MessageCircle size={16} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-4" style={Shadows.sm}>
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">Location</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Navigation size={14} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: Colors.secondary }}>Open in Maps</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full h-36 rounded-lg bg-surface-container-low border border-outline-variant items-center justify-center">
              <MapPin size={28} color={Colors.secondary} />
              <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant mt-1">Map Preview</Text>
            </View>
            <View className="flex-row items-start gap-2">
              <MapPin size={20} color={Colors.outline} />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-on-surface">
                {booking?.address || "Address not specified"}
              </Text>
            </View>
          </View>

          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4" style={Shadows.sm}>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface mb-2">Job Progress</Text>
            <ProgressStepper steps={steps} />
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-4" style={Shadows.md}>
        <TouchableOpacity
          onPress={handleComplete}
          disabled={completing}
          className={`w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2 ${completing ? "opacity-50" : ""}`}
          activeOpacity={0.85}
        >
          {completing ? <ActivityIndicator color={Colors.onPrimary} /> : (
            <>
              <CheckCircle size={20} color={Colors.onPrimary} />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onPrimary }}>Mark as Completed</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
