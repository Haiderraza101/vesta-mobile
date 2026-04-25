import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, Image } from "react-native";
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
import { LinearGradient } from 'expo-linear-gradient';
import { User, CreditCard, Bell, Shield, LogOut, ChevronRight, HelpCircle, Camera } from "lucide-react-native";

export default function AccountScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const editDisclosure = useDisclosure();
  const logoutDisclosure = useDisclosure();
  const settingDisclosure = useDisclosure();
  
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  const [name, setName] = useState("Haider Raza");
  const [email, setEmail] = useState("haider@example.com");

  const MENU_ITEMS = [
    { id: 1, name: "Profile Settings", icon: User },
    { id: 2, name: "Payment Methods", icon: CreditCard },
    { id: 3, name: "Notifications", icon: Bell },
    { id: 4, name: "Privacy & Security", icon: Shield },
    { id: 5, name: "Help Center", icon: HelpCircle },
  ];

  const handleSettingPress = (name: string) => {
    setSelectedSetting(name);
    settingDisclosure.open();
  };

  const handleLogout = () => {
    logoutDisclosure.close();
    showToast("Logged out successfully", "success");
    router.replace("/onboarding");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top', 'bottom']}>
      <LinearGradient colors={['#F0F7FF', '#FFFFFF']} className="flex-1">
        <ScreenHeader title="My Profile" showProfile={false} />

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <Card className="p-6 mb-10 flex-row items-center gap-6">
            <View className="relative">
              <View className="w-24 h-24 rounded-[28px] overflow-hidden border-4 border-slate-50 shadow-sm">
                <Image 
                  source={{ uri: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop" }} 
                  className="w-full h-full"
                />
              </View>
              <TouchableOpacity className="absolute bottom-[-5] right-[-5] w-9 h-9 bg-primary rounded-full items-center justify-center border-4 border-white shadow-sm">
                <Camera size={14} color="white" />
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Text variant="h2" weight="bold" className="mb-1 text-slate-900">{name}</Text>
              <Text className="text-slate-500 text-base mb-4">{email}</Text>
              <TouchableOpacity 
                onPress={editDisclosure.open}
                className="bg-primary/10 self-start px-4 py-2 rounded-xl"
              >
                <Text weight="bold" className="text-primary text-xs">Edit Profile</Text>
              </TouchableOpacity>
            </View>
          </Card>

          <View className="mb-10">
            <Text weight="bold" className="text-[19px] text-slate-900 mb-6">Settings</Text>
            <Card>
              {MENU_ITEMS.map((item, index) => (
                <TouchableOpacity 
                  key={item.id}
                  className={`flex-row items-center justify-between p-5 ${index !== MENU_ITEMS.length - 1 ? 'border-b border-slate-50' : ''}`}
                  activeOpacity={0.7}
                  onPress={() => handleSettingPress(item.name)}
                >
                  <View className="flex-row items-center gap-5">
                    <View className="w-11 h-11 bg-slate-50 rounded-2xl items-center justify-center">
                      <item.icon size={22} color="#4C6FFF" strokeWidth={1.5} />
                    </View>
                    <Text weight="semibold" className="text-[17px] text-slate-700">{item.name}</Text>
                  </View>
                  <ChevronRight size={20} color="#CBD5E1" />
                </TouchableOpacity>
              ))}
            </Card>
          </View>

          <TouchableOpacity 
            onPress={logoutDisclosure.open}
            className="flex-row items-center justify-center p-6 bg-white border border-destructive/10 rounded-[28px] mb-32 shadow-sm"
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#EF4444" />
            <Text weight="bold" className="text-destructive uppercase tracking-widest ml-3">Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>

        <AppModal visible={editDisclosure.isOpen} onClose={editDisclosure.close} title="Edit Profile">
          <View className="mt-4">
            <Input label="Full Name" value={name} onChangeText={setName} placeholder="Enter your name" />
            <Input label="Email Address" value={email} onChangeText={setEmail} placeholder="Enter your email" />
            <Button title="Save Changes" className="mt-6 rounded-full" onPress={() => {
              editDisclosure.close();
              showToast("Profile updated", "success");
            }} />
          </View>
        </AppModal>

        <AppModal visible={logoutDisclosure.isOpen} onClose={logoutDisclosure.close} title="Sign Out">
          <View className="mt-4 items-center">
            <View className="w-20 h-20 bg-destructive/5 rounded-full items-center justify-center mb-6">
              <LogOut size={32} color="#EF4444" />
            </View>
            <Text weight="bold" className="text-xl text-slate-900 mb-2">Are you sure?</Text>
            <Text className="text-slate-500 text-center mb-10 px-6">You will be signed out of your account.</Text>
            <View className="flex-row gap-4 w-full">
              <Button title="Cancel" variant="outline" className="flex-1" onPress={logoutDisclosure.close} />
              <Button title="Sign Out" variant="destructive" className="flex-1" onPress={handleLogout} />
            </View>
          </View>
        </AppModal>

        <AppModal visible={settingDisclosure.isOpen} onClose={settingDisclosure.close} title={selectedSetting || ""}>
          <ComingSoon title={selectedSetting || ""} onBack={settingDisclosure.close} />
        </AppModal>
      </LinearGradient>
    </SafeAreaView>
  );
}
