import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Calendar, MapPin, MessageCircle, DollarSign } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { subscribeToBooking, updateOrderStatus, Booking } from "../services/db";
import { Colors, Shadows } from "../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Real-time subscription to this booking
  useEffect(() => {
    if (!id) return;
    const unsubscribe = subscribeToBooking(id, (data) => {
      setBooking(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  const handleStatusUpdate = async (newStatus: "accepted" | "declined" | "cancelled") => {
    if (!booking) return;
    setActionLoading(true);
    try {
      await updateOrderStatus(booking.id, newStatus);

      if (newStatus === "accepted") {
        Alert.alert("Job Accepted!", "You can now proceed to the customer.", [
          { text: "Go to Active Job", onPress: () => router.push({ pathname: "/active-job", params: { id: booking.id } }) },
        ]);
      } else {
        router.back();
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update job status.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={Colors.secondary} />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">Job not found.</Text>
      </SafeAreaView>
    );
  }

  const scheduledDate = booking.scheduledDate?.toDate?.() || new Date();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4 gap-6">
          {/* Status + title */}
          <View className="gap-2">
            <StatusBadge status={booking.status} />
            <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface">
              {booking.title}
            </Text>
            <View className="flex-row items-center gap-1">
              <DollarSign size={20} color={Colors.secondary} />
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-surface">
                ${booking.price?.toFixed(2)}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant ml-1">
                Est. Total
              </Text>
            </View>
          </View>

          {/* Customer info card */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex-row items-center gap-4" style={Shadows.sm}>
            <View className="w-16 h-16 rounded-full bg-secondary-fixed items-center justify-center border border-surface-variant">
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 24, color: Colors.secondary }}>
                {booking.customerName.charAt(0)}
              </Text>
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
                {booking.customerName}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant mt-1">
                {booking.serviceCategory}
              </Text>
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-container-low items-center justify-center">
              <MessageCircle size={20} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Customer's message */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 gap-2" style={Shadows.sm}>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
              Customer's Message
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 26 }} className="text-on-surface-variant">
              "{booking.customerMessage || booking.description}"
            </Text>
          </View>

          {/* Details */}
          <View className="gap-3">
            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-8 h-8 rounded-full bg-primary-fixed items-center justify-center">
                  <Calendar size={16} color={Colors.onPrimaryFixed} />
                </View>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant">
                  Scheduled Date
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface ml-11">
                {scheduledDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </Text>
            </View>

            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-8 h-8 rounded-full bg-primary-fixed items-center justify-center">
                  <MapPin size={16} color={Colors.onPrimaryFixed} />
                </View>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant">
                  Service Location
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface ml-11">
                {booking.address || "Not specified"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action bar — only for pending jobs */}
      {booking.status === "pending" && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant px-4 py-4" style={Shadows.md}>
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => handleStatusUpdate("declined")}
              disabled={actionLoading}
              className="flex-1 h-14 rounded-xl border border-error bg-surface-container-lowest items-center justify-center"
              activeOpacity={0.8}
            >
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.error }}>
                Decline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleStatusUpdate("accepted")}
              disabled={actionLoading}
              className="flex-1 h-14 rounded-xl bg-primary items-center justify-center"
              style={Shadows.sm}
              activeOpacity={0.85}
            >
              {actionLoading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onPrimary }}>
                  Accept Job
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
