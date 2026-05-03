import React, { useState } from 'react';
import { View, TextInput, TextInputProps, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  isPassword?: boolean;
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
  isPassword,
  style,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isActuallySecure = isPassword ? !showPassword : secureTextEntry;

  return (
    <View className={`mb-5 ${className}`}>
      {label && (
        <Text weight="bold" className="text-slate-800 mb-2.5 ml-1 text-[13px] uppercase tracking-widest">{label}</Text>
      )}
      <View 
        className={`flex-row items-center bg-white rounded-2xl px-5 h-[56px] border ${
          isFocused ? 'border-primary' : 'border-slate-100'
        }`}
      >
        {leftIcon && <View className="mr-3.5 opacity-80">{leftIcon}</View>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isActuallySecure}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 text-slate-900 text-base font-medium"
          style={[{ fontFamily: 'Poppins' }, style]}
          selectionColor="#4C6FFF"
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-3 p-1">
            {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
          </TouchableOpacity>
        ) : rightIcon ? (
          <View className="ml-3">{rightIcon}</View>
        ) : null}
      </View>
    </View>
  );
}
