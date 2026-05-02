import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import AppHeader from "../../components/ui/AppHeader";
import ProviderCard from "../../components/ui/ProviderCard";
import BookingCard from "../../components/ui/BookingCard";
import { Colors } from "../../src/constants/theme";
import { MOCK_USER, PROVIDERS, BOOKINGS } from "../../src/constants/mockData";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("Electrician");
  
  const isProvider = user?.role === "provider";

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader avatarUrl={MOCK_USER.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          {/* Search + filter */}
          <View className="flex-row gap-2">
            <View className="flex-1 flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5">
              <Search size={20} color={Colors.outline} />
              <TextInput
                className="flex-1 ml-2 text-on-surface"
                style={{ fontFamily: "Inter", fontSize: 16 }}
                placeholder={isProvider ? "Search job requests..." : "Search electricians, plumbers..."}
                placeholderTextColor={Colors.outlineVariant}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <TouchableOpacity className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 items-center justify-center">
              <SlidersHorizontal size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          {isProvider ? (
            <>
              {/* Provider view - Show available jobs */}
              <View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
                  Available Jobs
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant mt-1">
                  Jobs matching your services
                </Text>
              </View>

              <View className="gap-4">
                {BOOKINGS.filter(booking => booking.status === "pending").map((booking) => (
                  <BookingCard
                    key={booking.id}
                    serviceType={booking.serviceType}
                    serviceIcon={booking.serviceIcon}
                    title={booking.title}
                    description={booking.description}
                    status={booking.status}
                    address={booking.address}
                    timeAgo={booking.timeAgo}
                    onPress={() => router.push({ pathname: "/job-detail", params: { id: booking.id } })}
                  />
                ))}
              </View>
            </>
          ) : (
            <>
              {/* Customer view - Show available providers */}
              <View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
                  12 Electricians near you
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant mt-1">
                  Available for immediate booking
                </Text>
              </View>

              {/* Provider cards */}
              <View className="gap-4">
                {PROVIDERS.map((provider) => (
                  <ProviderCard
                    key={provider.id}
                    name={provider.name}
                    specialty={provider.specialty}
                    rating={provider.rating}
                    jobsCompleted={provider.jobsCompleted}
                    available={provider.available}
                    avatarUrl={provider.avatarUrl}
                    onViewProfile={() => router.push({ pathname: "/provider-detail", params: { id: provider.id } })}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
