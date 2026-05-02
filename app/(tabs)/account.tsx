import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { ScreenHeader } from "../../components/ui/ScreenHeader";
import { Card } from "../../components/ui/Card";
import { AppModal } from "../../components/ui/AppModal";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { ComingSoon } from "../../components/ui/ComingSoon";
import { useDisclosure } from "../../hooks/useDisclosure";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/userService";
import { storageService } from "../../services/storageService";
import { LinearGradient } from 'expo-linear-gradient';
import { User, CreditCard, Bell, Shield, LogOut, ChevronRight, HelpCircle, Camera, Mail, Phone } from "lucide-react-native";
import { ImageSourceModal } from "../../components/ui/ImageSourceModal";

export default function AccountScreen() {
  const router = useRouter();
  const { userProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const editDisclosure = useDisclosure();
  const logoutDisclosure = useDisclosure();
  
  const [name, setName] = useState(userProfile?.fullName || "");
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageSourceDisclosure = useDisclosure();
  
  const MENU_ITEMS = [
    { id: 1, name: "Profile Settings", icon: User, action: editDisclosure.open },
    ...(userProfile?.role === 'admin' ? [{ id: 5, name: "Admin Dashboard", icon: Shield, action: () => router.push('/admin') }] : []),
    { id: 2, name: "Sign Out", icon: LogOut, action: logoutDisclosure.open },
  ];

  const handleUpdateProfile = async () => {
    if (!userProfile?.uid) return;
    setUpdating(true);
    try {
      await userService.updateUserProfile(userProfile.uid, { fullName: name });
      showToast("Profile updated successfully", "success");
      editDisclosure.close();
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleImageSelect = async (useCamera: boolean) => {
    try {
      const uri = await storageService.pickImage(useCamera);
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

  const handleLogout = async () => {
    try {
      await signOut();
      logoutDisclosure.close();
      showToast("Logged out successfully", "success");
      router.replace("/(auth)/login");
    } catch (error) {
      showToast("Logout failed", "error");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top']}>
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="My Account" showProfile={false} />

      <ScrollView 
        className="flex-1 px-6 pt-6" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 160 }}
      >
        <View className="bg-slate-900 p-10 rounded-[48px] shadow-2xl shadow-slate-900/30 mb-12 border border-white/5">
          <View className="items-center">
            <View className="relative mb-6">
              <View className="w-32 h-32 rounded-[40px] bg-white/10 items-center justify-center overflow-hidden border-2 border-white/20">
                {uploadingImage ? (
                  <ActivityIndicator color="white" />
                ) : userProfile?.avatar ? (
                  <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
                ) : (
                  <Text weight="bold" className="text-4xl text-white">{userProfile?.fullName?.charAt(0) || 'U'}</Text>
                )}
              </View>
              <TouchableOpacity 
                onPress={imageSourceDisclosure.open}
                className="absolute -bottom-2 -right-2 w-11 h-11 bg-primary rounded-2xl items-center justify-center border-4 border-slate-900 shadow-lg"
              >
                <Camera size={18} color="white" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
            
            <Text weight="bold" className="text-white text-3xl text-center mb-2">{userProfile?.fullName || 'User'}</Text>
            <View className="flex-row items-center gap-2 px-5 py-2 bg-white/10 rounded-full border border-white/5">
               <View className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
               <Text weight="bold" className="text-white text-[10px] uppercase tracking-widest">{userProfile?.role || 'Customer'}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={editDisclosure.open}
              className="mt-8 bg-primary/20 px-8 py-3 rounded-2xl border border-primary/20"
            >
              <Text weight="bold" className="text-primary text-[12px] tracking-widest uppercase">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

          <View className="mb-10">
            <Text weight="bold" className="text-[20px] tracking-tight text-slate-900 mb-6">General Settings</Text>
            <Card className="bg-white border-slate-50 overflow-hidden">
              {MENU_ITEMS.map((item, index) => (
                <TouchableOpacity 
                  key={item.id}
                  className={`flex-row items-center justify-between p-6 ${index !== MENU_ITEMS.length - 1 ? 'border-b border-slate-50' : ''}`}
                  activeOpacity={0.7}
                  onPress={item.action}
                >
                  <View className="flex-row items-center gap-5">
                    <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center border border-slate-100">
                      <item.icon size={22} color="#4C6FFF" strokeWidth={2} />
                    </View>
                    <Text weight="bold" className="text-[17px] text-slate-700">{item.name}</Text>
                  </View>
                  <ChevronRight size={18} color="#CBD5E1" strokeWidth={3} />
                </TouchableOpacity>
              ))}
            </Card>
          </View>

          <TouchableOpacity 
            onPress={logoutDisclosure.open}
            className="flex-row items-center justify-center p-6 bg-rose-50 border border-rose-100 rounded-[32px] mb-32 shadow-sm"
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#F43F5E" strokeWidth={2.5} />
            <Text weight="bold" className="text-rose-500 uppercase tracking-[2px] ml-3 text-[13px]">Secure Logout</Text>
          </TouchableOpacity>
        </ScrollView>

        <AppModal visible={editDisclosure.isOpen} onClose={editDisclosure.close} title="Edit Profile">
          <View className="mt-4">
            <Input 
              label="Display Name" 
              value={name} 
              onChangeText={setName} 
              placeholder="e.g. John Smith" 
              leftIcon={<User size={20} color="#94A3B8" />}
            />
            <Input 
              label="Email (View Only)" 
              value={userProfile?.email || ""} 
              editable={false} 
              className="opacity-60"
              leftIcon={<Mail size={20} color="#94A3B8" />}
            />
            <Button 
              title={updating ? "Saving..." : "Apply Changes"} 
              className="mt-8 h-16 rounded-full shadow-lg shadow-primary/20" 
              onPress={handleUpdateProfile} 
              loading={updating}
            />
          </View>
        </AppModal>

        <AppModal visible={logoutDisclosure.isOpen} onClose={logoutDisclosure.close} title="Sign Out">
          <View className="mt-4 items-center">
            <View className="w-24 h-24 bg-rose-50 rounded-[40px] items-center justify-center mb-8 border border-rose-100">
              <LogOut size={40} color="#F43F5E" strokeWidth={2} />
            </View>
            <Text weight="bold" className="text-2xl text-slate-900 mb-2">Sign Out?</Text>
            <Text className="text-slate-500 text-center mb-12 px-10 leading-6 text-base">You will need to re-authenticate to access your bookings.</Text>
            <View className="flex-row gap-4 w-full">
              <Button title="Keep me in" variant="outline" className="flex-1 h-16 rounded-[24px]" onPress={logoutDisclosure.close} />
              <Button title="Yes, Logout" variant="destructive" className="flex-1 h-16 rounded-[24px] shadow-lg shadow-rose-200" onPress={handleLogout} />
            </View>
          </View>
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
