import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, User, Mail, Lock } from "lucide-react-native";

export default function SignUp() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignUp = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Account created successfully!", "success");
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
            <Text weight="bold" className="text-4xl mb-4 text-slate-900">Create Account</Text>
            <Text className="text-slate-500 text-lg leading-7">Join Vesta today and simplify your home maintenance journey.</Text>
          </View>

          <View className="gap-6">
            <Input 
              label="Full Name"
              placeholder="John Doe"
              leftIcon={<User size={20} color="#94A3B8" />}
            />
            <Input 
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color="#94A3B8" />}
            />
            <Input 
              label="Password"
              placeholder="Create a strong password"
              secureTextEntry
              leftIcon={<Lock size={20} color="#94A3B8" />}
            />
            <View className="mt-2">
              <Text variant="small" className="text-slate-400 leading-5">
                By creating an account, you agree to our <Text weight="bold" className="text-primary">Terms</Text> and <Text weight="bold" className="text-primary">Privacy Policy</Text>.
              </Text>
            </View>
          </View>

          <View className="mt-auto py-10">
            <Button 
              title="Create Account" 
              onPress={handleSignUp} 
              loading={loading}
              size="lg"
              className="rounded-full h-16 shadow-lg shadow-primary/20"
            />
            
            <View className="flex-row items-center justify-center mt-10 gap-2">
              <Text className="text-slate-500">Already have an account?</Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity>
                  <Text weight="bold" className="text-primary uppercase tracking-widest text-sm">Log In</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
