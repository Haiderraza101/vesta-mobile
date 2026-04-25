import React, { useEffect } from "react";
import { View, Animated, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "../components/ui/Text";
import { Smartphone } from "lucide-react-native";

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(height / 10);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to Onboarding after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1 bg-primary items-center justify-center">
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        <View className="bg-white/20 p-6 rounded-[40px] mb-6">
           {/* @ts-ignore */}
           <Smartphone size={64} color="white" />
        </View>
        <Text variant="h1" weight="bold" className="text-white text-4xl tracking-widest">
          VESTA
        </Text>
        <Text className="text-white/60 mt-2 tracking-widest uppercase text-xs font-medium">
          Home Services Reimagined
        </Text>
      </Animated.View>
    </View>
  );
}
