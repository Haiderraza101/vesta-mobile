import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from './Text';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading your experience..." }: LoadingStateProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <View className="bg-slate-50 p-10 rounded-[40px] items-center justify-center border border-slate-100">
        <ActivityIndicator size="large" color="#4C6FFF" />
        <Text weight="medium" className="mt-6 text-slate-500 text-base">
          {message}
        </Text>
      </View>
    </View>
  );
}
