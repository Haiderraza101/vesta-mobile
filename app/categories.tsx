import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { serviceService, Category } from "@/services/serviceService";
import { ArrowLeft, Search, ChevronRight } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Input } from "@/components/ui/Input";

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const unsubscribe = serviceService.subscribeToCategories((data) => {
      setCategories(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F8FAFC', '#FFFFFF']} className="flex-1">
        <View className="px-6 pt-6 mb-8 flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-slate-100 shadow-sm"
          >
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text weight="bold" className="text-2xl text-slate-900">All Categories</Text>
            <Text className="text-slate-500 text-sm">Explore services by type</Text>
          </View>
        </View>

        <View className="px-6 mb-8">
          <View className="flex-row items-center bg-white rounded-3xl px-6 h-[64px] shadow-sm border border-slate-50">
            <Search size={22} color="#94A3B8" />
            <Input 
              placeholder="Search categories..." 
              className="flex-1 mb-0 border-0 h-[64px] ml-2"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="flex-row flex-wrap justify-between gap-y-6">
            {filteredCategories.map((cat) => (
              <TouchableOpacity 
                key={cat.id}
                activeOpacity={0.8}
                style={{ width: '47%' }}
                onPress={() => router.push({
                  pathname: "/(tabs)",
                  params: { category: cat.name }
                })}
              >
                <View className="bg-white rounded-[32px] overflow-hidden border border-slate-50 shadow-sm">
                  <View className="h-32 w-full">
                    <Image source={{ uri: cat.image }} className="w-full h-full" resizeMode="cover" />
                  </View>
                  <View className="p-4 items-center">
                    <Text weight="bold" className="text-slate-900 text-base">{cat.name}</Text>
                    <View className="mt-2 w-8 h-8 bg-primary/5 rounded-full items-center justify-center">
                       <ChevronRight size={14} color="#4C6FFF" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {filteredCategories.length === 0 && (
            <View className="py-20 items-center">
               <Text className="text-slate-400">No categories match your search</Text>
            </View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
