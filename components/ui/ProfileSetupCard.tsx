import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { CheckCircle2, Circle, ChevronRight, Mail, ClipboardCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Href } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface ProfileSetupCardProps {
  userProfile: any;
  role: 'customer' | 'provider';
}

export function ProfileSetupCard({ userProfile, role }: ProfileSetupCardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading || !user) return null;

  const steps = [
    {
      id: 'email',
      label: 'Email Verification',
      description: 'Verify your email to secure your account',
      icon: Mail,
      completed: !!user?.emailVerified,
      route: '/(auth)/verify-email' as Href,
    },
    {
      id: 'onboarding',
      label: 'Profile Onboarding',
      description: 'Complete the setup questions',
      icon: ClipboardCheck,
      completed: userProfile?.onboardingStatus === 100,
      route: '/onboarding' as Href,
    },
  ];

  const completedSteps = steps.filter(s => s.completed).length;
  const totalSteps = steps.length;
  const progress = (completedSteps / totalSteps) * 100;

  if (progress === 100) return null;

  return (
    <View className="bg-white rounded-[40px] p-8 shadow-xl shadow-slate-100 overflow-hidden">
      <View className="flex-row justify-between items-start mb-8">
        <View className="flex-1 mr-4">
          <Text weight="bold" className="text-2xl text-slate-900 mb-2">Account Setup</Text>
          <Text className="text-slate-400 text-sm leading-5">Complete these 2 essential steps to unlock all features</Text>
        </View>
        <View className="bg-primary/10 px-4 py-2 rounded-2xl">
          <Text weight="bold" className="text-primary text-xs">{Math.round(progress)}%</Text>
        </View>
      </View>

      <View className="h-3 bg-slate-50 rounded-full mb-10 overflow-hidden">
        <LinearGradient
          colors={['#4C6FFF', '#3b5edb']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${progress}%`, height: '100%', borderRadius: 10 }}
        />
      </View>

      <View className="gap-y-6">
        {steps.map((step) => (
          <TouchableOpacity 
            key={step.id} 
            onPress={() => !step.completed && router.push(step.route)}
            activeOpacity={0.7}
            disabled={step.completed}
            className={`flex-row items-center justify-between p-5 rounded-3xl ${step.completed ? 'bg-emerald-50' : 'bg-slate-50'}`}
          >
            <View className="flex-row items-center flex-1 mr-4">
              <View className={`w-12 h-12 rounded-2xl items-center justify-center ${step.completed ? 'bg-emerald-500' : 'bg-white shadow-sm'}`}>
                <step.icon size={20} color={step.completed ? 'white' : '#4C6FFF'} />
              </View>
              <View className="ml-4 flex-1">
                <Text weight="bold" className={`text-base ${step.completed ? 'text-emerald-900' : 'text-slate-900'}`}>
                  {step.label}
                </Text>
                <Text className={`text-[11px] mt-0.5 ${step.completed ? 'text-emerald-600/70' : 'text-slate-400'}`} numberOfLines={1}>
                  {step.completed ? 'Step completed successfully' : step.description}
                </Text>
              </View>
            </View>
            {step.completed ? (
              <View className="w-6 h-6 bg-emerald-500 rounded-full items-center justify-center">
                <CheckCircle2 size={14} color="white" />
              </View>
            ) : (
              <ChevronRight size={20} color="#CBD5E1" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
