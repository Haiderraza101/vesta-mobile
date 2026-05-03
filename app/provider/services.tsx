import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { AppModal } from "../../components/ui/AppModal";
import { Input } from "../../components/ui/Input";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { serviceService, Service, Category } from "../../services/serviceService";
import { providerService } from "../../services/providerService";
import { storageService } from "../../services/storageService";
import { ArrowLeft, Plus, Edit2, Trash2, Star, Tag, Package, Camera } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourceModal } from "../../components/ui/ImageSourceModal";

export default function ProviderServicesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();
  const addDisclosure = useDisclosure();
  const imageSourceDisclosure = useDisclosure();
  
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (!user?.uid) return;

    const unsubServices = providerService.subscribeToProviderServices(user.uid, (data) => {
      setMyServices(data);
      setLoading(false);
    });

    serviceService.getCategories().then(setCategories);

    return () => unsubServices();
  }, [user?.uid]);

  const handleSaveService = async () => {
    if (!title || !price || !description || !category) {
      showToast("Please fill all fields", "error");
      return;
    }

    setSaving(true);
    try {
      const serviceData = {
        title,
        price: price.startsWith('$') ? price : `$${price}`,
        description,
        category,
        image: image || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
        rating: editingService?.rating || "5.0",
        reviews: editingService?.reviews || "0",
        providerId: user?.uid || ""
      };

      if (editingService) {
        // Edit existing
        await serviceService.updateService(editingService.id, serviceData);
        showToast("Service updated successfully", "success");
      } else {
        // Add new
        await serviceService.addService(serviceData);
        showToast("Service added successfully", "success");
      }
      
      addDisclosure.close();
      resetForm();
    } catch (error) {
      showToast("Failed to save service", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setTitle(service.title);
    setPrice(service.price.toString().replace('$', ''));
    setDescription(service.description);
    setCategory(service.category);
    setImage(service.image);
    addDisclosure.open();
  };

  const handleImageSelect = async (useCamera: boolean) => {
    try {
      const uri = await storageService.pickImage(useCamera);
      if (uri) {
        setUploadingImage(true);
        const fileName = `services/${user?.uid}/${Date.now()}`;
        const uploadUrl = await storageService.uploadImage(uri, fileName);
        setImage(uploadUrl);
        showToast("Image uploaded", "success");
      }
    } catch (error) {
      showToast("Upload failed", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert("Delete Service", "Are you sure you want to delete this service?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await serviceService.deleteService(id);
          showToast("Service deleted", "success");
        } catch (error) {
          showToast("Failed to delete", "error");
        }
      }}
    ]);
  };

  const resetForm = () => {
    setEditingService(null);
    setTitle("");
    setPrice("");
    setDescription("");
    setCategory("");
    setImage("");
  };

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
        <View className="px-6 pt-6 mb-8 flex-row items-center justify-between">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity onPress={() => router.back()} className="w-12 h-12 bg-white rounded-2xl items-center justify-center border border-slate-100 shadow-sm">
              <ArrowLeft size={22} color="#0F172A" />
            </TouchableOpacity>
            <View>
              <Text weight="bold" className="text-2xl text-slate-900">My Services</Text>
              <Text className="text-slate-500 text-sm">Manage your offerings</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={addDisclosure.open}
            className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          {myServices.length === 0 ? (
            <View className="py-20 items-center bg-white rounded-[40px] border border-slate-50 shadow-sm">
               <Package size={64} color="#CBD5E1" strokeWidth={1} />
               <Text weight="bold" className="text-slate-900 text-xl mt-6">No services yet</Text>
               <Text className="text-slate-400 mt-2 text-center px-10 leading-6">You haven't listed any services yet. Tap the plus button to get started.</Text>
            </View>
          ) : (
            myServices.map((service) => (
              <Card key={service.id} className="mb-6 bg-white border-slate-50 shadow-sm overflow-hidden" style={{ borderRadius: 32 }}>
                <View className="flex-row p-5 gap-5">
                  <Image source={{ uri: service.image }} className="w-24 h-24 rounded-2xl" />
                  <View className="flex-1 justify-center">
                     <View className="bg-primary/5 px-2.5 py-1 rounded-full self-start mb-2">
                        <Text weight="bold" className="text-primary text-[10px] uppercase">{service.category}</Text>
                     </View>
                     <Text weight="bold" className="text-lg text-slate-900 mb-1" numberOfLines={1}>{service.title}</Text>
                     <Text weight="bold" className="text-primary text-xl">${service.price}</Text>
                  </View>
                </View>
                <View className="bg-slate-50 px-5 py-3 flex-row justify-end gap-3 border-t border-slate-100">
                   <TouchableOpacity onPress={() => handleDelete(service.id)} className="w-10 h-10 bg-rose-50 rounded-xl items-center justify-center">
                      <Trash2 size={18} color="#F43F5E" />
                   </TouchableOpacity>
                   <TouchableOpacity 
                      onPress={() => router.push(`/service/${service.id}`)}
                      className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-100 shadow-sm"
                   >
                      <ArrowLeft size={18} color="#64748B" style={{ transform: [{ rotate: '135deg' }] }} />
                   </TouchableOpacity>
                   <TouchableOpacity 
                      onPress={() => handleEdit(service)}
                      className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-slate-100 shadow-sm"
                   >
                      <Edit2 size={18} color="#64748B" />
                   </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </ScrollView>

        <AppModal 
          visible={addDisclosure.isOpen} 
          onClose={() => {
            addDisclosure.close();
            resetForm();
          }} 
          title={editingService ? "Edit Service" : "Add New Service"}
        >
          <ScrollView className="mt-4" showsVerticalScrollIndicator={false}>
            <View className="mb-8 items-center">
               <TouchableOpacity 
                 onPress={imageSourceDisclosure.open}
                 className="w-full h-48 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden"
               >
                  {uploadingImage ? (
                    <ActivityIndicator color="#4C6FFF" />
                  ) : image ? (
                    <Image source={{ uri: image }} className="w-full h-full" />
                  ) : (
                    <View className="items-center">
                       <Camera size={32} color="#94A3B8" />
                       <Text className="text-slate-400 mt-2 font-medium">Add Service Photo</Text>
                    </View>
                  )}
               </TouchableOpacity>
            </View>

            <Input label="Service Title" value={title} onChangeText={setTitle} placeholder="e.g. Deep Home Cleaning" />
            <Input label="Price ($)" value={price} onChangeText={setPrice} placeholder="e.g. 50" keyboardType="numeric" />
            <Input label="Description" value={description} onChangeText={setDescription} placeholder="Describe what you offer..." multiline numberOfLines={4} className="h-32 pt-4" />
            
            <Text weight="bold" className="text-slate-700 mb-3 ml-1">Select Category</Text>
            <View className="flex-row flex-wrap gap-3 mb-8">
               {categories.map((cat) => (
                 <TouchableOpacity 
                  key={cat.id} 
                  onPress={() => setCategory(cat.name)}
                  className={`px-6 py-3 rounded-2xl border ${category === cat.name ? 'bg-primary border-primary shadow-md' : 'bg-white border-slate-100'}`}
                 >
                   <Text weight="bold" className={category === cat.name ? 'text-white' : 'text-slate-500'}>{cat.name}</Text>
                 </TouchableOpacity>
               ))}
            </View>

            <Button 
              title={saving ? "Saving..." : (editingService ? "Update Service" : "Create Service")} 
              className="rounded-full h-16 shadow-xl shadow-primary/30 mb-10" 
              onPress={handleSaveService}
              loading={saving}
            />
          </ScrollView>
        </AppModal>

        <ImageSourceModal 
          visible={imageSourceDisclosure.isOpen}
          onClose={imageSourceDisclosure.close}
          onSelect={handleImageSelect}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}
