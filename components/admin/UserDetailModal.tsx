import React from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { UserProfile, UserRole } from '@/services/userService';
import { OnboardingSummary } from '@/components/ui/OnboardingSummary';
import { Shield, Mail, Calendar, User as UserIcon, Briefcase } from 'lucide-react-native';

interface UserDetailModalProps {
  user: UserProfile | null;
  visible: boolean;
  onClose: () => void;
  onUpdateRole: () => void;
}

export function UserDetailModal({ user, visible, onClose, onUpdateRole }: UserDetailModalProps) {
  if (!user) return null;

  return (
    <ModalLayout
      visible={visible}
      onClose={onClose}
      title="User Details"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="pb-8">
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-[32px] bg-primary/10 items-center justify-center border-4 border-white shadow-xl shadow-slate-100">
             {user.avatar ? (
               <Text className="text-3xl">👤</Text> // Placeholder for avatar image if not using Image component here
             ) : (
               <Text weight="bold" className="text-3xl text-primary">{user.fullName.charAt(0)}</Text>
             )}
          </View>
          <Text weight="bold" className="text-2xl text-slate-900 mt-4">{user.fullName}</Text>
          <View className="flex-row items-center gap-2 mt-1 bg-slate-50 px-4 py-1.5 rounded-full">
            <Mail size={12} color="#64748B" />
            <Text className="text-slate-500 text-sm">{user.email}</Text>
          </View>
        </View>

        <View className="flex-row gap-4 mb-8">
          <View className="flex-1 bg-slate-50 p-4 rounded-2xl items-center">
            <Shield size={18} color="#4C6FFF" className="mb-1" />
            <Text weight="bold" className="text-slate-900 text-xs capitalize">{user.role}</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Role</Text>
          </View>
          <View className="flex-1 bg-slate-50 p-4 rounded-2xl items-center">
            <Calendar size={18} color="#4C6FFF" className="mb-1" />
            <Text weight="bold" className="text-slate-900 text-xs">Active</Text>
            <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-0.5">Status</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-[2px] mb-4 ml-1">
            Professional Profile
          </Text>
          {user.onboardingData ? (
            <OnboardingSummary data={user.onboardingData} />
          ) : (
            <View className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 items-center">
              <Text className="text-slate-400 text-xs italic">No onboarding data available for this user</Text>
            </View>
          )}
        </View>

        <Button 
          title="Change User Role"
          onPress={onUpdateRole}
          className="h-14 rounded-2xl bg-primary shadow-lg shadow-primary/20"
          iconLeft={<Shield size={18} color="white" />}
        />
      </ScrollView>
    </ModalLayout>
  );
}
