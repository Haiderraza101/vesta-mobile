import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Selector } from "@/components/ui/Selector";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useToast } from "@/context/ToastContext";
import { serviceService, Category, Service } from "@/services/serviceService";
import { storageService } from "@/services/storageService";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { ImageSourceModal } from "@/components/ui/ImageSourceModal";
import { ArrowLeft, Plus, Image as ImageIcon, Briefcase } from "lucide-react-native";
import { ServiceListItem } from "@/components/admin/ServiceListItem";

export default function ServiceManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  const addDisclosure = useDisclosure();
  
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const fetchCats = async () => {
      const data = await serviceService.getCategories();
      setCategories(data);
    };
    fetchCats();

    const unsubscribe = serviceService.subscribeToTemplates((data) => {
      setServices(data);
      setLoading(false);
      setRefreshing(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const uri = await storageService.pickImage(useCamera);
      if (uri) setImageUri(uri);
      setShowPicker(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error picking image";
      showToast(message, "error");
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
        providerId: "system-admin",
        isTemplate: true
      });
      showToast("Service added successfully", "success");
      setTitle("");
      setPrice("");
      setCategory("");
      setDescription("");
      setImageUri(null);
      addDisclosure.close();
    } catch (error) {
      showToast("Failed to add service", "error");
    } finally {
      setSubmitting(true);
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await serviceService.deleteService(deleteId);
      showToast("Service removed", "success");
      setDeleteId(null);
    } catch (error) {
      showToast("Failed to delete service", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !refreshing) return <LoadingState />;

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={["top"]} className="flex-1">
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
              <ArrowLeft size={24} color="#1E293B" />
            </TouchableOpacity>
            <Text weight="bold" className="text-2xl text-slate-900">Marketplace</Text>
          </View>
          <TouchableOpacity 
            onPress={addDisclosure.open}
            className="w-10 h-10 bg-primary rounded-xl items-center justify-center shadow-lg shadow-primary/20"
          >
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
        >
          {services.length === 0 ? (
            <EmptyState 
              title="No services yet" 
              description="Add template services for providers to apply" 
              icon={Briefcase}
            />
          ) : (
            <View className="py-4 gap-4">
              {services.map((service) => (
                <ServiceListItem 
                  key={service.id} 
                  service={service} 
                  onDelete={() => setDeleteId(service.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>

        <ModalLayout
          visible={addDisclosure.isOpen}
          onClose={addDisclosure.close}
          title="Add Template Service"
        >
          <ScrollView className="p-6" showsVerticalScrollIndicator={false}>
            <TouchableOpacity 
              onPress={() => setShowPicker(true)}
              className="w-full h-48 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 items-center justify-center mb-8 overflow-hidden"
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center shadow-sm mb-3">
                    <ImageIcon size={24} color="#4C6FFF" />
                  </View>
                  <Text weight="bold" className="text-slate-400 text-xs">Upload Service Image</Text>
                </View>
              )}
            </TouchableOpacity>

            <View className="gap-y-1">
              <Input label="Service Title" placeholder="e.g. Home Cleaning" value={title} onChangeText={setTitle} />
              <Input label="Base Price ($)" placeholder="0.00" keyboardType="numeric" value={price} onChangeText={setPrice} />
              <Selector 
                label="Category" 
                options={categories.map(c => ({ label: c.name, value: c.name }))} 
                value={category} 
                onSelect={setCategory} 
                placeholder="Select category"
              />
              <Input 
                label="Description" 
                placeholder="Describe the service details..." 
                value={description} 
                onChangeText={setDescription} 
                multiline 
                numberOfLines={4}
                className="h-32 pt-4"
              />
            </View>

            <Button 
              title="Create Template" 
              onPress={handleAddService} 
              loading={submitting}
              className="mt-6 mb-12"
            />
          </ScrollView>
        </ModalLayout>

        <DeleteModal 
          visible={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Remove Service?"
          description="This will remove this service template from the provider marketplace."
        />

        <ImageSourceModal 
          visible={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={handlePickImage}
        />
      </SafeAreaView>
    </View>
  );
}
