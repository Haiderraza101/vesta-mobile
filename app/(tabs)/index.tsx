import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { RotateCcw, Calendar, Sparkles, Wrench, MapPin, Clock, Radio, Zap } from "lucide-react-native";
import AppHeader from "../../components/ui/AppHeader";
import ServiceCard from "../../components/ui/ServiceCard";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../context/AuthContext";
import { Colors, Shadows } from "../../src/constants/theme";
import { MOCK_USER, SERVICES, RECENT_ACTIVITY, PROMO_BANNER, INCOMING_JOBS } from "../../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  sparkles: Sparkles,
  zap: Zap,
  wrench: Wrench,
};

/* ────────────────────────────────────────────
   PROVIDER DASHBOARD
   ──────────────────────────────────────────── */
function ProviderDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader avatarUrl={MOCK_USER.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-6">
          {/* Greeting + status toggle */}
          <View className="flex-row justify-between items-start">
            <View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface">
                Hey, Marcus!
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface-variant">
                You have {INCOMING_JOBS.length} new requests.
              </Text>
            </View>
            <View
              className="flex-row items-center gap-2 px-3 py-2 rounded-full border"
              style={{
                backgroundColor: isOnline ? "#ecfdf5" : Colors.surfaceContainer,
                borderColor: isOnline ? "#6ee7b7" : Colors.outlineVariant,
              }}
            >
              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isOnline ? Colors.emerald500 : Colors.outline }} />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: isOnline ? "#065f46" : Colors.onSurfaceVariant }}>
                {isOnline ? "Online" : "Offline"}
              </Text>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: Colors.outlineVariant, true: "#6ee7b7" }}
                thumbColor={isOnline ? Colors.emerald600 : Colors.outline}
                style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
              />
            </View>
          </View>

          {/* Incoming jobs header */}
          <View className="flex-row items-center gap-2">
            <Radio size={20} color={Colors.error} />
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-surface">
              Incoming Job Feed
            </Text>
            <View className="w-2.5 h-2.5 rounded-full bg-error" />
          </View>

          {/* Job cards */}
          <View className="gap-4">
            {INCOMING_JOBS.map((job) => {
              const ServiceIcon = ICON_MAP[job.serviceIcon] || Sparkles;
              return (
                <TouchableOpacity
                  key={job.id}
                  onPress={() => router.push("/job-detail")}
                  activeOpacity={0.9}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 gap-3"
                  style={Shadows.md}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-full overflow-hidden border border-outline-variant">
                      <Image source={{ uri: job.customerAvatarUrl }} className="w-full h-full" resizeMode="cover" />
                    </View>
                    <View className="flex-1">
                      <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface">
                        {job.customerName}
                      </Text>
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <MapPin size={14} color={Colors.onSurfaceVariant} />
                        <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                          {job.location}
                        </Text>
                      </View>
                    </View>
                    {job.isUrgent && <StatusBadge status="pending" label="ASAP" />}
                    {!job.isUrgent && (
                      <View className="flex-row items-center gap-1">
                        <Clock size={14} color={Colors.onSurfaceVariant} />
                        <Text style={{ fontFamily: "Inter-Medium", fontSize: 12 }} className="text-on-surface-variant">{job.urgency}</Text>
                      </View>
                    )}
                  </View>
                  <View className="gap-1">
                    <View className="flex-row items-center gap-1 self-start bg-surface-container px-2 py-1 rounded">
                      <ServiceIcon size={14} color={Colors.onSurface} />
                      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-surface">
                        {job.serviceType}
                      </Text>
                    </View>
                    <Text style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 22 }} className="text-on-surface-variant" numberOfLines={2}>
                      {job.description}
                    </Text>
                  </View>
                  <View className="flex-row items-center justify-between pt-2 border-t border-outline-variant">
                    <View>
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 0.5 }} className="text-on-surface-variant uppercase">
                        Payout
                      </Text>
                      <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
                        {job.payout}
                      </Text>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity className="px-5 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest">
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-surface">
                          Decline
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => router.push("/active-job")}
                        className="px-5 py-2.5 rounded-lg"
                        style={{ backgroundColor: Colors.blue600 }}
                      >
                        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: "#ffffff" }}>
                          Accept
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ────────────────────────────────────────────
   CUSTOMER DASHBOARD
   ──────────────────────────────────────────── */
function CustomerDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader avatarUrl={MOCK_USER.avatarUrl} onAvatarPress={() => router.push("/(tabs)/profile")} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-8">
          {/* Greeting */}
          <View className="gap-1">
            <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface">
              Good Morning, <Text style={{ color: Colors.secondary }}>Alex!</Text>
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface-variant">
              What do you need help with today?
            </Text>
          </View>

          {/* Promo Banner */}
          <View className="rounded-xl overflow-hidden h-60" style={Shadows.md}>
            <Image source={{ uri: PROMO_BANNER.imageUrl }} className="absolute w-full h-full" resizeMode="cover" style={{ opacity: 0.9 }} />
            <LinearGradient colors={["#dae2fd", "#dae2fdee", "transparent"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} className="absolute w-2/3 h-full" />
            <View className="relative p-4 justify-center h-full" style={{ maxWidth: "75%" }}>
              <View className="bg-secondary-fixed px-2 py-1 rounded self-start mb-2">
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 10, letterSpacing: 1 }} className="text-on-secondary-fixed uppercase">
                  {PROMO_BANNER.tag}
                </Text>
              </View>
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 26, lineHeight: 31, letterSpacing: -0.5 }} className="text-on-primary-fixed mb-1">
                {PROMO_BANNER.title}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 14, lineHeight: 21 }} className="text-on-primary-fixed-variant mb-3" numberOfLines={2}>
                {PROMO_BANNER.description}
              </Text>
              <TouchableOpacity className="bg-primary px-6 py-3 rounded-lg self-start" style={Shadows.sm}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onPrimary }}>
                  {PROMO_BANNER.cta}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Our Services */}
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
                Our Services
              </Text>
              <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>
                  Browse all
                </Text>
              </TouchableOpacity>
            </View>
            <View className="gap-2">
              <ServiceCard
                name={SERVICES[0].name}
                icon={SERVICES[0].icon}
                description={SERVICES[0].description}
                featured
                onPress={() => router.push("/(tabs)/explore")}
              />
              <View className="flex-row gap-2">
                {SERVICES.slice(1, 3).map((s) => (
                  <View key={s.id} className="flex-1">
                    <ServiceCard name={s.name} icon={s.icon} onPress={() => router.push("/(tabs)/explore")} />
                  </View>
                ))}
              </View>
              <View className="flex-row gap-2">
                {SERVICES.slice(3, 5).map((s) => (
                  <View key={s.id} className="flex-1">
                    <ServiceCard name={s.name} icon={s.icon} onPress={() => router.push("/(tabs)/explore")} />
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View className="gap-4">
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
              Recent Activity
            </Text>
            <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-3" style={Shadows.sm}>
              <View className="flex-row items-start gap-3">
                <View className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant bg-surface-container">
                  <Image source={{ uri: RECENT_ACTIVITY.providerAvatarUrl }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <View className="bg-surface-variant px-2 py-0.5 rounded">
                      <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 0.5 }} className="text-on-surface-variant uppercase">
                        {RECENT_ACTIVITY.status}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <Calendar size={13} color={Colors.onSurfaceVariant} />
                      <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                        {RECENT_ACTIVITY.date}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface">
                    {RECENT_ACTIVITY.title}
                  </Text>
                  <Text style={{ fontFamily: "Inter", fontSize: 15 }} className="text-on-surface-variant mt-0.5">
                    with {RECENT_ACTIVITY.providerName}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between pt-2 border-t border-outline-variant">
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24 }} className="text-on-surface">
                  {RECENT_ACTIVITY.price}
                </Text>
                <TouchableOpacity className="flex-row items-center gap-1.5 bg-surface-container-lowest border border-outline-variant px-4 py-2 rounded-lg">
                  <RotateCcw size={15} color={Colors.secondary} />
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: Colors.secondary }}>
                    Rebook
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ────────────────────────────────────────────
   ROLE-AWARE HOME TAB
   ──────────────────────────────────────────── */
export default function HomeTab() {
  const { user } = useAuth();
  return user?.role === "provider" ? <ProviderDashboard /> : <CustomerDashboard />;
}
