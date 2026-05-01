import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputField } from '../../components/ui/InputField';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useRegisterViewModel } from '../../viewmodels/useRegisterViewModel';
import { useRouter } from 'expo-router';
import { ArrowLeft, Home, Toolbox, CheckCircle2 } from 'lucide-react-native';
import { theme } from '../../utils/theme';
import { keyboardBehavior } from '../../utils/helpers';

export const RegisterView = () => {
  const {
    fullName, setFullName,
    email, setEmail,
    password, setPassword,
    confirmPassword, setConfirmPassword,
    selectedRole, setSelectedRole,
    loading, errors,
    handleRegister
  } = useRegisterViewModel();
  const router = useRouter();

  const roleCards = [
    {
      value: 'customer',
      title: 'Customer',
      description: 'Book home services and manage requests.',
      Icon: Home,
      accent: '#4C6FFF',
    },
    {
      value: 'provider',
      title: 'Provider',
      description: 'Accept jobs and grow your service business.',
      Icon: Toolbox,
      accent: '#1E3A5F',
    },
  ] as const;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={keyboardBehavior} className="flex-1">
        <View className="px-6 py-4">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pb-12">
          <View className="mb-10">
            <Text className="text-3xl font-bold text-slate-900 mb-2">Create Account</Text>
            <Text className="text-slate-500 text-base">Join thousands getting help at home.</Text>
          </View>

          <View className="flex-1">
            <InputField
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              autoCapitalize="words"
            />
            <InputField
              label="Email"
              placeholder="name@example.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <InputField
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              isPassword
            />
            <InputField
              label="Confirm Password"
              placeholder="Repeat your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              isPassword
            />

            <View className="mt-2 mb-2">
              <Text className="text-[11px] font-bold uppercase tracking-[0.35em] text-slate-400 mb-3 ml-1">Account Type</Text>
              <View className="gap-3">
                {roleCards.map(({ value, title, description, Icon, accent }) => {
                  const active = selectedRole === value;

                  return (
                    <TouchableOpacity
                      key={value}
                      activeOpacity={0.8}
                      onPress={() => setSelectedRole(value)}
                      className={`flex-row items-center rounded-[24px] border p-4 ${active ? 'border-blue-200 bg-[#F0F7FF]' : 'border-slate-200 bg-white'}`}
                    >
                      <View className="relative mr-4">
                        <View className="w-12 h-12 rounded-2xl items-center justify-center" style={{ backgroundColor: `${accent}14` }}>
                          <Icon size={22} color={accent} />
                        </View>
                        {active && (
                          <View className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-blue-600 items-center justify-center border-2 border-white">
                            <CheckCircle2 size={12} color="white" />
                          </View>
                        )}
                      </View>
                      <View className="flex-1 pr-3">
                        <Text weight="bold" className="text-[16px] text-slate-900 mb-1">{title}</Text>
                        <Text className="text-slate-500 text-[13px] leading-5">{description}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.role && (
                <Text className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.role}</Text>
              )}
            </View>

            <PrimaryButton
              title={selectedRole === 'provider' ? 'Create Provider Account' : 'Create Customer Account'}
              onPress={handleRegister}
              isLoading={loading}
              style={{ marginTop: 12 }}
            />
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <Text className="text-blue-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
