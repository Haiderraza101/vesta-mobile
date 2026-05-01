import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEditProfileViewModel } from '../../viewmodels/useEditProfileViewModel';
import { theme } from '../../utils/theme';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera } from 'lucide-react-native';
import { InputField } from '../../components/ui/InputField';
import { PrimaryButton } from '../../components/ui/PrimaryButton';

export const EditProfileView = () => {
  const {
    fullName, setFullName,
    profileImageUrl, pickImage,
    handleSave, loading, uploading
  } = useEditProfileViewModel();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="px-6 py-4 flex-row items-center justify-between">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft size={24} color={theme.colors.foreground} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-slate-900">Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          <Text className={`font-bold ${loading ? 'text-slate-300' : 'text-blue-600'}`}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6 pt-10">
        <View className="items-center mb-12">
          <TouchableOpacity onPress={pickImage} disabled={uploading} className="relative">
            <View className="w-32 h-32 rounded-[45px] bg-slate-100 overflow-hidden" style={theme.shadows}>
              {profileImageUrl ? (
                <Image source={{ uri: profileImageUrl }} className="w-full h-full" />
              ) : (
                <View className="w-full h-full items-center justify-center">
                  <Text className="text-slate-300 font-bold text-4xl">{fullName[0]}</Text>
                </View>
              )}
              {uploading && (
                <View className="absolute inset-0 bg-black/30 items-center justify-center">
                  <ActivityIndicator color="white" />
                </View>
              )}
            </View>
            <View className="absolute bottom-0 right-0 bg-blue-600 w-10 h-10 rounded-2xl items-center justify-center border-4 border-white">
              <Camera size={18} color="white" />
            </View>
          </TouchableOpacity>
          <Text className="text-slate-400 text-sm mt-6">Tap to change profile picture</Text>
        </View>

        <InputField
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChangeText={setFullName}
        />

        <View className="mt-10">
          <PrimaryButton
            title="Save Changes"
            onPress={handleSave}
            isLoading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
