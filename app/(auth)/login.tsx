import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, Mail, Lock } from "lucide-react-native";
import { authService } from "../../services/authService";

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
      await authService.signIn(email, password);
      showToast("Welcome back!", "success");
      router.replace("/(tabs)");
    } catch (error: any) {
      showToast(error.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
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
            onPress={() => router.canGoBack() ? router.back() : router.replace("/(auth)/signup")}
            className="mt-4 mb-10 h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl shadow-sm bg-white"
          >
            <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="mb-12">
            <Text weight="bold" className="text-4xl mb-4 text-slate-900">Welcome Back</Text>
            <Text className="text-slate-500 text-lg leading-7">Sign in to continue your home maintenance journey.</Text>
          </View>

          <View className="gap-6">
            <Input 
              label="Email Address"
              placeholder="name@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              leftIcon={<Mail size={20} color="#94A3B8" />}
            />
            <Input 
              label="Password"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color="#94A3B8" />}
            />
            
            <TouchableOpacity className="items-end">
              <Text weight="semibold" className="text-primary text-sm uppercase tracking-wider">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <View className="mt-auto py-10">
            <Button 
              title="Log In" 
              onPress={handleLogin} 
              loading={loading}
              size="lg"
              className="rounded-full h-16 shadow-lg shadow-primary/20"
            />
            
            <View className="flex-row items-center justify-center mt-10 gap-2">
              <Text className="text-slate-500">Don't have an account?</Text>
              <Link href="/(auth)/role-selection" asChild>
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
