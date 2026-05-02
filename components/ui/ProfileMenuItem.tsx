import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Colors } from "../../src/constants/theme";

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function ProfileMenuItem({ icon, title, subtitle, onPress }: ProfileMenuItemProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center gap-4 p-4"
    >
      <View className="w-10 h-10 rounded-full bg-surface-container items-center justify-center">
        {icon}
      </View>
      <View className="flex-1">
        <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
          {title}
        </Text>
        <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
          {subtitle}
        </Text>
      </View>
      <ChevronRight size={20} color={Colors.outlineVariant} />
    </TouchableOpacity>
  );
}
