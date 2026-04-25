import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from './Text';

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
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
  ...props
}: InputProps) {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text weight="bold" className="text-slate-700 mb-2 ml-1 text-sm">{label}</Text>
      )}
      <View className="flex-row items-center bg-slate-50 rounded-2xl px-5 h-[58px] border border-slate-100">
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={secureTextEntry}
          className="flex-1 text-slate-900 text-base font-medium"
          style={[{ fontFamily: 'Poppins' }, style]}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
    </View>
  );
}
