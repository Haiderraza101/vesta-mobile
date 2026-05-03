import React, { useState, useRef, useCallback } from "react";
import { View, StatusBar, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect, Href } from "expo-router";
import { 
  Layers, 
  Briefcase, 
  ShieldCheck, 
  Settings
} from "lucide-react-native";
import { userService } from "@/services/userService";
import { storageService } from "@/services/storageService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useAdminStats } from "@/hooks/useAdminStats";

import { HomeTab } from "@/components/admin/HomeTab";
import { AnalyticsTab } from "@/components/admin/AnalyticsTab";
import { ManagementTab } from "@/components/admin/ManagementTab";
import { ProfileTab } from "@/components/admin/ProfileTab";
import { AdminBottomTabs } from "@/components/admin/AdminBottomTabs";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AppModal } from "@/components/ui/AppModal";
import { ImageSourceModal } from "@/components/ui/ImageSourceModal";

type TabType = 'home' | 'analytics' | 'management' | 'profile';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, userProfile, signOut } = useAuth();
  const { showToast } = useToast();
  const { stats, loading, refreshStats } = useAdminStats();
  
  const logoutDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const imageSourceDisclosure = useDisclosure();
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [name, setName] = useState(userProfile?.fullName || "");
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshStats();
    setRefreshing(false);
    showToast("Data updated", "success");
  };

  useFocusEffect(
    useCallback(() => {
      refreshStats();
    }, [])
  );

  const handleUpdateProfile = async () => {
    if (!userProfile?.uid) return;
    setUpdating(true);
    try {
      await userService.updateUserProfile(userProfile.uid, { fullName: name });
      showToast("Profile updated", "success");
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
        const uploadUrl = await storageService.uploadImage(uri, `avatars/${user?.uid}`);
        await userService.updateUserProfile(user?.uid || '', { avatar: uploadUrl });
        showToast("Identity updated", "success");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Update failed";
      showToast(message, "error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      logoutDisclosure.close();
      router.replace("/(auth)/login");
      showToast("Signed out", "success");
    } catch (error) {
      showToast("Sign out failed", "error");
    }
  };

  const ADMIN_MENU = [
    { id: 'cats', title: "Categories", subtitle: "Manage groupings", icon: Layers, route: "/admin/categories" },
    { id: 'services', title: "Services", subtitle: "Manage listings", icon: Briefcase, route: "/admin/services" },
    { id: 'users', title: "Users", subtitle: "Manage accounts", icon: ShieldCheck, route: "/admin/users" },
    { id: 'settings', title: "Settings", subtitle: "App configuration", icon: Settings, route: "/admin/settings" }
  ];

  if (loading) return <ActivityIndicator size="large" color="#4C6FFF" className="flex-1" />;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {activeTab === 'home' && (
        <HomeTab 
          stats={stats}
          userProfile={userProfile}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onProfilePress={() => setActiveTab('profile')}
          onSeeAllActivity={() => setActiveTab('management')}
          scrollRef={scrollRef}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsTab 
          stats={stats}
          onManageServices={() => setActiveTab('management')}
        />
      )}

      {activeTab === 'management' && (
        <ManagementTab 
          menuItems={ADMIN_MENU}
          onItemPress={(route) => router.push(route as Href<string>)}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileTab 
          userProfile={userProfile}
          stats={stats}
          uploadingImage={uploadingImage}
          onImageSelect={imageSourceDisclosure.open}
          onEditDetails={editDisclosure.open}
          onLogout={logoutDisclosure.open}
        />
      )}

      <AdminBottomTabs activeTab={activeTab} onTabPress={setActiveTab} />

      <AppModal visible={editDisclosure.isOpen} onClose={editDisclosure.close} title="Edit Profile">
        <View className="mt-4">
          <Input label="Full Name" value={name} onChangeText={setName} />
          <Button title="Save Changes" className="mt-6 rounded-full" onPress={handleUpdateProfile} loading={updating} />
        </View>
      </AppModal>

      <ImageSourceModal 
        visible={imageSourceDisclosure.isOpen}
        onClose={imageSourceDisclosure.close}
        onSelect={handleImageSelect}
      />

      <AppModal visible={logoutDisclosure.isOpen} onClose={logoutDisclosure.close} title="Sign Out">
        <View className="mt-4 items-center">
          <Text className="text-slate-500 text-center mb-8">Are you sure you want to sign out?</Text>
          <View className="flex-row gap-4 w-full">
            <Button title="Cancel" variant="outline" className="flex-1 rounded-2xl" onPress={logoutDisclosure.close} />
            <Button title="Sign Out" variant="destructive" className="flex-1 rounded-2xl" onPress={handleLogout} />
          </View>
        </View>
      </AppModal>
    </SafeAreaView>
  );
}
