import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Selector } from "../../components/ui/Selector";
import { ModalLayout } from "../../components/ui/ModalLayout";
import { LoadingState } from "../../components/ui/LoadingState";
import { EmptyState } from "../../components/ui/EmptyState";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { serviceService, Category, Service } from "../../services/serviceService";
import { configService, PlatformSettings } from "../../services/configService";
import { storageService } from "../../services/storageService";
import { Price } from "../../components/ui/Price";
import { DeleteModal } from "../../components/ui/DeleteModal";
import { ImageSourceModal } from "../../components/ui/ImageSourceModal";
import { ArrowLeft, Plus, Trash2, Tag, DollarSign, Image as ImageIcon, AlignLeft, Briefcase } from "lucide-react-native";

export default function ServiceManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  const addDisclosure = useDisclosure();
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [cats, servs, config] = await Promise.all([
        serviceService.getCategories(),
        serviceService.getPopularServices(),
        configService.getSettings()
      ]);
      setCategories(cats);
      setServices(servs);
      setSettings(config);
    } catch (error) {
      showToast("Failed to fetch data", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const uri = await storageService.pickImage(useCamera);
      if (uri) setImageUri(uri);
      setShowPicker(false);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleAddService = async () => {
    if (!title || !price || !category || !description || !imageUri) {
      showToast("Please fill all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      const downloadUrl = await storageService.uploadImage(imageUri, 'services');
      await serviceService.addService({
        title,
        price: parseFloat(price),
        category,
        description,
        image: downloadUrl,
        rating: "5.0",
        reviews: "0",
        providerId: "system-admin"
      });
      showToast("Service added successfully", "success");
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUri(null);
      addDisclosure.close();
      fetchData();
    } catch (error) {
      showToast("Failed to add service", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await serviceService.deleteService(deleteId);
      showToast("Service deleted", "success");
      setDeleteId(null);
      fetchData();
    } catch (error) {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingState message="Syncing marketplace services..." />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <DeleteModal 
        visible={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Service"
        description="Are you sure you want to remove this service? This action cannot be undone."
      />
      <ImageSourceModal 
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handlePickImage}
      />
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl">
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text weight="bold" className="text-xl text-slate-900">Services</Text>
          <TouchableOpacity onPress={addDisclosure.open} className="h-12 w-12 items-center justify-center bg-primary rounded-2xl">
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchData(); }} colors={['#4C6FFF']} />
          }
        >
          {services.length === 0 ? (
            <EmptyState 
              title="No services found" 
              description="Your marketplace is empty. Create your first service listing." 
              icon={Briefcase}
              actionTitle="Add Service"
              onAction={addDisclosure.open}
            />
          ) : (
            <View className="gap-5 pb-10">
              {services.map((service) => (
                <View key={service.id} className="bg-slate-50 p-5 rounded-[32px] border border-slate-100 flex-row gap-5">
                  <Image source={{ uri: service.image }} className="w-20 h-20 rounded-2xl" />
                  <View className="flex-1">
                    <Text weight="bold" className="text-base text-slate-900">{service.title}</Text>
                    <Price amount={service.price} className="mt-1" />
                    <View className="bg-white border border-slate-100 self-start px-2.5 py-1 rounded-full mt-2">
                      <Text weight="bold" className="text-[10px] text-slate-400 uppercase tracking-widest">{service.category}</Text>
                    </View>
                  </View>
                  <TouchableOpacity 
                    className="w-11 h-11 bg-white rounded-2xl items-center justify-center self-center border border-slate-100"
                    onPress={() => setDeleteId(service.id)}
                  >
                    <Trash2 size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <ModalLayout visible={addDisclosure.isOpen} onClose={addDisclosure.close} title="New Service">
          <View className="mt-2">
            <Input 
              label="Service Title" 
              placeholder="e.g. Premium Cleaning" 
              value={title} 
              onChangeText={setTitle} 
            />
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Input 
                  label={`Price (${settings?.currencyCode || 'USD'})`} 
                  placeholder="0.00" 
                  keyboardType="numeric"
                  value={price} 
                  onChangeText={setPrice} 
                />
              </View>
            </View>
            <Selector 
              label="Select Category"
              options={categories.map(c => ({ label: c.name, value: c.name }))}
              value={category}
              onSelect={setCategory}
            />
            <Input 
              label="Description" 
              placeholder="Briefly describe the service offering..." 
              value={description} 
              onChangeText={setDescription} 
              multiline
              numberOfLines={3}
            />
            
            <View className="mt-4">
              <Text weight="semibold" className="text-slate-700 text-sm mb-3">Service Image</Text>
              <TouchableOpacity 
                onPress={() => setShowPicker(true)}
                className="w-full h-48 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden"
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} className="w-full h-full" />
                ) : (
                  <View className="items-center">
                    <View className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-sm mb-3">
                      <ImageIcon size={28} color="#4C6FFF" />
                    </View>
                    <Text weight="medium" className="text-slate-400">Add Service Photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Button 
              title={submitting ? "Publishing..." : "Create Service"} 
              onPress={handleAddService} 
              loading={submitting}
              className="mt-10 rounded-full h-16"
            />
          </View>
        </ModalLayout>
      </View>
    </SafeAreaView>
  );
}
