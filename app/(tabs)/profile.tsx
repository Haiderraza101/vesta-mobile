import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { User, Bell, Shield, HelpCircle, LogOut, ShieldCheck, Star, Award, Briefcase, TrendingUp } from "lucide-react-native";
import AppHeader from "../../components/ui/AppHeader";
import ProfileMenuItem from "../../components/ui/ProfileMenuItem";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { Colors, Shadows } from "../../src/constants/theme";
import { MOCK_USER } from "../../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const isProvider = user?.role === "provider";

  const handleSignOut = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack avatarUrl={MOCK_USER.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="px-4 pt-4 gap-4">
          {/* Profile card */}
          <View
            className="bg-surface-container-lowest rounded-xl border border-outline-variant p-6 items-center"
            style={Shadows.md}
          >
            <View className="relative mb-4">
              <Image
                source={{ uri: MOCK_USER.avatarUrl }}
                className="w-24 h-24 rounded-full border-4 border-surface-container-lowest"
                style={Shadows.sm}
              />
              <TouchableOpacity
                onPress={() => router.push("/edit-profile")}
                className="absolute bottom-0 right-0 bg-secondary w-8 h-8 rounded-full items-center justify-center"
                style={Shadows.sm}
              >
                <Text className="text-on-secondary text-xs">✏️</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-surface mb-1">
              {MOCK_USER.name}
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant mb-2">
              {isProvider ? "Expert Electrician" : MOCK_USER.email}
            </Text>
            
            {isProvider ? (
              <View className="flex-row gap-3">
                <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high">
                  <ShieldCheck size={13} color={Colors.secondary} />
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-secondary">
                    Verified
                  </Text>
                </View>
                <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high">
                  <Star size={13} color={Colors.secondary} />
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-secondary">
                    4.8 Rating
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-row items-center gap-1 px-3 py-1 rounded-full bg-surface-container-high">
                <ShieldCheck size={13} color={Colors.onSurfaceVariant} />
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface-variant">
                  {MOCK_USER.badge}
                </Text>
              </View>
            )}
          </View>

          {isProvider ? (
            <>
              {/* Provider Stats */}
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant p-4" style={Shadows.md}>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface-variant mb-1">
                    Jobs Completed
                  </Text>
                  <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-secondary">
                    150
                  </Text>
                </View>
                <View className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant p-4" style={Shadows.md}>
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface-variant mb-1">
                    Earnings
                  </Text>
                  <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-secondary">
                    $2.4K
                  </Text>
                </View>
              </View>

              {/* Provider Settings */}
              <View className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={Shadows.md}>
                <ProfileMenuItem
                  icon={<Briefcase size={20} color={Colors.onSurfaceVariant} />}
                  title="Services & Skills"
                  subtitle="Update your specialties and skills"
                  onPress={() => router.push("/edit-profile")}
                />
                <View className="h-px bg-outline-variant mx-4" />
                <ProfileMenuItem
                  icon={<Award size={20} color={Colors.onSurfaceVariant} />}
                  title="Verification"
                  subtitle="View your documents and verification status"
                />
                <View className="h-px bg-outline-variant mx-4" />
                <ProfileMenuItem
                  icon={<Star size={20} color={Colors.onSurfaceVariant} />}
                  title="Reviews & Ratings"
                  subtitle="See what customers say about you"
                />
                <View className="h-px bg-outline-variant mx-4" />
                <ProfileMenuItem
                  icon={<TrendingUp size={20} color={Colors.onSurfaceVariant} />}
                  title="Earnings"
                  subtitle="View your earnings from completed jobs"
                />
              </View>

              <View className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={Shadows.md}>
                <ProfileMenuItem
                  icon={<Bell size={20} color={Colors.onSurfaceVariant} />}
                  title="Notification Settings"
                  subtitle="Control job alerts and messages"
                />
                <View className="h-px bg-outline-variant mx-4" />
                <ProfileMenuItem
                  icon={<Shield size={20} color={Colors.onSurfaceVariant} />}
                  title="Privacy & Safety"
                  subtitle="Manage your profile visibility"
                />
              </View>
            </>
          ) : (
            <>
              {/* Customer Settings */}
              <View className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={Shadows.md}>
                <ProfileMenuItem
                  icon={<User size={20} color={Colors.onSurfaceVariant} />}
                  title="Personal Information"
                  subtitle="Update your name, email, and phone"
                  onPress={() => router.push("/edit-profile")}
                />
                <View className="h-px bg-outline-variant mx-4" />
                <ProfileMenuItem
                  icon={<Bell size={20} color={Colors.onSurfaceVariant} />}
                  title="Notification Settings"
                  subtitle="Control email and push alerts"
                />
              </View>

              <View className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden" style={Shadows.md}>
                <ProfileMenuItem
                  icon={<Shield size={20} color={Colors.onSurfaceVariant} />}
                  title="Privacy Policy"
                  subtitle="Read how we protect your data"
                />
                <View className="h-px bg-outline-variant mx-4" />
                <ProfileMenuItem
                  icon={<HelpCircle size={20} color={Colors.onSurfaceVariant} />}
                  title="Help & Support"
                  subtitle="Get assistance with your bookings"
                />
              </View>
            </>
          )}

          {/* Sign out */}
          <PrimaryButton
            title="Sign Out"
            variant="danger"
            icon={<LogOut size={18} color={Colors.onError} />}
            onPress={handleSignOut}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
