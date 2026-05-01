import React from 'react';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { Text } from './Text';
import { cn } from '../../utils/utils';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'brand' | 'primary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({ 
  title, 
  onPress, 
  variant = 'brand',
  size = 'md', 
  loading = false, 
  disabled = false, 
  className = '',
  icon
}: ButtonProps) {
  const baseStyles = "flex-row items-center justify-center rounded-xl";
  
  const variants = {
    brand: "bg-brand",
    primary: "bg-primary",
    outline: "bg-transparent border border-border",
    ghost: "bg-transparent",
    destructive: "bg-destructive",
  };

  const sizes = {
    sm: "px-4 py-2",
    md: "px-6 py-3.5",
    lg: "px-8 py-4.5",
  };

  const textColors = {
    brand: "text-white",
    primary: "text-white",
    outline: "text-foreground",
    ghost: "text-muted",
    destructive: "text-white",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || loading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50",
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#2563EB' : 'white'} />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2.5">{icon}</View>}
          <Text weight="semibold" className={cn(textColors[variant], textSizes[size])}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
