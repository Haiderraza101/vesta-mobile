import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Star, Calendar, MapPin, Heart, Sparkles, Home, MessageCircle } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import { Colors, Shadows } from "../src/constants/theme";
import { JOB_DETAIL, MOCK_USER } from "../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

const REQ_ICONS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  heart: Heart,
  sparkles: Sparkles,
  home: Home,
};

export default function JobDetailScreen() {
  const router = useRouter();
  const job = JOB_DETAIL;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack avatarUrl={MOCK_USER.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4 gap-6">
          {/* Status + title */}
          <View className="gap-2">
            <View className="flex-row items-center gap-2 self-start bg-tertiary-fixed px-3 py-1.5 rounded-full">
              <View className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container" />
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-tertiary-fixed uppercase">
                {job.status}
              </Text>
            </View>
            <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface">
              {job.title}
            </Text>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-primary">
              {job.price}{" "}
              <Text style={{ fontFamily: "Inter", fontSize: 16, fontWeight: "400" }} className="text-on-surface-variant">
                Est. Total
              </Text>
            </Text>
          </View>

          {/* Customer card */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex-row items-center gap-4" style={Shadows.sm}>
            <View className="w-16 h-16 rounded-full overflow-hidden border border-surface-variant">
              <Image source={{ uri: job.customer.avatarUrl }} className="w-full h-full" resizeMode="cover" />
            </View>
            <View className="flex-1">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">
                {job.customer.name}
              </Text>
              <View className="flex-row items-center gap-1 mt-1">
                <Star size={16} fill={Colors.secondary} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-on-surface">
                  {job.customer.rating}
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                  ({job.customer.reviews} reviews)
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-surface-container-low items-center justify-center">
              <MessageCircle size={20} color={Colors.secondary} />
            </TouchableOpacity>
          </View>

          {/* Details bento grid */}
          <View className="gap-3">
            {/* Date & Time */}
            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-8 h-8 rounded-full bg-primary-fixed items-center justify-center">
                  <Calendar size={16} color={Colors.onPrimaryFixed} />
                </View>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant">
                  Date & Time
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface ml-11">
                {job.date}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant ml-11">
                {job.time}
              </Text>
            </View>

            {/* Location */}
            <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
              <View className="flex-row items-center gap-3 mb-2">
                <View className="w-8 h-8 rounded-full bg-primary-fixed items-center justify-center">
                  <MapPin size={16} color={Colors.onPrimaryFixed} />
                </View>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant">
                  Location
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface ml-11">
                {job.address}
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant ml-11">
                {job.city}
              </Text>
              <View className="mt-2 ml-11 w-full h-24 rounded-lg bg-surface-variant overflow-hidden border border-outline-variant">
                <View className="w-full h-full items-center justify-center bg-surface-container-low">
                  <MapPin size={24} color={Colors.secondary} />
                  <Text style={{ fontFamily: "Inter", fontSize: 12 }} className="text-on-surface-variant mt-1">Map Preview</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View className="gap-2">
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20, lineHeight: 28 }} className="text-on-surface pb-2 border-b border-outline-variant">
              Job Description
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 26 }} className="text-on-surface-variant">
              {job.description}
            </Text>
          </View>

          {/* Requirements */}
          <View className="gap-2">
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant uppercase">
              Requirements
            </Text>
            <View className="flex-row flex-wrap gap-2 mt-1">
              {job.requirements.map((req, i) => {
                const Icon = REQ_ICONS[req.icon] || Heart;
                return (
                  <View key={i} className="flex-row items-center gap-1 bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant">
                    <Icon size={14} color={Colors.onSurface} />
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface">
                      {req.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed bottom action bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant px-4 py-4" style={Shadows.md}>
        <View className="flex-row gap-3">
          <TouchableOpacity onPress={() => router.back()} className="flex-1 h-12 rounded-xl border border-primary bg-surface-container-lowest items-center justify-center" activeOpacity={0.8}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-primary">
              Decline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/active-job")} className="flex-1 h-12 rounded-xl bg-primary items-center justify-center" style={Shadows.sm} activeOpacity={0.85}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onPrimary }}>
              Accept Job
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
