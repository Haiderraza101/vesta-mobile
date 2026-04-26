import React, { useState } from "react";
import { View, TouchableOpacity, Dimensions, ImageBackground, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight } from "lucide-react-native";

const { width } = Dimensions.get("window");

const STEPS = [
  {
    id: 1,
    title: "Expert repairs\nat your doorstep",
    description: "From plumbing to electrical repairs, our certified experts handle everything with precision and care.",
    image: "https://images.unsplash.com/photo-1581578731522-745d05cb9704?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Professional\nhome cleaning",
    description: "Experience deep sanitization and eco-friendly cleaning that makes your space feel brand new.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Everything you\nneed, managed",
    description: "Track your bookings, message providers, and manage your home with one simple, elegant application.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace("/(auth)/signup");
    }
  };

  const Step = STEPS[currentStep];

  return (
    <View className="flex-1 bg-slate-950">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground 
        source={{ uri: Step.image }} 
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(2, 6, 23, 0.4)', 'rgba(2, 6, 23, 0.95)', 'rgba(2, 6, 23, 1)']}
          className="flex-1"
        >
          <SafeAreaView className="flex-1 px-8 pb-12">
            <View className="flex-row justify-end pt-4">
              <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
                <Text weight="bold" className="text-white/40 tracking-[2px] uppercase text-[11px]">Skip Intro</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-1 justify-end">
              <View className="mb-6">
                <Text 
                  weight="bold" 
                  className="text-white text-[44px] leading-[54px] mb-4 tracking-tight"
                >
                  {Step.title}
                </Text>
                <Text className="text-white/60 text-[18px] leading-[28px] mb-12 pr-6">
                  {Step.description}
                </Text>

                <View className="flex-row gap-2.5 mb-14">
                  {STEPS.map((_, index) => (
                    <View
                      key={index}
                      className={`h-1.5 rounded-full ${
                        index === currentStep ? "bg-primary w-12" : "bg-white/20 w-3.5"
                      }`}
                    />
                  ))}
                </View>

                <Button 
                  title={currentStep === STEPS.length - 1 ? "Start Journey" : "Continue"} 
                  onPress={handleNext}
                  size="lg"
                  className="h-16 rounded-full shadow-2xl shadow-primary/40"
                  iconRight={currentStep !== STEPS.length - 1 ? <ArrowRight size={20} color="white" /> : undefined}
                />

                <View className="flex-row items-center justify-center mt-10 gap-2">
                  <Text className="text-white/40 text-[13px]">Already a member?</Text>
                  <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text weight="bold" className="text-white uppercase text-[12px] tracking-widest border-b border-white/30 pb-0.5">Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}
