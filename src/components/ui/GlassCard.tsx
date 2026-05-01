import React from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '../../utils/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 40
}) => {
  return (
    <View
      className="overflow-hidden rounded-3xl border border-white/20"
      style={[theme.shadows, style]}
    >
      <BlurView intensity={intensity} tint="light" className="p-5">
        {children}
      </BlurView>
    </View>
  );
};
