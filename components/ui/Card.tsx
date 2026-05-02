import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'elevated' | 'outline' | 'flat' | 'glass';
  className?: string;
  style?: any;
}

export function Card({ children, onPress, variant = 'elevated', className = '', style }: CardProps) {
  const baseStyles = "rounded-[32px] overflow-hidden";
  
  const variants = {
    elevated: "bg-white border border-white",
    outline: "bg-transparent border-[1.5px] border-slate-100",
    flat: "bg-slate-50",
    glass: "bg-white/70",
  };

  const getShadow = () => {
    if (variant === 'elevated') {
      return {
        shadowColor: '#4C6FFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 2,
      };
    }
    return {};
  };

  const content = (
    <View 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      style={[getShadow(), style]}
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
