<<<<<<< Updated upstream
import { RegisterView } from "../../src/views/auth/RegisterView";

export default RegisterView;
=======
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight } from "lucide-react-native";
import InputField from "../../components/ui/InputField";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSignup = () => {
    signup(name, email, password);
    router.push("/(auth)/role-selection");
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-container-lowest">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }} keyboardShouldPersistTaps="handled">
          {/* Mobile branding */}
          <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-primary mb-6">
            ServiceHub
          </Text>

          {/* Header */}
          <View className="mb-8">
            <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface mb-1">
              Create Account
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant">
              Join our platform to discover and connect with top-tier service providers.
            </Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            <InputField label="Full Name" placeholder="e.g. Alex Johnson" value={name} onChangeText={setName} />
            <InputField label="Email Address" placeholder="name@company.com" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            <InputField label="Password" placeholder="••••••••" isPassword value={password} onChangeText={setPassword} />
            <InputField label="Confirm Password" placeholder="••••••••" isPassword value={confirmPassword} onChangeText={setConfirmPassword} />

            {/* Terms */}
            <TouchableOpacity
              onPress={() => setAgreedToTerms(!agreedToTerms)}
              className="flex-row items-start gap-3 py-2"
              activeOpacity={0.7}
            >
              <View className={`w-5 h-5 rounded border mt-0.5 items-center justify-center ${agreedToTerms ? "bg-secondary border-secondary" : "border-outline-variant"}`}>
                {agreedToTerms && <Text className="text-on-secondary text-xs">✓</Text>}
              </View>
              <Text style={{ fontFamily: "Inter", fontSize: 13, lineHeight: 19 }} className="text-on-surface-variant flex-1">
                I agree to the{" "}
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: Colors.secondary }}>Terms of Service</Text>
                {" "}and{" "}
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: Colors.secondary }}>Privacy Policy</Text>.
              </Text>
            </TouchableOpacity>

            <PrimaryButton
              title="Create Account"
              iconRight={<ArrowRight size={16} color={Colors.onSecondary} />}
              onPress={handleSignup}
            />
          </View>

          {/* Footer */}
          <View className="mt-8 items-center">
            <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant">
              Already have an account?{" "}
              <Text
                style={{ fontFamily: "Inter-SemiBold", color: Colors.secondary }}
                onPress={() => router.back()}
              >
                Log In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
>>>>>>> Stashed changes
