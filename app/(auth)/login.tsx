import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from "lucide-react-native";

export default function Login() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Successfully logged in!", "success");
      router.replace("/(tabs)");
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        className="flex-1"
      >
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-8"
        >
          <TouchableOpacity 
            onPress={() => router.canGoBack() ? router.back() : router.replace("/onboarding")}
            className="mt-4 mb-10 h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl shadow-sm bg-white"
          >
            <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="mb-12">
            <Text weight="bold" className="text-4xl mb-4 text-slate-900">Welcome Back</Text>
            <Text className="text-slate-500 text-lg leading-7">Enter your credentials to continue managing your home services.</Text>
          </View>

          <View className="gap-8">
            <Input 
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color="#94A3B8" />}
            />
            <View>
              <Input 
                label="Password"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                leftIcon={<Lock size={20} color="#94A3B8" />}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} color="#94A3B8" /> : <Eye size={20} color="#94A3B8" />}
                  </TouchableOpacity>
                }
              />
              <TouchableOpacity className="mt-4 self-end">
                <Text weight="bold" className="text-primary text-sm uppercase tracking-widest">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="mt-auto py-10">
            <Button 
              title="Login" 
              onPress={handleLogin} 
              loading={loading}
              size="lg"
              className="rounded-full h-16 shadow-lg shadow-primary/20"
            />
            
            <View className="flex-row items-center justify-center mt-10 gap-2">
              <Text className="text-slate-500">Don't have an account?</Text>
              <Link href="/(auth)/signup" asChild>
                <TouchableOpacity>
                  <Text weight="bold" className="text-primary uppercase tracking-widest text-sm">Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
