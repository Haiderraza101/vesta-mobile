import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Phone, MessageCircle, MapPin, Navigation, CheckCircle } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import ProgressStepper from "../components/ui/ProgressStepper";
import { Colors, Shadows } from "../src/constants/theme";
import { ACTIVE_JOB, MOCK_USER } from "../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ActiveJobScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack avatarUrl={MOCK_USER.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4 gap-4">
          {/* In Progress Banner */}
          <View className="bg-emerald-50 border rounded-lg p-4 flex-row items-center gap-2" style={{ borderColor: "#6ee7b7", backgroundColor: "#ecfdf5" }}>
            <View className="w-2 h-2 rounded-full bg-emerald-500" style={{ backgroundColor: Colors.emerald500 }} />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28, color: "#065f46" }}>
              In Progress
            </Text>
          </View>

          {/* Customer Contact Card */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-4" style={Shadows.md}>
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full overflow-hidden border border-outline-variant">
                <Image source={{ uri: ACTIVE_JOB.customer.avatarUrl }} className="w-full h-full" resizeMode="cover" />
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20, lineHeight: 28 }} className="text-on-surface">
                  {ACTIVE_JOB.customer.name}
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant mt-1">
                  {ACTIVE_JOB.customer.service}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg border border-secondary">
                <Phone size={16} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg border border-secondary">
                <MessageCircle size={16} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Location Card */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-4" style={Shadows.sm}>
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20, lineHeight: 28 }} className="text-on-surface">
                Location
              </Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Navigation size={14} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48, color: Colors.secondary }}>
                  Open in Maps
                </Text>
              </TouchableOpacity>
            </View>

            {/* Map placeholder */}
            <View className="w-full h-36 rounded-lg bg-surface-container-low border border-outline-variant items-center justify-center overflow-hidden">
              <MapPin size={28} color={Colors.secondary} />
              <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant mt-1">
                Map Preview
              </Text>
            </View>

            <View className="flex-row items-start gap-2">
              <MapPin size={20} color={Colors.outline} />
              <View>
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
                  {ACTIVE_JOB.address.street}
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant mt-1">
                  {ACTIVE_JOB.address.detail}
                </Text>
              </View>
            </View>
          </View>

          {/* Job Progress */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4" style={Shadows.sm}>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20, lineHeight: 28 }} className="text-on-surface mb-2">
              Job Progress
            </Text>
            <ProgressStepper steps={ACTIVE_JOB.steps} />
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-4" style={Shadows.md}>
        <TouchableOpacity
          onPress={() => router.push("/job-completed")}
          className="w-full bg-primary py-4 rounded-xl flex-row items-center justify-center gap-2"
          activeOpacity={0.85}
        >
          <CheckCircle size={20} color={Colors.onPrimary} />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onPrimary }}>
            Mark as Completed
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
