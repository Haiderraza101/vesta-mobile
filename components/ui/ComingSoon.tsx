import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { Sparkles } from 'lucide-react-native';

interface ComingSoonProps {
  title: string;
  onBack?: () => void;
}

export function ComingSoon({ title, onBack }: ComingSoonProps) {
  return (
    <View className="flex-1 items-center justify-center p-8 bg-slate-50 rounded-[40px] border border-slate-100">
      <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-6">
        <Sparkles size={40} color="#4C6FFF" />
      </View>
      <Text variant="h2" weight="bold" className="text-slate-900 mb-2 text-center">
        Coming Soon
      </Text>
      <Text className="text-slate-500 text-center mb-10 leading-6">
        We are working hard to bring {title} to you. This feature will be available in the next update!
      </Text>
      {onBack && (
        <Button 
          title="Go Back" 
          variant="outline" 
          onPress={onBack}
          className="w-full"
        />
      )}
    </View>
  );
}
