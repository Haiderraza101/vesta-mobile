import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Image, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useToast } from "@/context/ToastContext";
import { serviceService, Category } from "@/services/serviceService";
import { storageService } from "@/services/storageService";
import { DeleteModal } from "@/components/ui/DeleteModal";
import { ImageSourceModal } from "@/components/ui/ImageSourceModal";
import { ArrowLeft, Plus, Image as ImageIcon } from "lucide-react-native";
import { CategoryListItem } from "@/components/admin/CategoryListItem";

export default function CategoryManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  const addDisclosure = useDisclosure();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  
  const [name, setName] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const data = await serviceService.getCategories();
      setCategories(data);
    } catch (error) {
      showToast("Failed to fetch categories", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
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

  const handleAddCategory = async () => {
    if (!name || !imageUri) {
      showToast("Please fill all fields", "error");
      return;
    }

    setSubmitting(true);
    try {
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

  if (loading) return <LoadingState message="Organizing categories..." />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <DeleteModal 
        visible={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Category"
        description="Are you sure you want to remove this category? Associated services may be affected."
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

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchCategories(); }} colors={['#4C6FFF']} />
          }
        >
          {categories.length === 0 ? (
            <EmptyState 
              title="No categories" 
              description="Start by adding your first service category." 
              icon={Plus}
              actionTitle="Add Category"
              onAction={addDisclosure.open}
            />
          ) : (
            <View className="gap-4 pb-10">
              {categories.map((cat) => (
                <CategoryListItem 
                  key={cat.id} 
                  category={cat} 
                  onDelete={setDeleteId} 
                />
              ))}
            </View>
          )}
        </ScrollView>

        <ModalLayout visible={addDisclosure.isOpen} onClose={addDisclosure.close} title="New Category">
          <View className="mt-2">
            <Input 
              label="Category Name" 
              placeholder="e.g. Plumbing Services" 
              value={name} 
              onChangeText={setName} 
            />
            
            <View className="mt-4">
              <Text weight="semibold" className="text-slate-700 text-sm mb-3">Cover Image</Text>
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
                    <Text weight="medium" className="text-slate-400">Choose from Media</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            <Button 
              title={submitting ? "Processing..." : "Create Category"} 
              onPress={handleAddCategory} 
              loading={submitting}
              className="mt-10 rounded-full h-16"
            />
          </View>
        </ModalLayout>
      </View>
    </SafeAreaView>
  );
}
