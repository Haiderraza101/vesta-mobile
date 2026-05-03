import React, { useState } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { Mail, CheckCircle2,  RefreshCw, ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { sendEmailVerification } from 'firebase/auth';

export default function VerifyEmail() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleResend = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await sendEmailVerification(user);
      showToast("Verification email sent!", "success");
    } catch (error) {
      showToast("Please wait before requesting again", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await user.reload();
      if (user.emailVerified) {
        showToast("Email verified!", "success");
        router.replace("/onboarding");
      } else {
        showToast("Not verified yet", "info");
      }
    } catch (error) {
      showToast("Status check failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      
      <View className="absolute top-0 left-0 right-0 h-64">
        <LinearGradient 
          colors={['#4C6FFF', '#F8FAFC']} 
          className="absolute inset-0 opacity-10" 
        />
      </View>

      <SafeAreaView className="flex-1">
        <View className="px-6 py-4 flex-row justify-between items-center">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-xl bg-white shadow-sm border border-slate-100"
          >
            <ChevronLeft size={20} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => router.replace("/(tabs)")}
          >
            <Text weight="bold" className="text-primary text-sm tracking-wide">SKIP</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-8 pt-12">
          <View className="mb-10 items-center">
            <View className="w-24 h-24 bg-primary/10 rounded-[32px] items-center justify-center border border-primary/20">
              <Mail size={42} color="#4C6FFF" strokeWidth={1.5} />
            </View>
            <View className="bg-white rounded-full p-0.5 -mt-6 ml-14 shadow-sm border border-slate-50">
              <CheckCircle2 size={24} color="#10B981" fill="white" />
            </View>
          </View>

          <View className="items-center">
            <Text weight="bold" className="text-3xl text-slate-900 text-center mb-3">
              Verify your email
            </Text>
            <Text className="text-[15px] text-slate-500 text-center leading-6 mb-1">
              We've sent a secure verification link to
            </Text>
            <Text weight="bold" className="text-[15px] text-slate-900 text-center mb-10">
              {user?.email || "your-email@example.com"}
            </Text>

            <View className="w-full bg-white p-5 rounded-2xl border border-slate-100 shadow-sm mb-10">
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-3 text-center">Next Steps</Text>
              <View className="gap-y-3">
                <View className="flex-row items-center gap-3">
                  <View className="w-6 h-6 rounded-full bg-slate-50 items-center justify-center">
                    <Text className="text-slate-900 font-bold text-[10px]">1</Text>
                  </View>
                  <Text className="text-slate-600 text-[13px]">Open your email inbox</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="w-6 h-6 rounded-full bg-slate-50 items-center justify-center">
                    <Text className="text-slate-900 font-bold text-[10px]">2</Text>
                  </View>
                  <Text className="text-slate-600 text-[13px]">Click the verification link</Text>
                </View>
                <View className="flex-row items-center gap-3">
                  <View className="w-6 h-6 rounded-full bg-slate-50 items-center justify-center">
                    <Text className="text-slate-900 font-bold text-[10px]">3</Text>
                  </View>
                  <Text className="text-slate-600 text-[13px]">Return to the app to continue</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="w-full gap-y-4">
            <Button 
              title="I've verified my email" 
              onPress={handleCheckStatus}
              loading={loading}
              className="h-14 rounded-xl bg-primary shadow-lg shadow-primary/20"
            />
            
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={handleResend} 
              className="flex-row items-center justify-center gap-2 py-2"
            >
              <RefreshCw size={14} color="#64748B" />
              <Text weight="bold" className="text-slate-500 text-[13px]">
                Didn't get the email? <Text className="text-primary">Resend</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </SafeAreaView>
    </View>
  );
}
