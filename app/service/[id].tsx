import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { serviceService, Service } from "../../services/serviceService";
import { ArrowLeft, Star, Clock, MapPin, ShieldCheck, Heart, Share2 } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, we'd fetch by ID. For now, we'll find it from the list
    // or pass the full object. Since we want real-time, we'll subscribe.
    const unsubscribe = serviceService.subscribeToServices((services) => {
      const found = services.find(s => s.id === id);
      if (found) setService(found);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-10">
        <Text weight="bold" className="text-xl text-slate-900 text-center">Service not found</Text>
        <Button title="Go Back" className="mt-6 w-full rounded-full" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="relative">
          <Image source={{ uri: service.image }} className="w-full h-[450px]" resizeMode="cover" />
          <LinearGradient 
            colors={['rgba(0,0,0,0.4)', 'transparent', 'transparent', 'rgba(255,255,255,1)']} 
            className="absolute inset-0" 
          />
          
          <SafeAreaView className="absolute top-0 left-0 right-0 px-6 pt-4 flex-row justify-between items-center">
            <TouchableOpacity 
              onPress={() => router.back()}
              className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-md border border-white/30"
            >
              <ArrowLeft size={22} color="white" />
            </TouchableOpacity>
            <View className="flex-row gap-3">
              <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-md border border-white/30">
                <Heart size={22} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 bg-white/20 rounded-2xl items-center justify-center backdrop-blur-md border border-white/30">
                <Share2 size={22} color="white" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-8 -mt-10 bg-white rounded-t-[48px] pt-10 pb-32">
          <View className="flex-row justify-between items-start mb-6">
            <View className="flex-1 pr-6">
               <View className="bg-primary/10 self-start px-4 py-1.5 rounded-full mb-4">
                  <Text weight="bold" className="text-primary text-[10px] uppercase tracking-widest">{service.category}</Text>
               </View>
               <Text weight="bold" className="text-[34px] leading-[44px] text-slate-900 mb-2">{service.title}</Text>
               <View className="flex-row items-center gap-4">
                  <View className="flex-row items-center gap-1.5">
                    <Star size={18} color="#F59E0B" fill="#F59E0B" />
                    <Text weight="bold" className="text-slate-800 text-lg">{service.rating}</Text>
                  </View>
                  <Text className="text-slate-300 text-xl">|</Text>
                  <Text className="text-slate-500 font-medium">{service.reviews} Verified Reviews</Text>
               </View>
            </View>
          </View>

          <View className="h-[1px] bg-slate-100 w-full mb-8" />

          <View className="flex-row justify-between mb-10">
             <View className="items-center gap-2 flex-1">
                <View className="w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center">
                   <Clock size={24} color="#64748B" />
                </View>
                <Text weight="bold" className="text-slate-900">45-60 min</Text>
                <Text className="text-slate-400 text-[10px] uppercase">Duration</Text>
             </View>
             <View className="w-[1px] h-full bg-slate-50" />
             <View className="items-center gap-2 flex-1">
                <View className="w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center">
                   <ShieldCheck size={24} color="#10B981" />
                </View>
                <Text weight="bold" className="text-slate-900">Certified</Text>
                <Text className="text-slate-400 text-[10px] uppercase">Service</Text>
             </View>
             <View className="w-[1px] h-full bg-slate-50" />
             <View className="items-center gap-2 flex-1">
                <View className="w-14 h-14 bg-slate-50 rounded-2xl items-center justify-center">
                   <MapPin size={24} color="#F43F5E" />
                </View>
                <Text weight="bold" className="text-slate-900">On-site</Text>
                <Text className="text-slate-400 text-[10px] uppercase">Available</Text>
             </View>
          </View>

          <Text weight="bold" className="text-xl text-slate-900 mb-4">About Service</Text>
          <Text className="text-slate-500 leading-8 text-base mb-10">
            {service.description} This professional {service.title} service is designed to provide you with the highest quality experience. Our verified experts ensure every detail is handled with precision and care.
          </Text>

          <View className="bg-slate-900 p-8 rounded-[40px] flex-row justify-between items-center">
             <View>
                <Text className="text-slate-400 text-sm mb-1">Total Price</Text>
                <Text weight="bold" className="text-3xl text-white">${service.price}</Text>
             </View>
             <Button 
                title="Book Now" 
                className="rounded-full px-10 h-14" 
                onPress={() => router.push({
                  pathname: "/book-service",
                  params: { 
                    serviceId: service.id,
                    serviceName: service.title,
                    servicePrice: service.price.toString().startsWith('$') ? service.price : `$${service.price}`,
                    serviceImage: service.image,
                    providerId: service.providerId
                  }
                })}
              />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
