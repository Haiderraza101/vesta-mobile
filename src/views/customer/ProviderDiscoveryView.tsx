import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProviderDiscoveryViewModel } from '../../viewmodels/useProviderDiscoveryViewModel';
import { theme } from '../../utils/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Star, ArrowLeft, MapPin } from 'lucide-react-native';

const ProviderCard = ({ provider, onPress }: any) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    className="bg-white p-4 rounded-3xl mb-4 border border-slate-100 flex-row"
    style={theme.shadows}
  >
    <View className="w-20 h-20 rounded-2xl bg-blue-50 overflow-hidden mr-4">
      {provider.profileImageUrl ? (
        <Image source={{ uri: provider.profileImageUrl }} className="w-full h-full" />
      ) : (
        <View className="w-full h-full items-center justify-center">
          <Text className="text-blue-500 font-bold text-xl">{provider.fullName[0]}</Text>
        </View>
      )}
    </View>
    <div className="flex-1 justify-center">
      <Text className="text-lg font-bold text-slate-900 mb-1">{provider.fullName}</Text>
      <View className="flex-row items-center mb-1">
        <Star size={14} color="#F59E0B" fill="#F59E0B" />
        <Text className="text-slate-700 text-sm font-semibold ml-1">
          {provider.rating === 0 ? 'New' : provider.rating.toFixed(1)}
        </Text>
        <Text className="text-slate-400 text-xs ml-2">({provider.totalJobs} jobs)</Text>
      </View>
      <View className="flex-row items-center">
        <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
        <Text className="text-green-600 text-xs font-bold uppercase">Available</Text>
      </View>
    </div>
  </TouchableOpacity>
);

export const ProviderDiscoveryView = () => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { providers, loading } = useProviderDiscoveryViewModel(category);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <View className="px-6 py-4 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} color={theme.colors.foreground} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900 ml-2">{category}s</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={theme.colors.secondary} />
        </View>
      ) : (
        <FlatList
          data={providers}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={{ padding: 24 }}
          renderItem={({ item }) => (
            <ProviderCard
              provider={item}
              onPress={() => router.push({
                pathname: "/(customer-tabs)/provider-detail",
                params: { providerData: JSON.stringify(item) }
              })}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-slate-500 text-lg">No {category.toLowerCase()}s available right now.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};
