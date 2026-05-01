import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, Mail, Lock, CheckCircle2 } from "lucide-react-native";
import { authService } from "../../services/authService";
import { userService, UserRole } from "../../services/userService";
import { LinearGradient } from 'expo-linear-gradient';

export default function SignUp() {
  const router = useRouter();
  const params = useLocalSearchParams<{ role: UserRole }>();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const successAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    if (success) {
      Animated.parallel([
        Animated.timing(successAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 20,
          friction: 5,
          useNativeDriver: true,
        })
      ]).start();

      const timer = setTimeout(() => {
        router.replace("/(tabs)");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [success]);

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
      
      // Default name from email
      const defaultName = email.split('@')[0];
      
      await userService.createUserProfile(user.uid, {
        fullName: defaultName.charAt(0).toUpperCase() + defaultName.slice(1),
        email,
        role: params.role || 'customer',
      });

      setSuccess(true);
    } catch (error: any) {
      showToast(error.message || "Sign up failed", "error");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <StatusBar barStyle="dark-content" />
        <Animated.View 
          style={{ 
            opacity: successAnim,
            transform: [{ scale: scaleAnim }]
          }}
          className="items-center"
        >
          <View className="w-32 h-32 bg-green-50 rounded-full items-center justify-center mb-8 border border-green-100">
            <CheckCircle2 size={72} color="#10B981" strokeWidth={2} />
          </View>
          <Text weight="bold" className="text-3xl text-slate-900 mb-2">Account Created!</Text>
          <Text className="text-slate-500 text-center px-12 leading-6 text-lg">
            Welcome to Vesta. Your journey begins now.
          </Text>
        </Animated.View>
      </View>
    );
  }

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
            onPress={() => router.back()}
            className="mt-4 mb-10 h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl shadow-sm bg-white"
          >
            <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="mb-12">
            <Text weight="bold" className="text-4xl mb-4 text-slate-900">Sign Up</Text>
            <Text className="text-slate-500 text-lg leading-7">
              Register as a <Text weight="bold" className="text-primary">{params.role || 'Member'}</Text> to join the marketplace.
            </Text>
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
              placeholder="Create a password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color="#94A3B8" />}
            />
            <Input 
              label="Confirm Password"
              placeholder="Confirm your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon={<Lock size={20} color="#94A3B8" />}
            />
          </View>

          <View className="mt-auto py-10">
            <Button 
              title="Create Account" 
              onPress={handleSignUp} 
              loading={loading}
              size="lg"
              className="rounded-full h-16 shadow-lg shadow-primary/20"
            />
            
            <View className="flex-row items-center justify-center mt-8 gap-2">
              <Text className="text-slate-500">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                <Text weight="bold" className="text-primary uppercase tracking-widest text-sm">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
