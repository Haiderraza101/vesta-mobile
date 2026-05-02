import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Camera, Lock } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import { updateUserName } from "../services/db";
import { Colors, Shadows } from "../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.fullName || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!user || !name.trim()) {
      Alert.alert("Error", "Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      await updateUserName(user.uid, name.trim());
      await refreshProfile();
      Alert.alert("Success", "Your profile has been updated.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Update error:", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          {/* Page header */}
          <View className="gap-1">
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-on-surface">
              Edit Profile
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24 }} className="text-on-surface-variant">
              Update your personal information to keep your account current.
            </Text>
          </View>

          {/* Form card */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 gap-6" style={Shadows.sm}>
            {/* Avatar section */}
            <View className="items-center gap-2 pt-2">
              <View className="relative">
                <View className="w-24 h-24 rounded-full bg-secondary-fixed items-center justify-center border-4 border-surface-container-lowest" style={Shadows.md}>
                  <Text style={{ fontFamily: "Manrope-Bold", fontSize: 36, color: Colors.secondary }}>
                    {(profile?.fullName || "U").charAt(0).toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity className="absolute bottom-0 right-0 bg-secondary w-8 h-8 rounded-full items-center justify-center border-2 border-surface-container-lowest" style={Shadows.sm}>
                  <Camera size={14} color={Colors.onSecondary} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48, color: Colors.secondary }}>
                  Change Photo
                </Text>
              </TouchableOpacity>
            </View>

            <View className="h-px bg-outline-variant opacity-40" />

            {/* Fields */}
            <View className="gap-4">
              {/* Full Name (editable) */}
              <View className="gap-1">
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
                  Full Name
                </Text>
                <TextInput
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface"
                  style={{ fontFamily: "Inter", fontSize: 16 }}
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email (read-only) */}
              <View className="gap-1 mt-2">
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant">
                  Email Address
                </Text>
                <View className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 flex-row items-center justify-between">
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">
                    {profile?.email || ""}
                  </Text>
                  <Lock size={16} color={Colors.outline} />
                </View>
                <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-outline mt-0.5">
                  Contact support to change your email address.
                </Text>
              </View>

              {/* Account Type (read-only) */}
              <View className="gap-1 mt-2">
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface-variant">
                  Account Type
                </Text>
                <View className="bg-surface-container-low border border-outline-variant/50 rounded-lg px-4 py-3 flex-row items-center gap-2">
                  <Text style={{ fontFamily: "Inter", fontSize: 20 }}>⭐</Text>
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 16 }} className="text-on-surface-variant">
                    {profile?.role === "provider" ? "Service Provider" : "Customer"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="h-px bg-outline-variant opacity-40" />

            {/* Actions */}
            <View className="flex-row gap-3">
              <View className="flex-1">
                <PrimaryButton title="Cancel" variant="secondary" onPress={() => router.back()} />
              </View>
              <View className="flex-1">
                <PrimaryButton title="Save Changes" onPress={handleSave} loading={saving} />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
