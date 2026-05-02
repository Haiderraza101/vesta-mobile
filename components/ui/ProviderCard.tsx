import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Star, CheckCircle2 } from "lucide-react-native";
import { Colors, Shadows } from "../../src/constants/theme";

interface ProviderCardProps {
  name: string;
  specialty: string;
  rating: number;
  jobsCompleted: number;
  available: boolean;
  avatarUrl: string;
  onViewProfile: () => void;
}

export default function ProviderCard({
  name,
  specialty,
  rating,
  jobsCompleted,
  available,
  avatarUrl,
  onViewProfile,
}: ProviderCardProps) {
  return (
    <View
      className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 gap-3"
      style={Shadows.sm}
    >
      {/* Top row: avatar + info + rating */}
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-3">
          <View className="relative">
            <View className="w-14 h-14 rounded-full overflow-hidden border-2 border-surface bg-surface-container">
              <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
            </View>
            {available && (
              <View
                className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-surface-container-lowest"
                style={{ backgroundColor: Colors.emerald500 }}
              />
            )}
          </View>
          <View>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface">
              {name}
            </Text>
            <View className="mt-1 bg-secondary-fixed px-2 py-0.5 rounded self-start">
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 0.4 }} className="text-on-secondary-fixed">
                {specialty}
              </Text>
            </View>
          </View>
        </View>
        <View className="flex-row items-center gap-1 bg-tertiary-fixed px-2 py-1 rounded-full">
          <Star size={12} fill={Colors.onTertiaryContainer} color={Colors.onTertiaryContainer} />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-tertiary-container">
            {rating}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-outline-variant opacity-30" />

      {/* Bottom row: jobs + CTA */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-1">
          <CheckCircle2 size={16} color={Colors.onSurfaceVariant} />
          <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
            {jobsCompleted}+ Jobs Completed
          </Text>
        </View>
        <TouchableOpacity
          onPress={onViewProfile}
          activeOpacity={0.85}
          className="bg-secondary px-4 py-2 rounded-lg"
        >
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: Colors.onSecondary }}>
            View Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
