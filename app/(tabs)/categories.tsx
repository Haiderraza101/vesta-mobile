import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { serviceService, Category } from "../../services/serviceService";
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles, LayoutGrid } from "lucide-react-native";

export default function CategoriesScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const categoryDisclosure = useDisclosure();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
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

  const handleCategoryPress = (cat: Category) => {
    setSelectedCat(cat);
    categoryDisclosure.open();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top']}>
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="All Categories" subtitle="Find the best service" />
        
        <ScrollView 
          className="flex-1 px-6 pt-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4C6FFF" />}
        >
          <View className="flex-row flex-wrap justify-between pb-40">
            {categories.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                activeOpacity={0.9}
                onPress={() => handleCategoryPress(cat)}
                className="w-[48%] mb-6 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200 border border-white bg-white"
              >
                <View className="h-52 w-full">
                  <Image source={{ uri: cat.image }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.85)']}
                    className="absolute inset-0 justify-end p-5"
                  >
                    <Text weight="bold" className="text-white text-[19px] leading-6">{cat.name}</Text>
                    <View className="flex-row items-center gap-1.5 mt-1.5">
                      <LayoutGrid size={11} color="rgba(255,255,255,0.7)" />
                      <Text className="text-white/70 text-[11px] font-medium tracking-wide uppercase">Browse All</Text>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <AppModal visible={categoryDisclosure.isOpen} onClose={categoryDisclosure.close} title={selectedCat?.name}>
          {selectedCat && (
            <View className="mt-4">
              <View className="bg-slate-50 p-8 rounded-[40px] mb-8 items-center border border-slate-100">
                <View className="w-20 h-20 bg-white rounded-3xl items-center justify-center shadow-md mb-6">
                  <Sparkles size={40} color="#4C6FFF" strokeWidth={2} />
                </View>
                <Text weight="bold" className="text-2xl text-slate-900 text-center leading-8">
                  Discover {selectedCat.name} Services
                </Text>
                <Text className="text-slate-500 text-center mt-3 px-2 text-base leading-6">
                  Connect with top-rated {selectedCat.name.toLowerCase()} experts available near you today.
                </Text>
              </View>
              <Button 
                title="View All Services" 
                size="lg"
                onPress={() => {
                  categoryDisclosure.close();
                  router.push({
                    pathname: "/(tabs)",
                    params: { category: selectedCat.name }
                  });
                }} 
                className="rounded-full h-16 shadow-lg shadow-primary/30"
                iconRight={<ArrowRight size={20} color="white" strokeWidth={2.5} />} 
              />
            </View>
          )}
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
