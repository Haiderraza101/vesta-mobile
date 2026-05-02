import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Colors } from "../../src/constants/theme";

interface ChipSelectorProps {
  label: string;
  icon?: React.ReactNode;
  selected: boolean;
  onPress: () => void;
}

export default function ChipSelector({ label, icon, selected, onPress }: ChipSelectorProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        className={`flex-row items-center px-4 py-2 rounded-full border ${
          selected
            ? "border-transparent"
            : "bg-surface-container-lowest border-outline-variant"
        }`}
        style={selected ? { backgroundColor: Colors.blue600 } : {}}
      >
        {icon && <View className="mr-1">{icon}</View>}
        <Text
          style={{
            fontFamily: "Inter-Medium",
            fontSize: 12,
            letterSpacing: 0.48,
            color: selected ? "#ffffff" : Colors.onSurfaceVariant,
          }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
