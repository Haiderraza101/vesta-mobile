import React, { useMemo } from 'react';
import { View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, ChevronRight, Bell, User } from 'lucide-react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase.config';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import { Text } from '../../../components/ui/Text';
import { Card } from '../../../components/ui/Card';
import { AppModal } from '../../../components/ui/AppModal';
import { Button } from '../../../components/ui/Button';
import { ComingSoon } from '../../../components/ui/ComingSoon';
import { useDisclosure } from '../../../hooks/useDisclosure';

const MENU_ITEMS = [
  { id: 1, label: 'Edit Profile', icon: User, action: 'edit' },
  { id: 2, label: 'Notifications', icon: Bell, action: 'notifications' },
];

export const ProfileView = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const { user } = useAuth();
  const logoutDisclosure = useDisclosure();
  const settingsDisclosure = useDisclosure();
  const [selectedSetting, setSelectedSetting] = React.useState<string | null>(null);

  const initials = useMemo(() => {
    const sourceName = user?.fullName || user?.email || 'User';
    return sourceName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();
  }, [user?.email, user?.fullName]);

  const roleLabel = useMemo(() => {
    if (!user?.role) return 'ROLE PENDING';
    return user.role.toUpperCase();
  }, [user?.role]);

  const roleBackground = user?.role === 'provider' ? '#E8F5EE' : '#DCE7FF';
  const roleTextColor = user?.role === 'provider' ? '#15803D' : '#1D4ED8';

  const openSetting = (label: string, action: string) => {
    if (action === 'edit') {
      router.push('/(shared)/edit-profile');
      return;
    }

    setSelectedSetting(label);
    settingsDisclosure.open();
  };

  const handleSignOut = async () => {
    try {
      logoutDisclosure.close();
      await signOut(auth);
      showToast('Signed out successfully', 'success');
      router.replace('/(auth)/login');
    } catch (error: any) {
      showToast(error?.message || 'Sign out failed', 'error');
    }
  };

  if (!user) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F4F1EA]" edges={['top', 'bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 120 }}
      >
        <View className="items-center pt-8 pb-8">
          <View
            className="w-24 h-24 rounded-full border-[3px] border-[#D8E2F2] bg-[#F2F5FA] items-center justify-center overflow-hidden mb-4"
            style={{ shadowColor: '#1E293B', shadowOpacity: 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 } }}
          >
            {user.profileImageUrl ? (
              <Image source={{ uri: user.profileImageUrl }} className="w-full h-full" />
            ) : (
              <View className="w-full h-full items-center justify-center">
                <Text weight="bold" className="text-[#536EA5] text-[28px] tracking-[0.14em]">
                  {initials || 'U'}
                </Text>
              </View>
            )}
          </View>

          <Text weight="bold" className="text-[31px] leading-[36px] text-[#1E293B] text-center">
            {user.fullName}
          </Text>
          <Text className="text-[16px] leading-6 text-[#8A8F98] mt-1 text-center">
            {user.email}
          </Text>

          <View className="mt-4 px-4 py-1.5 rounded-full" style={{ backgroundColor: roleBackground }}>
            <Text weight="bold" className="text-[11px] tracking-[0.28em]" style={{ color: roleTextColor }}>
              {roleLabel}
            </Text>
          </View>
        </View>

        <Card className="overflow-hidden border border-[#D9D9D9]/70 bg-white/60 rounded-[24px]" variant="outline">
          <View className="px-5 pt-5 pb-3">
            <Text className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#7D7D7D]">
              Account Settings
            </Text>
          </View>

          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center justify-between px-5 py-4 ${index !== MENU_ITEMS.length - 1 ? 'border-b border-black/5' : ''}`}
              activeOpacity={0.7}
              onPress={() => openSetting(item.label, item.action)}
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View className="w-12 h-12 rounded-2xl bg-[#EFF2F8] items-center justify-center mr-4">
                  <item.icon size={20} color="#334155" strokeWidth={1.8} />
                </View>
                <Text className="text-[17px] text-[#111827]">{item.label}</Text>
              </View>
              <ChevronRight size={18} color="#A3A3A3" />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            className="flex-row items-center justify-between px-5 py-4 border-t border-black/5"
            activeOpacity={0.7}
            onPress={logoutDisclosure.open}
          >
            <View className="flex-row items-center flex-1 pr-3">
              <View className="w-12 h-12 rounded-2xl bg-[#EFF2F8] items-center justify-center mr-4">
                <LogOut size={20} color="#334155" strokeWidth={1.8} />
              </View>
              <Text className="text-[17px] text-[#111827]">Sign Out</Text>
            </View>
            <ChevronRight size={18} color="#A3A3A3" />
          </TouchableOpacity>
        </Card>
      </ScrollView>

      <AppModal visible={logoutDisclosure.isOpen} onClose={logoutDisclosure.close} title="Sign Out">
        <View className="mt-4 items-center">
          <View className="w-20 h-20 bg-destructive/5 rounded-full items-center justify-center mb-6">
            <LogOut size={32} color="#EF4444" />
          </View>
          <Text weight="bold" className="text-xl text-slate-900 mb-2">Are you sure?</Text>
          <Text className="text-slate-500 text-center mb-10 px-6">You will be signed out of your account.</Text>
          <View className="flex-row gap-4 w-full">
            <Button title="Cancel" variant="outline" className="flex-1" onPress={logoutDisclosure.close} />
            <Button title="Sign Out" variant="destructive" className="flex-1" onPress={handleSignOut} />
          </View>
        </View>
      </AppModal>

      <AppModal visible={settingsDisclosure.isOpen} onClose={settingsDisclosure.close} title={selectedSetting || ''}>
        <ComingSoon title={selectedSetting || ''} onBack={settingsDisclosure.close} />
      </AppModal>
    </SafeAreaView>
  );
};

export default ProfileView;