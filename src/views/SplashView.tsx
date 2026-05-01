import React, { useEffect } from "react";
import { View, Animated, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { theme } from '../utils/theme';
import { Text } from "../../components/ui/Text";

export const SplashView = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.95);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (!user) {
          router.replace("/(auth)/login");
        } else if (!user.role) {
          router.replace("/(auth)/role-selection");
        } else {
          router.replace(user.role === "customer" ? "/(customer-tabs)" : "/(provider-tabs)");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  return (
    <View className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[theme.colors.primary, '#1E293B']}
        className="flex-1 items-center justify-center"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          <View
            className="bg-white/5 p-8 rounded-[40px] mb-6 border border-white/10"
            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.3, shadowRadius: 30 }}
          >
             <Sparkles size={64} color={theme.colors.brand} fill={theme.colors.brand} />
          </View>
          <Text variant="h1" weight="bold" className="text-white text-5xl tracking-tight mb-2">
            Vesta
          </Text>
          <View className="h-1 w-8 bg-brand my-4 rounded-full" />
          <Text className="text-white/60 tracking-[5px] uppercase text-[10px] font-bold">
            Elevated Home Services
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
};
