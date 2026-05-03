import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams, Link } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Mail, Lock, ArrowLeft } from "lucide-react-native";
import { authService } from "@/services/authService";
import { userService, UserRole } from "@/services/userService";
import { LinearGradient } from 'expo-linear-gradient';
import { sendEmailVerification } from 'firebase/auth';

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role: UserRole }>();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signUp(email, password);
      
      try {
        await sendEmailVerification(user);
      } catch (e) {
      }
      
      const defaultName = email.split('@')[0];
      await userService.createUserProfile(user.uid, {
        fullName: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
        email,
        role: params.role || 'customer',
        onboardingStatus: 0,
        onboardingData: {}
      });

      showToast("Account created! Please verify your email.", "success");
      router.push("/(auth)/verify-email");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sign up failed";
      showToast(message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      
      <View className="h-[32%] justify-center px-8">
        <LinearGradient 
          colors={['#4C6FFF', '#3b5edb']} 
          className="absolute inset-0" 
        />
        <SafeAreaView edges={['top']} className="-mt-8">
          <TouchableOpacity onPress={() => router.back()} className="mb-4 w-10 h-10 rounded-xl bg-white/20 items-center justify-center">
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
          <Text weight="bold" className="text-[28px] leading-[38px] text-white tracking-tight">
            Join Vesta to{"\n"}
            get started with your{"\n"}
            home services.
          </Text>
        </SafeAreaView>
      </View>

      <View className="flex-1 bg-white rounded-t-[40px] -mt-6 shadow-2xl">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          className="flex-1"
        >
          <ScrollView 
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 28, paddingTop: 40, paddingBottom: 24 }}
          >
            <View className="items-center mb-8">
              <Text weight="bold" className="text-2xl text-slate-900 mb-2">Sign Up</Text>
              <View className="flex-row items-center">
                <Text className="text-slate-500 text-[14px]">Already Have An Account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text weight="bold" className="text-primary text-[14px] -mb-1">Login</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>

            <View className="gap-y-4 mb-8">
              <Input 
                placeholder="Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                leftIcon={<Mail size={18} color="#94A3B8" />}
                className="bg-slate-50 border-0 h-14"
              />
              <Input 
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                leftIcon={<Lock size={18} color="#94A3B8" />}
                className="bg-slate-50 border-0 h-14"
              />
              <Input 
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon={<Lock size={18} color="#94A3B8" />}
                className="bg-slate-50 border-0 h-14"
              />
            </View>

            <Button 
              title={loading ? "Creating..." : "Sign Up"} 
              onPress={handleSignUp} 
              loading={loading}
              className="h-14 bg-primary shadow-md shadow-primary/20"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
