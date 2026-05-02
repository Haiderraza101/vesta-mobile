import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import AppHeader from "../../components/ui/AppHeader";
import BookingCard from "../../components/ui/BookingCard";
import { Colors, Shadows } from "../../src/constants/theme";
import { MOCK_USER, BOOKINGS } from "../../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<"active" | "past">("active");

  const filteredBookings = activeTab === "active"
    ? BOOKINGS.filter((b) => b.status !== "completed")
    : BOOKINGS.filter((b) => b.status === "completed");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack avatarUrl={MOCK_USER.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          {/* Header + tabs */}
          <View className="gap-4">
            <View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface mb-1">
                My Bookings
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant">
                Manage your service requests and view history.
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
          <View className="gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                serviceType={booking.serviceType}
                serviceIcon={booking.serviceIcon}
                title={booking.title}
                description={booking.description}
                status={booking.status}
                address={booking.address}
                timeAgo={booking.timeAgo}
                provider={booking.provider}
              />
            ))}
            {filteredBookings.length === 0 && (
              <View className="items-center py-12">
                <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">
                  No {activeTab} bookings yet.
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
