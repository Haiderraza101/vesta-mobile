import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react-native';
import { theme } from '../../utils/theme';
import Animated, { FadeIn, ScaleIn } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

export const OnboardingDoneView = () => {
  const { user } = useAuth();
  const router = useRouter();

  const firstName = user?.fullName.split(' ')[0];
  const isCustomer = user?.role === 'customer';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-8">
        <Animated.View entering={ScaleIn.duration(600)} className="bg-green-50 p-8 rounded-[50px] mb-8">
          <CheckCircle2 size={80} color={theme.colors.success} strokeWidth={2.5} />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(400)} className="items-center">
          <Text className="text-3xl font-bold text-slate-900 mb-4 text-center">You're all set!</Text>
          <Text className="text-slate-500 text-lg text-center leading-7">
            Welcome, {firstName}. {isCustomer ? "Let's find you some help." : "Your first job is waiting."}
          </Text>
        </Animated.View>

        <View className="w-full mt-16">
          <PrimaryButton
            title="Get Started"
            onPress={() => {
              // Navigation handled by router replace in parent usually,
              // but here we can just go to the correct tab
              if (isCustomer) {
                router.replace('/(customer-tabs)');
              } else {
                router.replace('/(provider-tabs)');
              }
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
