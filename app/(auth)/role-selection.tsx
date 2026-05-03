import React from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { ArrowLeft, User, Briefcase, ChevronRight, Sparkles } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

export default function RoleSelection() {
  const router = useRouter();

  const handleSelect = (role: 'customer' | 'provider') => {
    router.push({
      pathname: "/(auth)/signup",
      params: { role }
    });
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        
        <View className="px-8 pt-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl bg-white shadow-sm"
          >
            <ArrowLeft size={20} color="#1E293B" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View className="px-8 mt-10 mb-12">
          <View className="flex-row items-center gap-2 mb-4">
            <View className="bg-primary/10 px-3 py-1 rounded-full">
              <Text weight="bold" className="text-primary text-[10px] uppercase tracking-widest">Get Started</Text>
            </View>
            <Sparkles size={14} color="#4C6FFF" />
          </View>
          <Text weight="bold" className="text-4xl text-slate-900 tracking-tight leading-[48px]">
            Join the{"\n"}
            Vesta Community
          </Text>
          <Text className="text-slate-500 text-base mt-4 leading-6">
            Choose your path to begin your journey with our professional marketplace.
          </Text>
        </View>

        <View className="px-8 gap-6">
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => handleSelect('customer')}
            className="relative overflow-hidden"
          >
            <LinearGradient
              colors={['#F8FAFC', '#F1F5F9']}
              className="p-8 rounded-[32px] border border-slate-100 flex-row items-center gap-6"
            >
              <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-md">
                <User size={28} color="#4C6FFF" strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text weight="bold" className="text-xl text-slate-900 mb-1">Customer</Text>
                <Text className="text-slate-500 text-xs leading-4">Book services for your home</Text>
              </View>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-50 shadow-sm">
                <ChevronRight size={18} color="#4C6FFF" strokeWidth={3} />
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => handleSelect('provider')}
            className="relative overflow-hidden"
          >
            <LinearGradient
              colors={['#F8FAFC', '#F1F5F9']}
              className="p-8 rounded-[32px] border border-slate-100 flex-row items-center gap-6"
            >
              <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center shadow-md">
                <Briefcase size={28} color="#4C6FFF" strokeWidth={2.5} />
              </View>
              <View className="flex-1">
                <Text weight="bold" className="text-xl text-slate-900 mb-1">Provider</Text>
                <Text className="text-slate-500 text-xs leading-4">Find jobs and grow your business</Text>
              </View>
              <View className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-50 shadow-sm">
                <ChevronRight size={18} color="#4C6FFF" strokeWidth={3} />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View className="mt-auto px-8 mb-8 items-center">
          <Text className="text-slate-400 text-xs">By joining, you agree to our Terms and Privacy Policy</Text>
        </View>

      </SafeAreaView>
    </View>
  );
}
