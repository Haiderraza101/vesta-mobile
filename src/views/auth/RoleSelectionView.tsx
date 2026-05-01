import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRoleSelectionViewModel } from '../../viewmodels/useRoleSelectionViewModel';
import { Home, Toolbox, CheckCircle2, BrushCleaning, Zap, Wrench } from 'lucide-react-native';
import { theme } from '../../utils/theme';
import Animated, { FadeInDown, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';

const RoleCard = ({
  selected,
  onPress,
  title,
  subtitle,
  Icon
}: {
  selected: boolean;
  onPress: () => void;
  title: string;
  subtitle: string;
  Icon: any
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(selected ? 1.02 : 1) }],
      borderColor: withSpring(selected ? theme.colors.secondary : theme.colors.border),
      borderWidth: selected ? 2.5 : 1,
      backgroundColor: withSpring(selected ? '#F0F7FF' : '#FFFFFF'),
    };
  });

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Animated.View
        style={animatedStyle}
        className="p-6 rounded-3xl mb-4 relative"
      >
        <View className={`w-14 h-14 rounded-2xl items-center justify-center mb-4 ${selected ? 'bg-blue-500' : 'bg-slate-100'}`}>
          <Icon size={30} color={selected ? 'white' : theme.colors.muted} />
        </View>
        <Text className={`text-xl font-bold mb-1 ${selected ? 'text-blue-900' : 'text-slate-900'}`}>{title}</Text>
        <Text className="text-slate-500 text-sm leading-5">{subtitle}</Text>
        {selected && (
          <View className="absolute top-4 right-4">
            <CheckCircle2 size={24} color={theme.colors.secondary} />
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const ServicePill = ({
  selected,
  onPress,
  label,
  Icon
}: {
  selected: boolean;
  onPress: () => void;
  label: string;
  Icon: any
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-row items-center px-4 py-3 rounded-2xl mr-3 mb-3 border ${selected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-200'}`}
  >
    <Icon size={18} color={selected ? 'white' : theme.colors.muted} className="mr-2" />
    <Text className={`font-semibold ${selected ? 'text-white' : 'text-slate-600'}`}>{label}</Text>
  </TouchableOpacity>
);

export const RoleSelectionView = () => {
  const { user } = useAuth();
  const {
    selectedRole, setSelectedRole,
    selectedService, setSelectedService,
    loading, handleContinue
  } = useRoleSelectionViewModel();

  const showRoleChooser = !user?.role;
  const showServiceChooser = user?.role === 'provider' || selectedRole === 'provider';

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6 pt-12 pb-8" contentContainerStyle={{ paddingBottom: 24 }}>
        <Animated.View entering={FadeInDown.delay(200)}>
          <Text className="text-3xl font-bold text-slate-900 mb-2">
            {showServiceChooser ? 'What service do you provide?' : 'How will you use Vesta?'}
          </Text>
          <Text className="text-slate-500 text-base mb-10">
            {showServiceChooser
              ? 'Choose the service you want to offer to customers.'
              : 'You can always update this later in your profile.'}
          </Text>
        </Animated.View>

        {showRoleChooser && (
          <View>
            <RoleCard
              title="I Need a Service"
              subtitle="Book cleaners, electricians, and plumbers."
              Icon={Home}
              selected={selectedRole === 'customer'}
              onPress={() => setSelectedRole('customer')}
            />
            <RoleCard
              title="I Offer a Service"
              subtitle="Accept jobs and grow your business."
              Icon={Toolbox}
              selected={selectedRole === 'provider'}
              onPress={() => setSelectedRole('provider')}
            />
          </View>
        )}

        {showServiceChooser && (
          <Animated.View entering={FadeInDown} className="mt-6 mb-8">
            <Text className="text-lg font-bold text-slate-900 mb-4">
              {user?.role === 'provider' ? 'Choose your service type' : 'Choose your service type'}
            </Text>
            <View className="flex-row flex-wrap">
              <ServicePill
                label="Cleaning"
                Icon={BrushCleaning}
                selected={selectedService === 'Cleaning'}
                onPress={() => setSelectedService('Cleaning')}
              />
              <ServicePill
                label="Electrical"
                Icon={Zap}
                selected={selectedService === 'Electrical'}
                onPress={() => setSelectedService('Electrical')}
              />
              <ServicePill
                label="Plumbing"
                Icon={Wrench}
                selected={selectedService === 'Plumbing'}
                onPress={() => setSelectedService('Plumbing')}
              />
            </View>
          </Animated.View>
        )}

        <View className="mt-10 mb-12">
          <PrimaryButton
            title="Continue"
            onPress={handleContinue}
            isLoading={loading}
            disabled={!user?.role && !selectedRole}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
