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
import { ArrowLeft, Plus, Edit2, Trash2, Star, Tag, Package, Camera, Info } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { ImageSourceModal } from "../../components/ui/ImageSourceModal";

export default function ProviderServicesScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  const editDisclosure = useDisclosure();
  const imageSourceDisclosure = useDisclosure();
  
  const [myServices, setMyServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    if (userProfile && !userProfile.isHired) {
      showToast("Verification required", "error");
      router.back();
      return;
    }

    if (!user?.uid) return;

    const unsubServices = providerService.subscribeToProviderServices(user.uid, (data) => {
      setMyServices(data);
      setLoading(false);
    });

    return () => unsubServices();
  }, [user?.uid, userProfile]);

  const handleUpdateService = async () => {
    if (!price || !description) {
      showToast("Please fill all fields", "error");
      return;
    }

    if (!editingService) return;

    setSaving(true);
    try {
      await serviceService.updateService(editingService.id, {
        price: parseFloat(price),
        description,
        image
      });
      showToast("Service updated", "success");
      editDisclosure.close();
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
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
    Alert.alert("Delete Service", "Are you sure you want to remove this service from your profile?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await serviceService.deleteService(id);
          showToast("Service removed", "success");
        } catch (error) {
          showToast("Failed to remove", "error");
        }
      }}
    ]);
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
              <Text className="text-slate-400 text-xs font-medium">Manage your active offerings</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => router.push('/provider/marketplace')}
            className="w-12 h-12 bg-primary rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
          >
            <Plus size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}>
          {myServices.length === 0 ? (
            <View className="items-center justify-center py-20 bg-white rounded-[40px] border border-slate-50 border-dashed">
              <View className="w-20 h-20 bg-slate-50 rounded-full items-center justify-center mb-6">
                <Package size={32} color="#94A3B8" />
              </View>
              <Text weight="bold" className="text-lg text-slate-900 mb-2">No Active Services</Text>
              <Text className="text-slate-400 text-sm text-center px-12 mb-8 leading-5">
                Apply for services in the marketplace to start seeing them here.
              </Text>
              <Button 
                title="Go to Marketplace" 
                onPress={() => router.push('/provider/marketplace')}
                className="px-8 rounded-2xl"
              />
            </View>
          ) : (
            myServices.map((service) => (
              <Card key={service.id} className="mb-6 p-5 rounded-[32px] overflow-hidden border-slate-50">
                <View className="flex-row items-center gap-4 mb-4">
                  <Image source={{ uri: service.image }} className="w-20 h-20 rounded-2xl" />
                  <View className="flex-1">
                    <Text weight="bold" className="text-lg text-slate-900">{service.title}</Text>
                    <View className="flex-row items-center gap-2 mt-1">
                      <Tag size={12} color="#4C6FFF" />
                      <Text className="text-primary text-xs font-bold uppercase tracking-widest">{service.category}</Text>
                    </View>
                    <Text weight="bold" className="text-emerald-500 text-lg mt-2">${service.price}</Text>
                  </View>
                </View>

                <View className="flex-row gap-3 border-t border-slate-50 pt-4 mt-2">
                  <TouchableOpacity 
                    onPress={() => {
                      setEditingService(service);
                      setPrice(service.price.toString());
                      setDescription(service.description);
                      setImage(service.image);
                      editDisclosure.open();
                    }}
                    className="flex-1 h-12 bg-slate-50 rounded-xl flex-row items-center justify-center gap-2"
                  >
                    <Edit2 size={16} color="#4C6FFF" />
                    <Text weight="bold" className="text-primary text-sm">Edit Details</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleDelete(service.id)}
                    className="w-12 h-12 bg-rose-50 rounded-xl items-center justify-center"
                  >
                    <Trash2 size={18} color="#E11D48" />
                  </TouchableOpacity>
                </View>
              </Card>
            ))
          )}
        </ScrollView>
      </LinearGradient>

      <AppModal
        visible={editDisclosure.isOpen}
        onClose={editDisclosure.close}
        title="Edit Service"
      >
        <ScrollView className="px-6 pb-10" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-8">
            <TouchableOpacity onPress={imageSourceDisclosure.open} className="w-full h-48 bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 items-center justify-center">
              {image ? (
                <Image source={{ uri: image }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <Camera size={32} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs mt-2 font-medium">Update Photo</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Input 
            label="Pricing" 
            placeholder="e.g. 50" 
            value={price} 
            onChangeText={setPrice} 
            keyboardType="numeric"
            leftIcon={<Text weight="bold" className="text-slate-400">$</Text>}
          />
          <Input 
            label="Service Description" 
            placeholder="Describe your expertise..." 
            value={description} 
            onChangeText={setDescription} 
            multiline
            numberOfLines={4}
            className="h-32"
          />

          <Button 
            title="Update Offering" 
            onPress={handleUpdateService} 
            loading={saving}
            className="h-16 rounded-2xl shadow-lg shadow-primary/20"
          />
        </ScrollView>
      </AppModal>

      <ImageSourceModal 
        visible={imageSourceDisclosure.isOpen}
        onClose={imageSourceDisclosure.close}
        onSelect={handleImageSelect}
      />
    </SafeAreaView>
  );
}
