import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { ComingSoon } from "../../components/ui/ComingSoon";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, Sparkles } from "lucide-react-native";

const ALL_CATEGORIES = [
  { id: 1, name: "Cooking", count: "12 Services", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=300" },
  { id: 2, name: "Cleaning", count: "8 Services", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=300" },
  { id: 3, name: "Shipping", count: "15 Services", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=300" },
  { id: 4, name: "Plumber", count: "20 Services", image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=300" },
  { id: 5, name: "Electrician", count: "10 Services", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=300" },
  { id: 6, name: "Painting", count: "6 Services", image: "https://images.unsplash.com/photo-1589939705384-5185138a047a?auto=format&fit=crop&q=80&w=300" },
];

export default function CategoriesScreen() {
  const { showToast } = useToast();
  const categoryDisclosure = useDisclosure();
  const [selectedCat, setSelectedCat] = useState<any>(null);

  const handleCategoryPress = (cat: any) => {
    setSelectedCat(cat);
    categoryDisclosure.open();
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top', 'bottom']}>
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="All Categories" subtitle="Find the best service" />
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between pb-40">
            {ALL_CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                activeOpacity={0.9}
                onPress={() => handleCategoryPress(cat)}
                className="w-[48%] mb-6 rounded-[28px] overflow-hidden shadow-sm border border-slate-50 bg-white"
              >
                <View className="h-44 w-full">
                  <Image source={{ uri: cat.image }} className="w-full h-full" resizeMode="cover" />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    className="absolute inset-0 justify-end p-4"
                  >
                    <Text weight="bold" className="text-white text-lg">{cat.name}</Text>
                    <Text className="text-white/60 text-xs mt-1">{cat.count}</Text>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <AppModal visible={categoryDisclosure.isOpen} onClose={categoryDisclosure.close} title={selectedCat?.name}>
          {selectedCat && (
            <View className="mt-4">
              <View className="bg-primary/5 p-6 rounded-[32px] mb-8 items-center border border-primary/10">
                <Sparkles size={40} color="#4C6FFF" className="mb-4" />
                <Text weight="bold" className="text-xl text-slate-900 text-center">
                  Discover {selectedCat.name} Services
                </Text>
                <Text className="text-slate-500 text-center mt-2 px-4">
                  Browse through {selectedCat.count} available professional providers in your area.
                </Text>
              </View>
              <Button title="View All Services" onPress={() => {
                categoryDisclosure.close();
                showToast(`Listing for ${selectedCat.name} coming soon`, "info");
              }} size="lg" icon={<ArrowRight size={20} color="white" />} />
            </View>
          )}
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
