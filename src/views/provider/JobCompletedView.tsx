import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';
import { CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeIn, ScaleIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export const JobCompletedView = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(provider-tabs)');
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-900 items-center justify-center" edges={['top', 'bottom']}>
      <Animated.View entering={ScaleIn.duration(800)} className="bg-green-500/20 p-10 rounded-[60px] mb-10">
        <CheckCircle2 size={100} color={theme.colors.success} strokeWidth={2.5} />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(500)} className="items-center px-8">
        <Text className="text-4xl font-bold text-white mb-4 text-center">Job Complete!</Text>
        <Text className="text-slate-400 text-lg text-center leading-7 mb-16">
          Great work! Your earnings and stats have been updated.
        </Text>

        <PrimaryButton
          title="Back to Home"
          onPress={() => router.replace('/(provider-tabs)')}
          variant="outline"
          color="white"
          style={{ width: '100%', borderColor: 'rgba(255,255,255,0.2)' }}
        />
      </Animated.View>
    </SafeAreaView>
  );
};
