import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, StatusBar, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { SectionHeader } from "../../components/ui/SectionHeader";
import { Card } from "../../components/ui/Card";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ComingSoon } from "../../components/ui/ComingSoon";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { Search, SlidersHorizontal, ArrowUpRight, Sparkles, Star, Clock, X, CheckCircle2 } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH * 0.85;

const CATEGORIES = [
  { id: 1, name: "Cooking", image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=150" },
  { id: 2, name: "Cleaning", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=150" },
  { id: 3, name: "Shipping", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=150" },
  { id: 4, name: "Plumber", image: "https://images.unsplash.com/photo-1581578731522-745d05cb9704?auto=format&fit=crop&q=80&w=150" },
];

const POPULAR_SERVICES = [
  { 
    id: 1, 
    title: "Home Cleaning", 
    price: "$120", 
    rating: "4.8",
    reviews: "1.2k",
    description: "Professional home cleaning including deep sanitization of all rooms and kitchen. Our experts use eco-friendly materials.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=500"
  },
  { 
    id: 2, 
    title: "Plumber Service", 
    price: "$180", 
    rating: "4.9",
    reviews: "850",
    description: "Expert plumbing services for leaks, pipe repairs, and new installations. Available 24/7 for emergencies.",
    image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=500"
  },
];

const NOTIFICATIONS = [
  { id: 1, title: "Booking Confirmed", desc: "Your cleaning service is confirmed for Oct 24.", time: "2h ago", icon: <CheckCircle2 size={18} color="#10B981" /> },
  { id: 2, title: "45% Promo Code", desc: "Use code VESTA45 for your next booking!", time: "5h ago", icon: <Sparkles size={18} color="#4C6FFF" /> },
];

export default function HomeDashboard() {
  const router = useRouter();
  const { showToast } = useToast();
  const filterDisclosure = useDisclosure();
  const searchDisclosure = useDisclosure();
  const notifDisclosure = useDisclosure();
  const [selectedService, setSelectedService] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <ScreenHeader 
            title="Hello, Haider Raza" 
            subtitle="Pakistan" 
            onNotificationPress={notifDisclosure.open} 
          />

          <View className="px-6 mt-6 mb-6">
            <Text weight="bold" className="text-[28px] leading-[38px] text-slate-900">
              Which services{"\n"}would you like to use
            </Text>
          </View>

          <View className="px-6 flex-row items-center gap-3 mb-8">
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={searchDisclosure.open}
              className="flex-1 flex-row items-center bg-white rounded-2xl px-5 h-[56px] shadow-sm border border-slate-100"
            >
              <Search size={20} color="#94A3B8" />
              <Text className="text-slate-400 ml-3 flex-1 text-[15px]">Search Service..</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={filterDisclosure.open}
              className="w-[56px] h-[56px] items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100"
            >
              <SlidersHorizontal size={20} color="#1E293B" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-10"
            contentContainerStyle={{ paddingLeft: 24, paddingRight: 8 }}
            decelerationRate="fast"
            snapToInterval={BANNER_WIDTH + 16} 
          >
            {[1, 2].map((i) => (
              <TouchableOpacity key={i} activeOpacity={0.9} onPress={() => setSelectedService(POPULAR_SERVICES[i-1])}>
                <View 
                  className={`${i === 1 ? 'bg-[#E0F7EF]' : 'bg-[#E0E7FF]'} rounded-[32px] p-6 mr-4 flex-row items-center overflow-hidden h-44`}
                  style={{ width: BANNER_WIDTH }}
                >
                  <View className="flex-1 z-10">
                    <Text weight="bold" className="text-3xl text-[#1E293B] mb-1">{i === 1 ? '45%' : '35%'} OFF</Text>
                    <Text className="text-slate-500 text-sm leading-[18px] mb-4">
                      Exclusive discounts on{"\n"}home service
                    </Text>
                    <View className="bg-primary self-start px-6 py-[10px] rounded-[14px]">
                      <Text weight="bold" className="text-white text-xs">Book Now</Text>
                    </View>
                  </View>
                  <Image 
                    source={{ uri: i === 1 ? "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=500" : "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=500" }} 
                    className="absolute right-[-10] bottom-[-20] w-[180px] h-[180px]"
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View className="px-6 mb-10">
            <SectionHeader title="Service Category" onSeeAll={() => router.push('/categories')} />
            <View className="flex-row justify-between flex-wrap gap-y-4">
              {CATEGORIES.map((cat) => (
                <TouchableOpacity 
                  key={cat.id} 
                  className="items-center"
                  style={{ width: '22%' }}
                  onPress={() => setActiveCategory(cat.name)}
                >
                  <View className={`w-full aspect-square rounded-2xl overflow-hidden mb-2.5 shadow-sm border ${activeCategory === cat.name ? 'border-primary border-2' : 'border-slate-50 bg-white'}`}>
                    <Image 
                      source={{ uri: cat.image }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <Text weight="bold" className={`text-[12px] text-center ${activeCategory === cat.name ? 'text-primary' : 'text-slate-600'}`}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="px-6 pb-40">
            <SectionHeader title="Popular Service" onSeeAll={() => router.push('/bookings')} />
            <View className="gap-y-6">
              {POPULAR_SERVICES.map((service) => (
                <Card 
                  key={service.id} 
                  className="overflow-hidden"
                  style={{ width: '100%' }}
                  onPress={() => setSelectedService(service)}
                >
                  <View className="aspect-[4/3] w-full relative">
                    <Image 
                      source={{ uri: service.image }} 
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={['transparent', 'rgba(0,0,0,0.4)']}
                      className="absolute inset-x-0 bottom-0 h-1/2"
                    />
                    <View className="absolute bottom-3 left-3 bg-white/95 px-2.5 py-1.5 rounded-full flex-row items-center gap-1 shadow-sm">
                      <Sparkles size={11} color="#4C6FFF" fill="#4C6FFF" />
                      <Text weight="bold" className="text-slate-800 text-[12px]">{service.price}</Text>
                    </View>
                    <View className="absolute bottom-3 right-3 w-[36px] h-[36px] bg-primary rounded-full items-center justify-center border-2 border-white shadow-md">
                      <ArrowUpRight size={18} color="white" strokeWidth={3} />
                    </View>
                  </View>
                  <View className="p-4">
                    <Text weight="bold" className="text-[15px] text-slate-900" numberOfLines={1}>{service.title}</Text>
                    <View className="flex-row items-center gap-1 mt-1">
                      <Star size={12} color="#F59E0B" fill="#F59E0B" />
                      <Text className="text-slate-400 text-[11px]">{service.rating} ({service.reviews})</Text>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </View>
        </ScrollView>

        <AppModal visible={searchDisclosure.isOpen} onClose={searchDisclosure.close} title="Search Service">
          <View className="mt-4">
            <Input 
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search for services..."
              leftIcon={<Search size={20} color="#94A3B8" />}
              rightIcon={searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <X size={18} color="#94A3B8" />
                </TouchableOpacity>
              ) : null}
            />
            <Text weight="bold" className="text-slate-900 mb-4 mt-2">Recent Searches</Text>
            {["Cleaning", "Plumber", "AC Repair"].map((s) => (
              <TouchableOpacity key={s} className="flex-row items-center py-4 border-b border-slate-50" onPress={() => setSearchQuery(s)}>
                <Clock size={16} color="#CBD5E1" />
                <Text className="text-slate-600 ml-3 text-base">{s}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Search Now" className="mt-8" onPress={searchDisclosure.close} />
          </View>
        </AppModal>

        <AppModal visible={notifDisclosure.isOpen} onClose={notifDisclosure.close} title="Notifications">
          <View className="mt-4">
            {NOTIFICATIONS.map((n) => (
              <View key={n.id} className="flex-row items-start gap-4 mb-6 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                <View className="w-10 h-10 rounded-xl bg-white items-center justify-center shadow-sm">
                  {n.icon}
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text weight="bold" className="text-slate-900">{n.title}</Text>
                    <Text className="text-slate-400 text-[10px] uppercase font-bold">{n.time}</Text>
                  </View>
                  <Text className="text-slate-500 text-sm leading-5">{n.desc}</Text>
                </View>
              </View>
            ))}
            <Button title="Mark all as read" variant="outline" onPress={() => {
              showToast("All notifications marked as read", "success");
              notifDisclosure.close();
            }} />
          </View>
        </AppModal>

        <AppModal visible={filterDisclosure.isOpen} onClose={filterDisclosure.close} title="Filters">
          <View className="mt-4">
            <Text weight="bold" className="text-lg mb-4 text-slate-800">Service Category</Text>
            <View className="flex-row flex-wrap gap-3 mb-8">
              {["All", "Cleaning", "Repair", "Painting", "Moving"].map((c) => (
                <TouchableOpacity 
                  key={c}
                  onPress={() => setActiveCategory(c)}
                  className={`px-6 py-3 rounded-2xl border ${activeCategory === c ? 'bg-primary border-primary' : 'bg-white border-slate-100'}`}
                >
                  <Text weight="bold" className={activeCategory === c ? 'text-white' : 'text-slate-500'}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text weight="bold" className="text-lg mb-4 text-slate-800">Price Range</Text>
            <View className="flex-row items-center justify-between mb-10">
              <View className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex-1 mr-2">
                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Min</Text>
                <Text weight="bold" className="text-slate-800 text-lg">$20</Text>
              </View>
              <View className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex-1 ml-2">
                <Text className="text-slate-400 text-[10px] uppercase font-bold mb-1">Max</Text>
                <Text weight="bold" className="text-slate-800 text-lg">$500</Text>
              </View>
            </View>

            <Button title="Apply Filters" onPress={() => {
              showToast("Filters applied", "success");
              filterDisclosure.close();
            }} size="lg" className="rounded-full" />
          </View>
        </AppModal>

        <AppModal visible={!!selectedService} onClose={() => setSelectedService(null)} title="Service Details">
          {selectedService && (
            <View className="mt-4">
              <Image source={{ uri: selectedService.image }} className="w-full h-48 rounded-[32px] mb-6" resizeMode="cover" />
              <View className="flex-row justify-between items-start mb-4">
                <View className="flex-1 pr-4">
                  <Text weight="bold" className="text-2xl text-slate-900 leading-8">{selectedService.title}</Text>
                  <View className="flex-row items-center gap-4 mt-2">
                    <View className="flex-row items-center gap-1">
                      <Star size={16} color="#F59E0B" fill="#F59E0B" />
                      <Text weight="bold" className="text-slate-700">{selectedService.rating}</Text>
                    </View>
                    <Text className="text-slate-300">|</Text>
                    <Text className="text-slate-500">{selectedService.reviews} Reviews</Text>
                  </View>
                </View>
                <Text weight="bold" className="text-2xl text-primary">{selectedService.price}</Text>
              </View>
              <Text className="text-slate-500 leading-6 text-base mb-10">{selectedService.description}</Text>
              <View className="flex-row gap-4">
                <Button title="Message" variant="outline" onPress={() => {
                  setSelectedService(null);
                  showToast("Messaging system coming soon", "info");
                }} className="flex-1" />
                <Button title="Book Now" onPress={() => {
                  setSelectedService(null);
                  router.push("/book-service");
                }} className="flex-1" />
              </View>
            </View>
          )}
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
