import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../utils/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ArrowLeft, Briefcase, Calendar, ShieldCheck } from 'lucide-react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

const StatCard = ({ icon: Icon, label, value }: any) => (
  <View className="flex-1 bg-white p-4 rounded-3xl border border-slate-100 items-center">
    <Icon size={20} color={theme.colors.secondary} className="mb-2" />
    <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</Text>
    <Text className="text-slate-900 font-bold">{value}</Text>
  </View>
);

export const ProviderDetailView = () => {
  const { providerData } = useLocalSearchParams<{ providerData: string }>();
  const provider = JSON.parse(providerData);
  const router = useRouter();

  const firstName = provider.fullName.split(' ')[0];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
        </View>

        <View className="items-center px-6 pb-8">
          <View className="w-32 h-32 rounded-[40px] bg-blue-50 overflow-hidden mb-6" style={theme.shadows}>
            {provider.profileImageUrl ? (
              <Image source={{ uri: provider.profileImageUrl }} className="w-full h-full" />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Text className="text-blue-500 font-bold text-4xl">{provider.fullName[0]}</Text>
              </View>
            )}
          </View>
          <Text className="text-3xl font-bold text-slate-900 mb-2 text-center">{provider.fullName}</Text>
          <View className="bg-blue-50 px-4 py-1.5 rounded-full mb-6">
            <Text className="text-blue-600 font-bold text-xs uppercase">{provider.serviceType}</Text>
          </View>

          <View className="flex-row w-full space-x-3 gap-3">
            <StatCard icon={Star} label="Rating" value={provider.rating === 0 ? 'New' : `${provider.rating.toFixed(1)} ★`} />
            <StatCard icon={Briefcase} label="Jobs" value={provider.totalJobs} />
            <StatCard icon={ShieldCheck} label="Verified" value="Yes" />
          </View>
        </View>

        <View className="px-8 pb-32">
          <Text className="text-xl font-bold text-slate-900 mb-4">About</Text>
          <Text className="text-slate-500 text-base leading-7 mb-8">
            Professional {provider.serviceType.toLowerCase()} with extensive experience in residential and commercial projects.
            Committed to providing high-quality service and customer satisfaction. Available now for your service requests.
          </Text>

          <View className="bg-green-50 p-6 rounded-[30px] border border-green-100 flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-green-500 mr-4" />
            <View>
              <Text className="text-green-800 font-bold text-lg">Available Now</Text>
              <Text className="text-green-600/70 text-sm">Ready to accept your request</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View className="absolute bottom-0 w-full p-6 bg-white/80 border-t border-slate-100">
        <PrimaryButton
          title={`Book ${firstName}`}
          onPress={() => router.push({
            pathname: "/(customer-tabs)/booking-creation",
            params: { providerId: provider.uid, providerName: provider.fullName, category: provider.serviceType }
          })}
        />
      </View>
    </SafeAreaView>
  );
};
