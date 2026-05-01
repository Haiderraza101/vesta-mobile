import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Selector } from "../../components/ui/Selector";
import { useToast } from "../../context/ToastContext";
import { ArrowLeft, User, Mail, Lock, Phone } from "lucide-react-native";
import { authService } from "../../services/authService";
import { userService, UserRole } from "../../services/userService";

export default function SignUp() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserRole>("customer");

  const roleOptions = [
    { label: "I want to hire services (Customer)", value: "customer" },
    { label: "I want to provide services (Provider)", value: "provider" },
  ];

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    if (password.length < 6) {
      showToast("Password should be at least 6 characters", "error");
      return;
    }

    setLoading(true);
    try {
      const user = await authService.signUp(email, password);
      
      await userService.createUserProfile(user.uid, {
        fullName,
        email,
        role,
        phoneNumber: phone,
      });

      showToast("Account created successfully!", "success");
      router.replace("/(tabs)");
    } catch (error: any) {
      showToast(error.message || "Sign up failed", "error");
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
            onPress={() => router.canGoBack() ? router.back() : router.replace("/onboarding")}
            className="mt-4 mb-8 h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl shadow-sm bg-white"
          >
            <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>

          <View className="mb-8">
            <Text weight="bold" className="text-4xl mb-3 text-slate-900">Create Account</Text>
            <Text className="text-slate-500 text-lg leading-7">Join Vesta today and simplify your home maintenance journey.</Text>
          </View>

          <View className="gap-5">
            <Input 
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              leftIcon={<User size={20} color="#94A3B8" />}
            />
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
              label="Phone Number (Optional)"
              placeholder="+1 234 567 890"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              leftIcon={<Phone size={20} color="#94A3B8" />}
            />
            <Input 
              label="Password"
              placeholder="Create a strong password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              leftIcon={<Lock size={20} color="#94A3B8" />}
            />
            <Input 
              label="Confirm Password"
              placeholder="Repeat your password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              leftIcon={<Lock size={20} color="#94A3B8" />}
            />
            
            <Selector 
              label="Register As"
              options={roleOptions}
              value={role}
              onSelect={(val) => setRole(val as UserRole)}
            />

            <View className="mt-2">
              <Text variant="small" className="text-slate-400 leading-5">
                By creating an account, you agree to our <Text weight="bold" className="text-primary">Terms</Text> and <Text weight="bold" className="text-primary">Privacy Policy</Text>.
              </Text>
            </View>
          </View>

          <View className="mt-10 mb-8">
            <Button 
              title="Create Account" 
              onPress={handleSignUp} 
              loading={loading}
              size="lg"
              className="rounded-full h-16 shadow-lg shadow-primary/20"
            />
            
            <View className="flex-row items-center justify-center mt-8 gap-2">
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
