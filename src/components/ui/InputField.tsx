import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../../utils/theme';

interface InputFieldProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  isPassword,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-slate-700 mb-1.5 ml-1">
        {label}
      </Text>
      <View
        className={`flex-row items-center bg-slate-50 border rounded-2xl px-4 h-14 ${
          error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-slate-200'
        }`}
      >
        <TextInput
          className="flex-1 text-slate-900 text-base"
          placeholderTextColor={theme.colors.muted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.muted} />
            ) : (
              <Eye size={20} color={theme.colors.muted} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text className="text-red-500 text-xs mt-1 ml-1 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
};
