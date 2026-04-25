import React, { useEffect } from "react";
import { View, Animated, Dimensions, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Text } from "../components/ui/Text";
import { Sparkles } from "lucide-react-native";
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);
  const slideAnim = new Animated.Value(20);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View className="flex-1">
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#4C6FFF', '#3B82F6']}
        className="flex-1 items-center justify-center"
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: slideAnim }
            ],
            alignItems: "center",
          }}
        >
          <View className="bg-white/10 p-8 rounded-[45px] mb-8 border border-white/20">
             <Sparkles size={72} color="white" fill="white" />
          </View>
          <Text weight="bold" className="text-white text-[48px] tracking-tight">
            Vesta
          </Text>
          <View className="h-[2px] w-12 bg-white/30 my-4 rounded-full" />
          <Text className="text-white/80 tracking-[4px] uppercase text-[11px] font-bold">
            Premium Home Services
          </Text>
        </Animated.View>
        
        <View className="absolute bottom-12 items-center">
          <Text className="text-white/40 text-xs tracking-widest">VERSION 2.0</Text>
        </View>
      </LinearGradient>
    </View>
  );
}
