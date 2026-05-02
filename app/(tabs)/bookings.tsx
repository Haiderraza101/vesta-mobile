import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import AppHeader from "../../components/ui/AppHeader";
import BookingCard from "../../components/ui/BookingCard";
import { useAuth } from "../../context/AuthContext";
import {
  Booking,
  OrderStatus,
  subscribeToCustomerOrders,
  subscribeToProviderJobs,
  updateOrderStatus,
} from "../../services/db";
import { Colors, Shadows } from "../../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

const ACTIVE_STATES: OrderStatus[] = ["pending", "accepted", "en_route", "in_progress"];
const ENDED_STATES: OrderStatus[] = ["completed", "cancelled", "declined"];

export default function BookingsScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const isProvider = profile?.role === "provider";

  // Real-time subscription
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = isProvider
      ? subscribeToProviderJobs(user.uid, (jobs) => {
          setBookings(jobs);
          setLoading(false);
        })
      : subscribeToCustomerOrders(user.uid, (orders) => {
          setBookings(orders);
          setLoading(false);
        });

    return () => unsubscribe();
  }, [user, isProvider]);

  const filteredBookings =
    activeTab === "active"
      ? bookings.filter((b) => ACTIVE_STATES.includes(b.status))
      : bookings.filter((b) => ENDED_STATES.includes(b.status));

  const handleCardPress = (booking: Booking) => {
    if (isProvider) {
      // Provider: navigate to job detail for pending, active-job for others
      if (booking.status === "pending") {
        router.push({ pathname: "/job-detail", params: { id: booking.id } });
      } else if (ACTIVE_STATES.includes(booking.status)) {
        router.push({ pathname: "/active-job", params: { id: booking.id } });
      }
    }
  };

  const handleCustomerCancel = async (bookingId: string, status: OrderStatus) => {
    if (["pending", "accepted", "en_route"].includes(status)) {
      Alert.alert("Cancel Order", "Are you sure you want to cancel this order?", [
        { text: "No" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await updateOrderStatus(bookingId, "cancelled");
            } catch (e: any) {
              Alert.alert("Error", e.message || "Failed to cancel order.");
            }
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          {/* Header + tabs */}
          <View className="gap-4">
            <View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface mb-1">
                {isProvider ? "My Jobs" : "My Orders"}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant">
                {isProvider ? "Manage your accepted jobs and history." : "Track your service requests in real-time."}
              </Text>
            </View>

            {/* Segmented control */}
            <View className="flex-row p-1 bg-surface-variant rounded-lg">
              <TouchableOpacity
                onPress={() => setActiveTab("active")}
                className={`flex-1 py-2 px-4 rounded items-center ${activeTab === "active" ? "bg-surface-container-lowest" : ""}`}
                style={activeTab === "active" ? Shadows.sm : {}}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: activeTab === "active" ? Colors.onSurface : Colors.onSurfaceVariant }}>
                  Active
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setActiveTab("past")}
                className={`flex-1 py-2 px-4 rounded items-center ${activeTab === "past" ? "bg-surface-container-lowest" : ""}`}
                style={activeTab === "past" ? Shadows.sm : {}}
              >
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: activeTab === "past" ? Colors.onSurface : Colors.onSurfaceVariant }}>
                  Past
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Booking cards */}
          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
          ) : (
            <View className="gap-4">
              {filteredBookings.map((booking) => (
                <View key={booking.id}>
                  <BookingCard
                    serviceType={booking.serviceCategory}
                    serviceIcon="sparkles"
                    title={booking.title}
                    description={booking.customerMessage || booking.description}
                    status={booking.status}
                    address={booking.address}
                    timeAgo=""
                    provider={null}
                    onPress={() => handleCardPress(booking)}
                  />
                  {/* Customer cancel button for cancellable states */}
                  {!isProvider && ["pending", "accepted", "en_route"].includes(booking.status) && (
                    <TouchableOpacity
                      onPress={() => handleCustomerCancel(booking.id, booking.status)}
                      className="mt-2 py-2 rounded-lg border border-error items-center"
                    >
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: Colors.error }}>
                        Cancel Order
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {filteredBookings.length === 0 && (
                <View className="items-center py-12">
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">
                    No {activeTab} {isProvider ? "jobs" : "orders"} yet.
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
