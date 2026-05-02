import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Switch, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { RotateCcw, Calendar, Sparkles, Wrench, MapPin, Radio, Zap } from "lucide-react-native";
import AppHeader from "../../components/ui/AppHeader";
import ServiceCard from "../../components/ui/ServiceCard";
import StatusBadge from "../../components/ui/StatusBadge";
import BookingCard from "../../components/ui/BookingCard";
import { useAuth } from "../../context/AuthContext";
import { subscribeToProviderJobs, toggleProviderAvailability, updateOrderStatus, Booking } from "../../services/db";
import { Colors, Shadows } from "../../src/constants/theme";
import { SERVICES, PROMO_BANNER } from "../../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

/* ════════════════════════════════════════════
   PROVIDER DASHBOARD (Real-time)
   ════════════════════════════════════════════ */
function ProviderDashboard() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [jobs, setJobs] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Real-time listener: provider sees ONLY their jobs
  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToProviderJobs(user.uid, (data) => {
      setJobs(data);
      setLoading(false);
    });
    return () => unsub();
  }, [user]);

  const handleToggleOnline = async (val: boolean) => {
    setIsOnline(val);
    if (user) await toggleProviderAvailability(user.uid, val);
  };

  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const activeJobs = jobs.filter((j) => ["accepted", "en_route", "in_progress"].includes(j.status));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-6">
          {/* Greeting + Online toggle */}
          <View className="flex-row justify-between items-start">
            <View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface">
                Hey, {profile?.fullName?.split(" ")[0] || "Provider"}!
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface-variant">
                {pendingJobs.length} new request{pendingJobs.length !== 1 ? "s" : ""}.
              </Text>
            </View>
            <View
              className="flex-row items-center gap-2 px-3 py-2 rounded-full border"
              style={{ backgroundColor: isOnline ? "#ecfdf5" : Colors.surfaceContainer, borderColor: isOnline ? "#6ee7b7" : Colors.outlineVariant }}
            >
              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isOnline ? Colors.emerald500 : Colors.outline }} />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: isOnline ? "#065f46" : Colors.onSurfaceVariant }}>
                {isOnline ? "Online" : "Offline"}
              </Text>
              <Switch value={isOnline} onValueChange={handleToggleOnline}
                trackColor={{ false: Colors.outlineVariant, true: "#6ee7b7" }}
                thumbColor={isOnline ? Colors.emerald600 : Colors.outline}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </View>
          </View>

          {/* Active jobs section */}
          {activeJobs.length > 0 && (
            <View className="gap-3">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
                Active Jobs ({activeJobs.length})
              </Text>
              {activeJobs.map((job) => (
                <BookingCard key={job.id} serviceType={job.serviceCategory} serviceIcon="sparkles"
                  title={job.title} description={job.customerMessage || job.description}
                  status={job.status} address={job.address} timeAgo=""
                  onPress={() => router.push({ pathname: "/active-job", params: { id: job.id } })}
                />
              ))}
            </View>
          )}

          {/* Incoming jobs */}
          <View className="flex-row items-center gap-2">
            <Radio size={20} color={Colors.error} />
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-surface">
              Incoming Requests
            </Text>
            {pendingJobs.length > 0 && <View className="w-2.5 h-2.5 rounded-full bg-error" />}
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={Colors.secondary} />
          ) : pendingJobs.length === 0 ? (
            <View className="items-center py-8">
              <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">No pending requests right now.</Text>
            </View>
          ) : (
            <View className="gap-4">
              {pendingJobs.map((job) => (
                <View key={job.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 gap-3" style={Shadows.md}>
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-full bg-secondary-fixed items-center justify-center border border-outline-variant">
                      <Text style={{ fontFamily: "Manrope-Bold", fontSize: 18, color: Colors.secondary }}>
                        {(job.customerName || "C").charAt(0)}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface">{job.customerName}</Text>
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <MapPin size={14} color={Colors.onSurfaceVariant} />
                        <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">{job.address || "No address"}</Text>
                      </View>
                    </View>
                    <StatusBadge status="pending" />
                  </View>
                  <View className="gap-1">
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 15 }} className="text-on-surface">{job.title}</Text>
                    <Text style={{ fontFamily: "Inter", fontSize: 14, lineHeight: 22 }} className="text-on-surface-variant" numberOfLines={2}>
                      "{job.customerMessage || job.description}"
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between pt-2 border-t border-outline-variant">
                    <View>
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 0.5 }} className="text-on-surface-variant uppercase">Payout</Text>
                      <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">${job.price?.toFixed(0) || "0"}</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity onPress={() => updateOrderStatus(job.id, "declined")}
                        className="px-5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest">
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-surface">Decline</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { updateOrderStatus(job.id, "accepted"); router.push({ pathname: "/active-job", params: { id: job.id } }); }}
                        className="px-5 py-2.5 rounded-lg" style={{ backgroundColor: Colors.blue600 }}>
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#ffffff" }}>Accept</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ════════════════════════════════════════════
   CUSTOMER DASHBOARD
   ════════════════════════════════════════════ */
function CustomerDashboard() {
  const router = useRouter();
  const { profile } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader onAvatarPress={() => router.push("/(tabs)/profile")} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-8">
          <View className="gap-1">
            <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface">
              Good Morning, <Text style={{ color: Colors.secondary }}>{profile?.fullName?.split(" ")[0] || "User"}!</Text>
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface-variant">
              What do you need help with today?
            </Text>
          </View>

          {/* Promo Banner */}
          <View className="rounded-xl overflow-hidden h-60" style={Shadows.md}>
            <LinearGradient colors={["#dae2fd", "#c7d2fe", "#a5b4fc"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="absolute w-full h-full" />
            <View className="relative p-4 justify-center h-full" style={{ maxWidth: "85%" }}>
              <View className="bg-secondary-fixed px-2 py-1 rounded self-start mb-2">
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, letterSpacing: 1 }} className="text-on-secondary-fixed uppercase">{PROMO_BANNER.tag}</Text>
              </View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 26, lineHeight: 31, letterSpacing: -0.5 }} className="text-on-surface mb-1">{PROMO_BANNER.title}</Text>
              <Text style={{ fontFamily: "Inter", fontSize: 14, lineHeight: 21 }} className="text-on-surface-variant mb-3" numberOfLines={2}>{PROMO_BANNER.description}</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/explore")} className="bg-primary px-6 py-3 rounded-lg self-start" style={Shadows.sm}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onPrimary }}>{PROMO_BANNER.cta}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Services */}
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">Our Services</Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Browse all</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-2">
              <ServiceCard name={SERVICES[0].name} icon={SERVICES[0].icon} description={SERVICES[0].description} featured onPress={() => router.push("/(tabs)/explore")} />
              <View className="flex-row gap-2">
                {SERVICES.slice(1, 3).map((s) => (<View key={s.id} className="flex-1"><ServiceCard name={s.name} icon={s.icon} onPress={() => router.push("/(tabs)/explore")} /></View>))}
              </View>
              <View className="flex-row gap-2">
                {SERVICES.slice(3, 5).map((s) => (<View key={s.id} className="flex-1"><ServiceCard name={s.name} icon={s.icon} onPress={() => router.push("/(tabs)/explore")} /></View>))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ════════════════════════════════════════════ */
export default function HomeTab() {
  const { profile } = useAuth();
  return profile?.role === "provider" ? <ProviderDashboard /> : <CustomerDashboard />;
}
