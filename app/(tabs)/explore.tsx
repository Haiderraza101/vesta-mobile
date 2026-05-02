import React, { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal } from "lucide-react-native";
import AppHeader from "../../components/ui/AppHeader";
import ProviderCard from "../../components/ui/ProviderCard";
import BookingCard from "../../components/ui/BookingCard";
import { useAuth } from "../../context/AuthContext";
import { getProviders, subscribeToProviderJobs, ProviderProfile, Booking } from "../../services/db";
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
      // Real-time: provider only sees their pending jobs
      const unsub = subscribeToProviderJobs(user.uid, (data) => {
        setProviderJobs(data.filter((j) => j.status === "pending"));
        setLoading(false);
      });
      return () => unsub();
    } else {
      // Customer: fetch available providers (optionally by category)
      const fetchProviders = async () => {
        try {
          const cat = searchQuery.trim().toLowerCase() || undefined;
          const data = await getProviders(cat);
          setProviders(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      };
      fetchProviders();
    }
  }, [profile, user]);

  // Re-search when customer changes query
  const handleSearch = async () => {
    if (isProvider) return;
    setLoading(true);
    try {
      const cat = searchQuery.trim().toLowerCase() || undefined;
      const data = await getProviders(cat);
      setProviders(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          <View className="flex-row gap-2">
            <View className="flex-1 flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5">
              <Search size={20} color={Colors.outline} />
              <TextInput className="flex-1 ml-2 text-on-surface" style={{ fontFamily: "Inter", fontSize: 16 }}
                placeholder={isProvider ? "Search job requests..." : "Search electricians, plumbers..."}
                placeholderTextColor={Colors.outlineVariant} value={searchQuery} onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch} returnKeyType="search"
              />
            </View>
            <TouchableOpacity onPress={handleSearch} className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 items-center justify-center">
              <SlidersHorizontal size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View className="py-12 items-center"><ActivityIndicator size="large" color={Colors.secondary} /></View>
          ) : isProvider ? (
            <>
              <View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
                  Available Jobs
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant mt-1">
                  {providerJobs.length} pending request{providerJobs.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <View className="gap-4">
                {providerJobs.map((job) => (
                  <BookingCard key={job.id} serviceType={job.serviceCategory} serviceIcon="sparkles"
                    title={job.title} description={job.customerMessage || job.description}
                    status={job.status} address={job.address} timeAgo=""
                    onPress={() => router.push({ pathname: "/job-detail", params: { id: job.id } })}
                  />
                ))}
                {providerJobs.length === 0 && (
                  <View className="items-center py-12">
                    <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">No available jobs right now.</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              <View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
                  {providers.length} Provider{providers.length !== 1 ? "s" : ""} near you
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant mt-1">
                  Available for immediate booking
                </Text>
              </View>
              <View className="gap-4">
                {providers.map((p) => (
                  <ProviderCard key={p.providerId} name={p.fullName} specialty={p.specialty}
                    rating={p.rating} jobsCompleted={p.jobsCompleted} available={p.isAvailable}
                    avatarUrl={p.avatarUrl || ""} 
                    onViewProfile={() => router.push({ pathname: "/provider-detail", params: { id: p.providerId } })}
                  />
                ))}
                {providers.length === 0 && (
                  <View className="items-center py-12">
                    <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">No providers found.</Text>
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
