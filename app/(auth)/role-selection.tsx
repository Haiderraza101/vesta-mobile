import React from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { ArrowLeft, User, Briefcase, ChevronRight } from "lucide-react-native";
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
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 px-8">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="mt-4 mb-10 h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl shadow-sm bg-white"
        >
          <ArrowLeft size={22} color="#1E293B" strokeWidth={2.5} />
        </TouchableOpacity>

        <View className="mb-12">
          <Text weight="bold" className="text-4xl mb-4 text-slate-900">Join Vesta</Text>
          <Text className="text-slate-500 text-lg leading-7">Choose how you want to use the marketplace today.</Text>
        </View>

        <View className="gap-6">
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => handleSelect('customer')}
            className="p-8 rounded-[40px] bg-slate-50 border border-slate-100 flex-row items-center gap-6"
          >
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-sm">
              <User size={32} color="#4C6FFF" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text weight="bold" className="text-xl text-slate-900 mb-1">Customer</Text>
              <Text className="text-slate-500 text-sm leading-5">I want to book professional services for my home.</Text>
            </View>
            <ChevronRight size={20} color="#CBD5E1" strokeWidth={3} />
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => handleSelect('provider')}
            className="p-8 rounded-[40px] bg-primary/5 border border-primary/10 flex-row items-center gap-6"
          >
            <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-sm">
              <Briefcase size={32} color="#4C6FFF" strokeWidth={2.5} />
            </View>
            <View className="flex-1">
              <Text weight="bold" className="text-xl text-slate-900 mb-1">Service Provider</Text>
              <Text className="text-slate-500 text-sm leading-5">I want to offer my services and find new jobs.</Text>
            </View>
            <ChevronRight size={20} color="#CBD5E1" strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
