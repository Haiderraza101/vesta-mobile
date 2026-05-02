import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import AppHeader from "../../components/ui/AppHeader";
import ProviderCard from "../../components/ui/ProviderCard";
import BookingCard from "../../components/ui/BookingCard";
import { useAuth } from "../../context/AuthContext";
import {
  getProviders,
  subscribeToProviderJobs,
  ProviderProfile,
  Booking,
} from "../../services/db";
import { Colors } from "../../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExploreScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<ProviderProfile[]>([]);
  const [providerJobs, setProviderJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const isProvider = profile?.role === "provider";

  useEffect(() => {
    if (isProvider && user) {
      // Real-time subscription: provider sees ONLY jobs sent directly to them
      setLoading(true);
      const unsubscribe = subscribeToProviderJobs(user.uid, (jobs) => {
        // Show only pending jobs on the explore/jobs tab
        setProviderJobs(jobs.filter((j) => j.status === "pending"));
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // One-shot fetch for customer: get all available providers
      fetchProviders();
    }
  }, [user, isProvider]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await getProviders();
      setProviders(data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search query (client-side)
  const filteredProviders = searchQuery.trim()
    ? providers.filter(
        (p) =>
          p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.serviceCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.specialty.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : providers;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader />

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

          {loading ? (
            <View className="py-12 items-center">
              <ActivityIndicator size="large" color={Colors.secondary} />
            </View>
          ) : isProvider ? (
            <>
              {/* Provider view - Show pending jobs sent to them */}
              <View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
                  Incoming Requests
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant mt-1">
                  {providerJobs.length} pending {providerJobs.length === 1 ? "job" : "jobs"}
                </Text>
              </View>

              <View className="gap-4">
                {providerJobs.map((job) => (
                  <BookingCard
                    key={job.id}
                    serviceType={job.serviceCategory}
                    serviceIcon="sparkles"
                    title={job.title}
                    description={job.customerMessage || job.description}
                    status={job.status}
                    address={job.address}
                    timeAgo=""
                    onPress={() => router.push({ pathname: "/job-detail", params: { id: job.id } })}
                  />
                ))}
                {providerJobs.length === 0 && (
                  <View className="items-center py-12">
                    <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">
                      No pending requests right now.
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              {/* Customer view - Show available providers */}
              <View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
                  {filteredProviders.length} Providers near you
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant mt-1">
                  Available for immediate booking
                </Text>
              </View>

              <View className="gap-4">
                {filteredProviders.map((provider) => (
                  <ProviderCard
                    key={provider.providerId}
                    name={provider.fullName}
                    specialty={provider.specialty}
                    rating={provider.rating}
                    jobsCompleted={provider.jobsCompleted}
                    available={provider.isAvailable}
                    avatarUrl={provider.avatarUrl || "https://via.placeholder.com/100"}
                    onViewProfile={() => router.push({ pathname: "/provider-detail", params: { id: provider.providerId } })}
                  />
                ))}
                {filteredProviders.length === 0 && (
                  <View className="items-center py-12">
                    <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">
                      No providers found.
                    </Text>
                  </View>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
