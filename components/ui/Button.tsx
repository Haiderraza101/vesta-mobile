import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Text } from './Text';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '',
  icon
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-[18px]";
  
  const variants = {
    primary: "bg-primary",
    secondary: "bg-slate-900",
    outline: "bg-transparent border-2 border-primary/20",
    ghost: "bg-transparent",
    destructive: "bg-red-500",
  };

  const sizes = {
    sm: "px-4 py-2.5",
    md: "px-6 py-4",
    lg: "px-8 py-5",
  };

  const textColors = {
    primary: "text-white",
    secondary: "text-white",
    outline: "text-primary",
    ghost: "text-slate-600",
    destructive: "text-white",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50' : ''}`}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#4C6FFF' : 'white'} />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text weight="bold" className={`${textColors[variant]} ${textSizes[size]}`}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
