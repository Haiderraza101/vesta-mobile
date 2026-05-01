import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { theme } from '../../utils/theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  variant?: 'solid' | 'outline' | 'ghost';
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  isLoading = false,
  variant = 'solid',
  color = theme.colors.primary,
  disabled = false,
  style,
  textStyle,
}) => {
  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';

  const backgroundColor = isOutline || isGhost ? 'transparent' : color;
  const borderColor = isOutline ? color : 'transparent';
  const textColor = isOutline || isGhost ? color : theme.colors.white;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled || isLoading}
      className={`h-14 rounded-2xl flex-row items-center justify-center border ${disabled ? 'opacity-50' : ''}`}
      style={[
        { backgroundColor, borderColor },
        style
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          className="text-base font-semibold"
          style={[{ color: textColor }, textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
