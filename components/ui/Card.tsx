import React from 'react';
import { View, TouchableOpacity, ViewProps, TouchableOpacityProps, StyleSheet } from 'react-native';
import { Text } from './Text';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outline' | 'flat';
  className?: string;
  style?: any;
}

export function Card({ children, onPress, variant = 'elevated', className = '', style, ...props }: CardProps) {
  const baseStyles = "rounded-[28px] overflow-hidden";
  const variants = {
    elevated: "bg-white shadow-sm border border-slate-50",
    outline: "bg-transparent border border-slate-100",
    flat: "bg-slate-50",
  };

  const content = (
    <View 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={style}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}
