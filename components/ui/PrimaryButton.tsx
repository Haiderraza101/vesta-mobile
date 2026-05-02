import React from "react";
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, View } from "react-native";
import { Colors } from "../../src/constants/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export default function PrimaryButton({
  title,
  onPress,
  variant = "primary",
  icon,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = true,
  style,
}: PrimaryButtonProps) {
  const baseClasses = "flex-row items-center justify-center py-3.5 rounded-xl";
  const variantClasses = {
    primary: "bg-secondary",
    secondary: "bg-surface-container-lowest border border-outline-variant",
    ghost: "bg-transparent",
    danger: "bg-error",
  };
  const textColor = {
    primary: Colors.onSecondary,
    secondary: Colors.secondary,
    ghost: Colors.secondary,
    danger: Colors.onError,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.85}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50" : ""}`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator color={textColor[variant]} size="small" />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28, color: textColor[variant] }}>
            {title}
          </Text>
          {iconRight}
        </View>
      )}
    </TouchableOpacity>
  );
}
