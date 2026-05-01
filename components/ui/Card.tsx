import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cn } from '../../utils/utils';
import { theme } from '../../src/utils/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outline' | 'flat';
  className?: string;
  style?: any;
}

export function Card({ children, onPress, variant = 'elevated', className = '', style }: CardProps) {
  const baseStyles = "rounded-2xl overflow-hidden";

  const variants = {
    elevated: "bg-white border border-slate-100",
    outline: "bg-transparent border border-border",
    flat: "bg-slate-100",
  };

  const shadowStyle = variant === 'elevated' ? theme.shadows.sm : {};

  const content = (
    <View 
      className={cn(baseStyles, variants[variant], className)}
      style={[shadowStyle, style]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.9}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
