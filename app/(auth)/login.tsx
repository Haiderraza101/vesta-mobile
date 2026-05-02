import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Mail, Lock } from "lucide-react-native";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { loginUser } from "../../services/db";
import { Colors, Shadows } from "../../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await loginUser(email.trim(), password);
      // Auth state listener in AuthContext will handle navigation via index.tsx
      router.replace("/");
    } catch (error: any) {
      let message = "Login failed. Please try again.";
      if (error.code === "auth/user-not-found") message = "No account found with this email.";
      else if (error.code === "auth/wrong-password") message = "Incorrect password.";
      else if (error.code === "auth/invalid-email") message = "Invalid email address.";
      else if (error.code === "auth/invalid-credential") message = "Invalid credentials. Please check your email and password.";
      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6"
            style={Shadows.md}
          >
            {/* Header */}
            <View className="mb-8 items-center">
              <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-background mb-2">
                Welcome Back
              </Text>
              <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant">
                Please enter your details to sign in.
              </Text>
            </View>

            {/* Form */}
            <View className="gap-6">
              <InputField
                label="Email Address"
                icon={<Mail size={20} color={Colors.outline} />}
                placeholder="name@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              <View className="gap-2">
                <View className="flex-row justify-between items-center">
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
                    Password
                  </Text>
                  <TouchableOpacity>
                    <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48, color: Colors.secondary }}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>
                </View>
                <InputField
                  label=""
                  icon={<Lock size={20} color={Colors.outline} />}
                  placeholder="••••••••"
                  isPassword
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <PrimaryButton title="Sign In" onPress={handleLogin} loading={loading} />
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-outline-variant" />
              <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="px-4 text-on-surface-variant bg-surface-container-lowest">
                or
              </Text>
              <View className="flex-1 h-px bg-outline-variant" />
            </View>

            {/* Sign up link */}
            <View className="mt-4 items-center">
              <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant">
                Don't have an account?{" "}
                <Text
                  style={{ fontFamily: "Inter-SemiBold", color: Colors.secondary }}
                  onPress={() => router.push("/(auth)/signup")}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
