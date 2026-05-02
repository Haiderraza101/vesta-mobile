import React, { useState } from "react";
import { View, Text, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { Eye, EyeOff } from "lucide-react-native";
import { Colors } from "../../src/constants/theme";

interface InputFieldProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  isPassword?: boolean;
}

export default function InputField({ label, icon, isPassword = false, ...props }: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="gap-2">
      <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-surface-container-lowest border rounded-lg px-4 py-3 ${
          isFocused ? "border-secondary" : "border-outline-variant"
        }`}
      >
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 text-on-surface"
          style={{ fontFamily: "Inter", fontSize: 16 }}
          placeholderTextColor={Colors.outline}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
            {showPassword ? (
              <Eye size={20} color={Colors.outline} />
            ) : (
              <EyeOff size={20} color={Colors.outline} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
