import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Text } from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'white';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  style?: any;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '',
  style,
  iconLeft,
  iconRight
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-2xl";
  
  const variants = {
    primary: "bg-[#4C6FFF]",
    secondary: "bg-slate-900",
    outline: "bg-transparent border-[1.5px] border-slate-200",
    ghost: "bg-transparent",
    destructive: "bg-rose-500",
    white: "bg-white shadow-sm shadow-slate-200",
  };

  const sizes = {
    sm: "px-5 py-3",
    md: "px-7 py-4",
    lg: "px-9 py-5",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-slate-700",
    ghost: "text-slate-600",
    destructive: "text-white",
    white: "text-slate-900",
  };

  const textSizes = {
    sm: "text-[13px] tracking-wide",
    md: "text-[15px] tracking-wide",
    lg: "text-[17px] tracking-wide",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={style}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-40' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'white' ? '#4C6FFF' : 'white'} />
      ) : (
        <View className="flex-row items-center justify-center">
          {iconLeft && <View className="mr-2.5">{iconLeft}</View>}
          <Text weight="bold" className={`${textColors[variant]} ${textSizes[size]}`}>
            {title}
          </Text>
          {iconRight && <View className="ml-2.5">{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
}
