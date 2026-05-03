import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, RefreshControl, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { serviceService, Service } from '@/services/serviceService';
import { ChevronLeft, Info, Plus, Search } from 'lucide-react-native';

export default function ProviderMarketplace() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const applyDisclosure = useDisclosure();
  
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [myPrice, setMyPrice] = useState("");
  const [experience, setExperience] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const fetchData = async () => {
    try {
      const data = await serviceService.getTemplateServices();
      setServices(data);
    } catch (error) {
      showToast("Failed to load services", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userProfile && !userProfile.isHired) {
      showToast("Please apply to join Vesta first", "error");
      router.back();
      return;
    }
    fetchData();
  }, [userProfile]);

  const handleApply = async () => {
    if (!selectedService || !myPrice || !experience) {
      showToast("Please fill required fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      await serviceService.requestServiceProvision({
        providerId: user!.uid,
        providerName: userProfile!.fullName,
        serviceId: selectedService.id,
        serviceName: selectedService.title,
        proposedPrice: parseFloat(myPrice),
        experience: experience,
        additionalInfo: additionalInfo,
        category: selectedService.category,
        image: selectedService.image
      });
      showToast("Application sent to Admin!", "success");
      applyDisclosure.close();
      setMyPrice("");
      setExperience("");
      setAdditionalInfo("");
    } catch (error) {
      showToast("Failed to send application", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(search.toLowerCase()) || 
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && !refreshing) return <LoadingState />;

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <View className="px-6 py-4 flex-row items-center gap-4">
          <TouchableOpacity onPress={() => router.back()} className="h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
            <ChevronLeft size={20} color="#1E293B" />
          </TouchableOpacity>
          <View>
            <Text weight="bold" className="text-xl text-slate-900">Service Marketplace</Text>
            <Text className="text-slate-400 text-xs">Apply to provide services</Text>
          </View>
        </View>
        <View className="px-6 pb-4">
          <Input 
            placeholder="Search templates..." 
            leftIcon={<Search size={18} color="#94A3B8" />}
            value={search}
            onChangeText={setSearch}
            className="bg-slate-50 border-0"
          />
        </View>
      </SafeAreaView>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} />}
      >
        <View className="gap-6">
          {filteredServices.map((service) => (
            <TouchableOpacity 
              key={service.id}
              onPress={() => {
                setSelectedService(service);
                setMyPrice(service.price.toString());
                applyDisclosure.open();
              }}
              activeOpacity={0.9}
              className="bg-white p-6 rounded-[40px] border border-slate-50 shadow-sm"
            >
              <View className="flex-row items-center mb-6">
                <Image source={{ uri: service.image }} className="w-16 h-16 rounded-2xl" />
                <View className="ml-4 flex-1">
                  <Text weight="bold" className="text-lg text-slate-900">{service.title}</Text>
                  <Text className="text-slate-400 text-xs mt-1">{service.category}</Text>
                </View>
              </View>

              <Text className="text-slate-500 text-sm leading-5 mb-6" numberOfLines={3}>
                {service.description}
              </Text>

              <View className="flex-row justify-between items-center bg-slate-50 p-4 rounded-3xl">
                <View>
                  <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Base Price</Text>
                  <Text weight="bold" className="text-primary text-xl">${service.price}</Text>
                </View>
                <View className="w-12 h-12 bg-primary rounded-2xl items-center justify-center">
                  <Plus size={24} color="white" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ModalLayout
        visible={applyDisclosure.isOpen}
        onClose={applyDisclosure.close}
        title="Apply to Provide"
      >
        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          <View className="gap-y-1">
            <Input 
              label="Proposed Rate ($)" 
              placeholder="e.g. 50" 
              keyboardType="numeric" 
              value={myPrice} 
              onChangeText={setMyPrice} 
            />
            <Input 
              label="Experience Level" 
              placeholder="e.g. 3+ Years" 
              value={experience} 
              onChangeText={setExperience} 
            />
            <Input 
              label="Why should we hire you?" 
              placeholder="Mention your certifications or skills..." 
              value={additionalInfo} 
              onChangeText={setAdditionalInfo} 
              multiline 
              className="h-32 pt-4"
            />
          </View>

          <View className="bg-blue-50 p-5 rounded-3xl flex-row items-center gap-3 mb-8">
            <Info size={18} color="#4C6FFF" />
            <Text className="text-blue-700 text-xs flex-1 font-medium">
              After you submit, the Admin will review your profile. Approved services appear instantly on your provider profile.
            </Text>
          </View>

          <Button 
            title="Submit Application" 
            onPress={handleApply} 
            loading={submitting}
            className="mb-12 h-14 rounded-2xl"
          />
        </ScrollView>
      </ModalLayout>
    </View>
  );
}
