import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCustomerHomeViewModel } from '../../viewmodels/useCustomerHomeViewModel';
import { theme } from '../../utils/theme';
import { useRouter } from 'expo-router';
import { BrushCleaning, Zap, Wrench, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const CategoryCard = ({ item, onPress }: any) => {
  const Icon = item.id === 'Cleaning' ? BrushCleaning : item.id === 'Electrical' ? Zap : Wrench;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-white p-5 rounded-[30px] mb-4 flex-row items-center border border-slate-100"
      style={theme.shadows}
    >
      <View
        className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
        style={{ backgroundColor: item.color }}
      >
        <Icon size={28} color={item.iconColor} />
      </View>
      <View className="flex-1">
        <Text className="text-lg font-bold text-slate-900">{item.name}</Text>
        <Text className="text-slate-500 text-sm">Find expert {item.name.toLowerCase()}s</Text>
      </View>
      <ChevronRight size={20} color={theme.colors.muted} />
    </TouchableOpacity>
  );
};

export const CustomerHomeView = () => {
  const { firstName, greeting, categories, profileImageUrl } = useCustomerHomeViewModel();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <ScrollView className="flex-1 px-6">
        <View className="flex-row items-center justify-between py-6">
          <View>
            <Text className="text-slate-500 text-base font-medium">{greeting}</Text>
            <Text className="text-2xl font-bold text-slate-900">{firstName}!</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(customer-tabs)/profile')}>
            <View className="w-14 h-14 rounded-full bg-blue-100 border-2 border-white overflow-hidden" style={theme.shadows}>
              {profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Text className="text-blue-600 font-bold text-lg">{firstName[0]}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[theme.colors.secondary, '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="p-8 rounded-[40px] mb-10 overflow-hidden"
          style={theme.shadows}
        >
          <Text className="text-white text-2xl font-bold mb-2">What do you need help with today?</Text>
          <Text className="text-white/80 text-base">Book a professional in seconds.</Text>
        </LinearGradient>

        <View className="mb-4">
          <Text className="text-xl font-bold text-slate-900 mb-6">Our Services</Text>
          {categories.map((item) => (
            <CategoryCard
              key={item.id}
              item={item}
              onPress={() => router.push({
                pathname: "/(customer-tabs)/discovery",
                params: { category: item.id }
              })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
