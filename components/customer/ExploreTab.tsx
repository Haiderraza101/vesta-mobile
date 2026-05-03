import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useToast } from '@/context/ToastContext';
import { serviceService, Category } from '@/services/serviceService';
import { ChevronRight } from 'lucide-react-native';

export function ExploreTab() {
  const router = useRouter();
  const { showToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      const data = await serviceService.getCategories();
      setCategories(data);
    } catch (error) {
      showToast("Failed to load categories", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <ScreenHeader title="Explore" showProfile={false} />
      </SafeAreaView>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 140 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />}
      >
        <View className="flex-row flex-wrap justify-between">
          {categories.map((cat) => (
            <TouchableOpacity 
              key={cat.id} 
              activeOpacity={0.8}
              onPress={() => router.push({
                pathname: "/",
                params: { category: cat.name }
              })}
              className="w-[48%] bg-white rounded-2xl p-4 mb-4 border border-slate-50 shadow-sm items-center"
            >
              <View className="w-16 h-16 bg-primary/5 rounded-2xl items-center justify-center mb-3">
                <Image 
                  source={{ uri: cat.image || 'https://images.unsplash.com/photo-1581578731548-c64695cc6958' }} 
                  className="w-10 h-10 rounded-lg"
                  resizeMode="contain"
                />
              </View>
              <Text weight="bold" className="text-[15px] text-slate-900 text-center mb-1">{cat.name}</Text>
              <View className="flex-row items-center gap-1">
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Browse</Text>
                <ChevronRight size={10} color="#CBD5E1" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
