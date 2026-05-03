import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, StatusBar, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/services/userService';
import { storageService } from '@/services/storageService';
import { User, LogOut, ChevronRight, Camera, X, ClipboardList } from 'lucide-react-native';
import { OnboardingSummary } from '@/components/ui/OnboardingSummary';

export function AccountTab() {
  const router = useRouter();
  const { userProfile, signOut } = useAuth();
  const { showToast } = useToast();
  
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [newName, setNewName] = useState(userProfile?.fullName || "");
  const [updating, setUpdating] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      showToast("Logged out successfully", "success");
      router.replace("/(auth)/login");
    } catch (error) {
      showToast("Logout failed", "error");
    }
  };

  const handleUpdateProfile = async () => {
    if (!userProfile?.uid || !newName.trim()) return;
    setUpdating(true);
    try {
      await userService.updateUserProfile(userProfile.uid, { fullName: newName });
      showToast("Profile updated successfully", "success");
      setEditModalVisible(false);
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleImagePick = async () => {
    try {
      const uri = await storageService.pickImage(false);
      if (uri) {
        setUploadingImage(true);
        const uploadUrl = await storageService.uploadImage(uri, `avatars/${userProfile?.uid}`);
        await userService.updateUserProfile(userProfile?.uid || '', { avatar: uploadUrl });
        showToast("Profile image updated", "success");
      }
    } catch (error: any) {
      showToast(error.message || "Update failed", "error");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <ScreenHeader title="Account" showProfile={false} />
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View className="bg-white px-6 py-8 items-center border-b border-slate-100">
          <View className="relative">
            <View className="w-24 h-24 rounded-[32px] bg-primary/10 items-center justify-center overflow-hidden border-4 border-white shadow-xl shadow-slate-200">
              {uploadingImage ? (
                <ActivityIndicator color="#4C6FFF" />
              ) : userProfile?.avatar ? (
                <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
              ) : (
                <Text weight="bold" className="text-3xl text-primary">{userProfile?.fullName?.charAt(0) || 'U'}</Text>
              )}
            </View>
            <TouchableOpacity 
              onPress={handleImagePick}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white shadow-sm"
            >
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text weight="bold" className="text-xl text-slate-900 mt-4">{userProfile?.fullName || 'User'}</Text>
          <Text className="text-slate-500 text-sm mt-1">{userProfile?.email || 'email@example.com'}</Text>
        </View>

        {userProfile?.onboardingData && (
          <View className="mt-8 px-6">
            <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-[2px] mb-3 ml-1">
              Profile Insights
            </Text>
            <OnboardingSummary data={userProfile.onboardingData} />
          </View>
        )}

        <View className="mt-8 px-6">
          <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-[2px] mb-3 ml-1">
            Account Management
          </Text>
          
          <View className="bg-white rounded-2xl border border-slate-50 shadow-sm overflow-hidden mb-6">
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setEditModalVisible(true)}
              className="flex-row items-center justify-between p-4 border-b border-slate-50"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-blue-50 items-center justify-center">
                  <User size={20} className="text-blue-500" />
                </View>
                <Text weight="bold" className="text-[15px] text-slate-700">Profile Settings</Text>
              </View>
              <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handleLogout}
              activeOpacity={0.7}
              className="flex-row items-center justify-between p-4"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-rose-50 items-center justify-center">
                  <LogOut size={20} className="text-rose-500" />
                </View>
                <Text weight="bold" className="text-[15px] text-rose-600">Sign Out</Text>
              </View>
              <ChevronRight size={18} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-[40px] p-8 pb-12">
            <View className="flex-row justify-between items-center mb-8">
              <Text weight="bold" className="text-2xl text-slate-900">Edit Profile</Text>
              <TouchableOpacity 
                onPress={() => setEditModalVisible(false)}
                className="w-10 h-10 bg-slate-100 rounded-full items-center justify-center"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="gap-y-6">
              <View>
                <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-widest mb-2 ml-1">Full Name</Text>
                <Input 
                  placeholder="Enter your name"
                  value={newName}
                  onChangeText={setNewName}
                  leftIcon={<User size={18} color="#94A3B8" />}
                  className="bg-slate-50 border-0 h-14 rounded-xl"
                />
              </View>

              <Button 
                title={updating ? "Updating..." : "Save Changes"}
                onPress={handleUpdateProfile}
                loading={updating}
                className="h-14 rounded-xl bg-primary mt-4"
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
