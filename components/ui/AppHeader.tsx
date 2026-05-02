import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { Colors } from "../../src/constants/theme";

interface AppHeaderProps {
  showBack?: boolean;
  avatarUrl?: string;
  onAvatarPress?: () => void;
}

export default function AppHeader({ showBack = false, avatarUrl, onAvatarPress }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row justify-between items-center w-full px-4 h-14 bg-surface-container-lowest border-b border-outline-variant">
      <View className="flex-row items-center gap-3">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="p-2 rounded-full" activeOpacity={0.7}>
            <ArrowLeft size={22} color={Colors.secondary} />
          </TouchableOpacity>
        )}
        <Text style={{ fontFamily: "Manrope-ExtraBold", fontSize: 18 }} className="text-primary tracking-tight">
          ServiceHub
        </Text>
      </View>
      {avatarUrl && (
        <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
          <View className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
