import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { AppModal } from "../../components/ui/AppModal";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { serviceService, Category } from "../../services/serviceService";
import { storageService } from "../../services/storageService";
import { DeleteModal } from "../../components/ui/DeleteModal";
import { ImageSourceModal } from "../../components/ui/ImageSourceModal";
import { ArrowLeft, Plus, Trash2, Edit2, Image as ImageIcon, Camera } from "lucide-react-native";

export default function CategoryManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  const addDisclosure = useDisclosure();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const handlePickImage = async (useCamera: boolean) => {
    try {
      const uri = await storageService.pickImage(useCamera);
      if (uri) setImageUri(uri);
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await serviceService.getCategories();
      setCategories(data);
    } catch (error) {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!name || !imageUri) {
      showToast("Please fill all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
      // Upload image to Firebase Storage first
      const downloadUrl = await storageService.uploadImage(imageUri, 'categories');
      
      await serviceService.addCategory({ name, image: downloadUrl });
      showToast("Category added successfully", "success");
      setName("");
      setImageUri(null);
      addDisclosure.close();
      fetchCategories();
    } catch (error) {
      showToast("Failed to add category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await serviceService.deleteCategory(deleteId);
      showToast("Category deleted", "success");
      setDeleteId(null);
      fetchCategories();
    } catch (error) {
      showToast("Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <DeleteModal 
        visible={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Category"
        description="Are you sure you want to remove this category? This will also remove any services associated with it."
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
          <Text weight="bold" className="text-xl text-slate-900">Categories</Text>
          <TouchableOpacity onPress={addDisclosure.open} className="h-12 w-12 items-center justify-center bg-primary rounded-2xl">
            <Plus size={22} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="pb-20">
          <View className="gap-5 pb-10">
            {categories.map((cat) => (
              <View key={cat.id} className="bg-slate-50 p-5 rounded-[32px] flex-row items-center gap-5 border border-slate-100">
                <Image source={{ uri: cat.image }} className="w-16 h-16 rounded-2xl" />
                <View className="flex-1">
                  <Text weight="bold" className="text-lg text-slate-900">{cat.name}</Text>
                  <Text className="text-slate-400 text-xs mt-0.5">ID: {cat.id?.slice(-6)}</Text>
                </View>
                <TouchableOpacity 
                  className="w-10 h-10 bg-rose-50 rounded-xl items-center justify-center"
                  onPress={() => setDeleteId(cat.id)}
                >
                  <Trash2 size={18} color="#F43F5E" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        <AppModal visible={addDisclosure.isOpen} onClose={addDisclosure.close} title="New Category">
          <View className="mt-4">
            <Input 
              label="Category Name" 
              placeholder="e.g. Plumbing" 
              value={name} 
              onChangeText={setName} 
            />
            
            <View className="mt-4">
              <Text weight="semibold" className="text-slate-700 text-sm mb-3">Category Image</Text>
              <TouchableOpacity 
                onPress={() => setShowPicker(true)}
                className="w-full h-40 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden"
              >
                {imageUri ? (
                  <Image source={{ uri: imageUri }} className="w-full h-full" />
                ) : (
                  <View className="items-center">
                    <ImageIcon size={32} color="#94A3B8" />
                    <Text className="text-slate-400 mt-2">Select from Gallery</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Button 
              title={submitting ? "Adding..." : "Create Category"} 
              onPress={handleAddCategory} 
              loading={submitting}
              className="mt-6 rounded-full h-16"
            />
          </View>
        </AppModal>
      </View>
    </SafeAreaView>
  );
}
