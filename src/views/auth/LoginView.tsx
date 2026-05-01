import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { InputField } from '../../components/ui/InputField';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { useLoginViewModel } from '../../viewmodels/useLoginViewModel';
import { useRouter } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { theme } from '../../utils/theme';
import { keyboardBehavior } from '../../utils/helpers';

export const LoginView = () => {
  const {
    email, setEmail,
    password, setPassword,
    loading, errors,
    handleLogin
  } = useLoginViewModel();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={keyboardBehavior} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 py-12">
          <View className="items-center mb-12">
            <View className="bg-blue-50 p-5 rounded-[30px] mb-6">
              <Sparkles size={40} color={theme.colors.secondary} />
            </View>
            <Text className="text-3xl font-bold text-slate-900 mb-2">Welcome back</Text>
            <Text className="text-slate-500 italic">Premium Home Services</Text>
          </View>

          <View className="flex-1">
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
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              isPassword
            />

            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              isLoading={loading}
              style={{ marginTop: 8 }}
            />
          </View>

          <View className="flex-row justify-center mt-8">
            <Text className="text-slate-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <Text className="text-blue-600 font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
