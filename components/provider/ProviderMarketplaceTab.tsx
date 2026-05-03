import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { LoadingState } from '@/components/ui/LoadingState';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useDisclosure } from '@/hooks/useDisclosure';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { serviceService, Service } from '@/services/serviceService';
import { Briefcase, Info, Plus, ChevronRight, Search } from 'lucide-react-native';

export function ProviderMarketplaceTab() {
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

  useEffect(() => {
    const unsubscribe = serviceService.subscribeToTemplates((data) => {
      setServices(data);
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

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
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <ScreenHeader title="Marketplace" subtitle="Find services to provide" />
        <View className="px-6 pb-4">
          <Input 
            placeholder="Search services..." 
            leftIcon={<Search size={18} color="#94A3B8" />}
            value={search}
            onChangeText={setSearch}
            className="bg-slate-50 border-0"
          />
        </View>
      </SafeAreaView>

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
      >
        {filteredServices.length === 0 ? (
          <EmptyState 
            title="No services found" 
            description="Check back later for new opportunities" 
            icon={Briefcase}
          />
        ) : (
          <View className="gap-4">
            {filteredServices.map((service) => (
              <TouchableOpacity 
                key={service.id}
                onPress={() => {
                  setSelectedService(service);
                  setMyPrice(service.price.toString());
                  applyDisclosure.open();
                }}
                activeOpacity={0.9}
                className="bg-white p-4 rounded-[32px] border border-slate-100 flex-row items-center"
              >
                <Image source={{ uri: service.image }} className="w-20 h-20 rounded-2xl" />
                <View className="flex-1 ml-4">
                  <Text weight="bold" className="text-slate-900 text-base">{service.title}</Text>
                  <Text className="text-slate-400 text-xs mt-0.5">{service.category}</Text>
                  <View className="flex-row items-center mt-2">
                    <Text weight="bold" className="text-primary text-sm">Base: ${service.price}</Text>
                  </View>
                </View>
                <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center">
                  <Plus size={20} color="#4C6FFF" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <ModalLayout
        visible={applyDisclosure.isOpen}
        onClose={applyDisclosure.close}
        title="Apply for Service"
      >
        <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
          <View className="bg-slate-50 p-6 rounded-[32px] mb-8 flex-row items-center gap-4">
            <Image source={{ uri: selectedService?.image }} className="w-16 h-16 rounded-xl" />
            <View>
              <Text weight="bold" className="text-slate-900 text-lg">{selectedService?.title}</Text>
              <Text className="text-slate-500 text-xs">{selectedService?.category}</Text>
            </View>
          </View>

          <View className="gap-y-1">
            <Input 
              label="Your Price ($)" 
              placeholder="Enter your rate" 
              keyboardType="numeric" 
              value={myPrice} 
              onChangeText={setMyPrice} 
            />
            <Input 
              label="Years of Experience" 
              placeholder="e.g. 5 years" 
              value={experience} 
              onChangeText={setExperience} 
            />
            <Input 
              label="Additional Info" 
              placeholder="Tell us why you are a good fit..." 
              value={additionalInfo} 
              onChangeText={setAdditionalInfo} 
              multiline 
              numberOfLines={4}
              className="h-32 pt-4"
            />
          </View>

          <View className="bg-blue-50 p-4 rounded-2xl flex-row items-center gap-3 mb-8">
            <Info size={18} color="#4C6FFF" />
            <Text className="text-blue-700 text-xs flex-1 font-medium">
              Your application will be reviewed by the admin. Once approved, this service will be live on your profile.
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
