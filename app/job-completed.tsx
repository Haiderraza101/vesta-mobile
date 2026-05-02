import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { CheckCircle, Briefcase, ClipboardCheck } from "lucide-react-native";
import { Colors, Shadows } from "../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobCompletedScreen() {
  const router = useRouter();
  const { id, price } = useLocalSearchParams<{ id: string; price: string }>();
  const earnings = price ? `$${parseFloat(price).toFixed(0)}` : "$150";

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-4 relative">
        <View className="absolute rounded-full opacity-20" style={{ width: 300, height: 300, top: -80, left: -80, backgroundColor: Colors.primaryFixed }} />
        <View className="absolute rounded-full opacity-20" style={{ width: 300, height: 300, bottom: -80, right: -80, backgroundColor: Colors.secondaryFixed }} />

        <View className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-8 items-center" style={Shadows.lg}>
          <View className="w-24 h-24 rounded-full items-center justify-center mb-6 border" style={{ backgroundColor: Colors.secondaryFixed, borderColor: Colors.secondaryFixedDim, ...Shadows.sm }}>
            <CheckCircle size={48} color={Colors.secondary} fill={`${Colors.secondary}20`} />
          </View>

          <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface mb-4 text-center">
            Great job!
          </Text>

          <View className="w-full bg-surface-container-lowest rounded-lg border border-outline-variant p-6 mb-8 gap-2 items-center" style={Shadows.sm}>
            <View className="flex-row items-center gap-2">
              <ClipboardCheck size={20} color={Colors.onSurfaceVariant} />
              <Text style={{ fontFamily: "Inter", fontSize: 18 }} className="text-on-surface-variant">
                Job completed.
              </Text>
            </View>
            <View className="h-px w-full bg-surface-variant my-2" />
            <View className="items-center gap-1">
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface-variant uppercase">
                Total Earnings
              </Text>
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, color: Colors.secondary }}>
                You've earned {earnings}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="w-full py-4 rounded-lg flex-row items-center justify-center gap-2"
            style={{ backgroundColor: Colors.secondary, ...Shadows.sm }}
            activeOpacity={0.85}
          >
            <Briefcase size={18} color={Colors.onSecondary} />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onSecondary }}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
