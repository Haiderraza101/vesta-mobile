import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles, Wrench, MapPin, Clock, ChevronRight, Radio, Zap } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { Colors, Shadows } from "../src/constants/theme";
import { INCOMING_JOBS, MOCK_USER } from "../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

const ICON_MAP: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  sparkles: Sparkles,
  zap: Zap,
  wrench: Wrench,
};

export default function ProviderDashboardScreen() {
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

            {/* Online/Offline toggle */}
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
            <View className="w-2.5 h-2.5 rounded-full bg-error animate-pulse" />
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
                  {/* Customer info row */}
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

                  {/* Service + title */}
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

                  {/* Payout + action */}
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
