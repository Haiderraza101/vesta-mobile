import React, { useState, useRef, useCallback } from "react";
import { View, StatusBar, ActivityIndicator, ScrollView, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect, Href } from "expo-router";
import { 
  Layers, 
  Settings,
  Package,
  UserPlus,
  LayoutGrid,
  Sparkles,
  UserCheck,
  Camera as CameraIcon,
  MessageSquare
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
  const { stats, loading } = useAdminStats();
  
  const logoutDisclosure = useDisclosure();
  const editDisclosure = useDisclosure();
  const imageSourceDisclosure = useDisclosure();
  const scrollRef = useRef<ScrollView>(null);

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [name, setName] = useState(userProfile?.fullName || "");
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  const MENU_ITEMS = [
    { id: 'hiring', title: 'Hiring Applications', subtitle: 'Approve new providers joining the platform', icon: UserCheck, route: '/admin/provider-requests' as Href },
    { id: 'service-requests', title: 'Service Requests', subtitle: 'Moderate new service additions', icon: Layers, route: '/admin/service-requests' as Href },
    { id: 'jobs', title: 'Job Management', subtitle: 'Oversee active bookings and jobs', icon: Package, route: '/admin/jobs' as Href },
    { id: 'users', title: 'User Base', subtitle: 'Manage all platform users and roles', icon: UserPlus, route: '/admin/users' as Href },
    { id: 'services', title: 'Marketplace', subtitle: 'Manage available services and pricing', icon: Layers, route: '/admin/services' as Href },
    { id: 'categories', title: 'Categories', subtitle: 'Organize services by industry', icon: LayoutGrid, route: '/admin/categories' as Href },
    { id: 'onboarding', title: 'Onboarding', subtitle: 'Configure platform welcome flow', icon: Sparkles, route: '/admin/onboarding' as Href },
    { id: 'settings', title: 'Settings', subtitle: 'System preferences and security', icon: Settings, route: '/admin/settings' as Href },
  ];

  if (loading) return <ActivityIndicator size="large" color="#4C6FFF" className="flex-1" />;

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} className="flex-1">
        {activeTab === 'home' && (
          <HomeTab 
            userProfile={userProfile}
            stats={stats}
            onProfilePress={editDisclosure.open}
            onSeeAllActivity={() => setActiveTab('analytics')}
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
            menuItems={MENU_ITEMS}
            onItemPress={(route) => router.push(route)}
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

        <AdminBottomTabs 
          activeTab={activeTab} 
          onTabPress={setActiveTab} 
        />

        <AppModal 
          visible={logoutDisclosure.isOpen} 
          onClose={logoutDisclosure.close}
          title="Sign Out"
        >
          <View className="p-6">
            <Text className="text-slate-500 text-center mb-8">Are you sure you want to sign out from the admin panel?</Text>
            <View className="flex-row gap-4">
              <Button 
                title="Cancel" 
                variant="outline" 
                className="flex-1" 
                onPress={logoutDisclosure.close} 
              />
              <Button 
                title="Sign Out" 
                className="flex-1 bg-rose-500" 
                onPress={handleLogout} 
              />
            </View>
          </View>
        </AppModal>

        <AppModal 
          visible={editDisclosure.isOpen} 
          onClose={editDisclosure.close}
          title="Edit Profile"
        >
          <View className="p-6">
            <View className="items-center mb-8">
              <TouchableOpacity onPress={imageSourceDisclosure.open}>
                <View className="w-24 h-24 rounded-[32px] bg-slate-50 items-center justify-center overflow-hidden border border-slate-100">
                  {uploadingImage ? (
                    <ActivityIndicator color="#4C6FFF" />
                  ) : userProfile?.avatar ? (
                    <Image source={{ uri: userProfile.avatar }} className="w-full h-full" />
                  ) : (
                    <Text weight="bold" className="text-3xl text-primary">{userProfile?.fullName?.charAt(0) || 'A'}</Text>
                  )}
                </View>
                <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white">
                   <CameraIcon size={14} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <View className="gap-y-4 mb-8">
              <Input 
                label="Full Name"
                placeholder="Enter your name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Button 
              title="Save Changes" 
              loading={updating}
              onPress={handleUpdateProfile} 
            />
          </View>
        </AppModal>

        <ImageSourceModal 
          visible={imageSourceDisclosure.isOpen}
          onClose={imageSourceDisclosure.close}
          onSelect={handleImageSelect}
        />
      </SafeAreaView>
    </View>
  );
}
