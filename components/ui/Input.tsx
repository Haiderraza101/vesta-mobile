import React, { useState } from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from './Text';
import { cn } from '../../utils/utils';

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  error?: string;
}

export function Input({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  leftIcon, 
  rightIcon,
  className = '',
  style,
  error,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className={cn("mb-5", className)}>
      {label && (
        <Text weight="semibold" className="text-foreground mb-1.5 ml-1 text-sm">{label}</Text>
      )}
      <View
        className={cn(
          "flex-row items-center bg-white rounded-xl px-4 h-[56px] border",
          isFocused ? "border-brand" : "border-border",
          error ? "border-destructive" : ""
        )}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-foreground text-base"
          style={[{ fontFamily: 'Poppins' }, style]}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text variant="caption" className="text-destructive mt-1.5 ml-1">{error}</Text>
      )}
    </View>
  );
}
