import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/context/ToastContext";
import { Mail, Lock } from "lucide-react-native";
import { authService } from "@/services/authService";
import { userService } from "@/services/userService";
import { LinearGradient } from 'expo-linear-gradient';

export default function Login() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter email and password", "error");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signIn(email, password);
      const profile = await userService.getUserProfile(user.uid);
      
      showToast("Welcome back!", "success");
      
      if (profile?.role === 'admin') {
        router.replace("/admin");
      } else {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      showToast(error.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      
      <View className="h-[38%] justify-center px-8">
        <LinearGradient 
          colors={['#4C6FFF', '#3b5edb']} 
          className="absolute inset-0" 
        />
        <SafeAreaView edges={['top']} className="-mt-8">
          <Text weight="bold" className="text-[28px] leading-[38px] text-white tracking-tight">
            Connect with the{"\n"}
            best home service{"\n"}
            professionals.
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
            <View className="items-center mb-6">
              <Text weight="bold" className="text-2xl text-slate-900 mb-2">Login</Text>
                <View className="flex-row items-center gap-1">
                <Text className="text-slate-500 text-[14px]">Don't Have An Account?</Text>
                <Link href="/(auth)/role-selection" asChild>
                  <TouchableOpacity activeOpacity={0.5}>
                    <Text weight="bold" className="text-primary text-[14px]">Sign Up</Text>
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
                isPassword
                value={password}
                onChangeText={setPassword}
                leftIcon={<Lock size={18} color="#94A3B8" />}
                className="bg-slate-50 border-0 h-14"
              />
            </View>

            <Button 
              title={loading ? "Logging in..." : "Login"} 
              onPress={handleLogin} 
              loading={loading}
              className="h-14 bg-primary shadow-md shadow-primary/20"
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
