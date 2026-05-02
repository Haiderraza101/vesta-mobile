import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sparkles, Zap, Wrench, Hammer, Paintbrush } from "lucide-react-native";
import { Colors, Shadows } from "../../src/constants/theme";

const ICON_MAP = {
  sparkles: Sparkles,
  zap: Zap,
  wrench: Wrench,
  hammer: Hammer,
  paintbrush: Paintbrush,
} as const;

interface ServiceCardProps {
  name: string;
  icon: keyof typeof ICON_MAP;
  description?: string;
  featured?: boolean;
  onPress?: () => void;
}

export default function ServiceCard({ name, icon, description, featured = false, onPress }: ServiceCardProps) {
  const IconComponent = ICON_MAP[icon] || Sparkles;

  if (featured) {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.9}
        className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant"
        style={{ ...Shadows.md, minHeight: 180 }}
      >
        <View className="w-14 h-14 rounded-full bg-secondary-fixed items-center justify-center mb-3">
          <IconComponent size={24} color={Colors.onSecondaryFixed} />
        </View>
        <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-surface mb-1">
          {name}
        </Text>
        {description && (
          <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant">
            {description}
          </Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant items-start gap-3"
      style={Shadows.sm}
    >
      <View className="w-12 h-12 rounded-full bg-surface-container items-center justify-center">
        <IconComponent size={22} color={Colors.onSurfaceVariant} />
      </View>
      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16, lineHeight: 24 }} className="text-on-surface">
        {name}
      </Text>
    </TouchableOpacity>
  );
}
