import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import AppHeader from "../../components/ui/AppHeader";
import BookingCard from "../../components/ui/BookingCard";
import { useAuth } from "../../context/AuthContext";
import { subscribeToCustomerOrders, subscribeToProviderJobs, updateOrderStatus, Booking, OrderStatus } from "../../services/db";
import { Colors, Shadows } from "../../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

/** Cancellable statuses for customer */
const CANCELLABLE: OrderStatus[] = ["pending", "accepted", "en_route"];

export default function BookingsScreen() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const isProvider = profile?.role === "provider";

  // Real-time listener based on role
  useEffect(() => {
    if (!user) return;
    const unsub = isProvider
      ? subscribeToProviderJobs(user.uid, (data) => { setBookings(data); setLoading(false); })
      : subscribeToCustomerOrders(user.uid, (data) => { setBookings(data); setLoading(false); });
    return () => unsub();
  }, [user, profile]);

  const activeStatuses: OrderStatus[] = ["pending", "accepted", "en_route", "in_progress"];
  const doneStatuses: OrderStatus[] = ["completed", "cancelled", "declined"];

  const filtered = activeTab === "active"
    ? bookings.filter((b) => activeStatuses.includes(b.status))
    : bookings.filter((b) => doneStatuses.includes(b.status));

  const handleCancel = (booking: Booking) => {
    Alert.alert("Cancel Order?", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      { text: "Yes, Cancel", style: "destructive", onPress: () => updateOrderStatus(booking.id, "cancelled") },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          <View className="gap-4">
            <View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface mb-1">
                {isProvider ? "My Jobs" : "My Bookings"}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant">
                {isProvider ? "Manage your jobs and history." : "Track your orders in real-time."}
              </Text>
            </View>

            <View className="flex-row p-1 bg-surface-variant rounded-lg">
              <TouchableOpacity onPress={() => setActiveTab("active")}
                className={`flex-1 py-2 px-4 rounded items-center ${activeTab === "active" ? "bg-surface-container-lowest" : ""}`}
                style={activeTab === "active" ? Shadows.sm : {}}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: activeTab === "active" ? Colors.onSurface : Colors.onSurfaceVariant }}>Active</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab("past")}
                className={`flex-1 py-2 px-4 rounded items-center ${activeTab === "past" ? "bg-surface-container-lowest" : ""}`}
                style={activeTab === "past" ? Shadows.sm : {}}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: activeTab === "past" ? Colors.onSurface : Colors.onSurfaceVariant }}>Past</Text>
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View className="py-12 items-center"><ActivityIndicator size="large" color={Colors.secondary} /></View>
          ) : (
            <View className="gap-4">
              {filtered.map((booking) => (
                <View key={booking.id}>
                  <BookingCard
                    serviceType={booking.serviceCategory} serviceIcon="sparkles"
                    title={booking.title} description={booking.customerMessage || booking.description}
                    status={booking.status} address={booking.address} timeAgo=""
                  />
                  {/* Customer can cancel if in cancellable state */}
                  {!isProvider && CANCELLABLE.includes(booking.status) && (
                    <TouchableOpacity onPress={() => handleCancel(booking)}
                      className="mt-2 border border-error rounded-lg py-2 items-center">
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: Colors.error }}>Cancel Order</Text>
                    </TouchableOpacity>
                  )}
                  {/* Customer status tracker */}
                  {!isProvider && activeStatuses.includes(booking.status) && (
                    <View className="mt-2 flex-row items-center gap-2 bg-surface-container-low px-3 py-2 rounded-lg">
                      <View className="w-2 h-2 rounded-full" style={{ backgroundColor: booking.status === "in_progress" ? Colors.emerald500 : Colors.secondary }} />
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 13, color: Colors.onSurfaceVariant }}>
                        Status: {booking.status.replace("_", " ").toUpperCase()}
                        {booking.status === "en_route" && " — Provider is on the way!"}
                        {booking.status === "in_progress" && " — Work has started"}
                      </Text>
                    </View>
                  )}
                </View>
              ))}
              {filtered.length === 0 && (
                <View className="items-center py-12">
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">
                    No {activeTab} {isProvider ? "jobs" : "bookings"}.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
