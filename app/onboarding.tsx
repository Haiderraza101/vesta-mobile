import React, { useState } from "react";
import { View, TouchableOpacity, Dimensions, ImageBackground, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../components/ui/Text";
import { Button } from "../components/ui/Button";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get("window");

const STEPS = [
  {
    id: 1,
    title: "Expert repairs\nat your doorstep",
    description: "From plumbing to electrical repairs, our certified experts handle everything with care.",
    image: "https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Clean home\nhappy you always",
    description: "We provide detailed house cleaning service for our valuable clients with professional experts.",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800&auto=format&fit=crop",
  },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.push("/(auth)/signup");
    }
  };

  const Step = STEPS[currentStep];

  return (
    <View className="flex-1 bg-slate-900">
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground 
        source={{ uri: Step.image }} 
        className="flex-1"
        resizeMode="cover"
      >
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.95)']}
          className="flex-1"
        >
          <SafeAreaView className="flex-1 px-8 pb-12">
            <View className="flex-row justify-end pt-4">
              <TouchableOpacity onPress={() => router.replace("/(tabs)")}>
                <Text weight="bold" className="text-white/60 tracking-widest uppercase text-xs">Skip</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-1 justify-end">
              <View className="mb-6">
                <Text 
                  weight="bold" 
                  className="text-white text-[42px] leading-[52px] mb-4 tracking-tight"
                >
                  {Step.title}
                </Text>
                <Text className="text-white/60 text-[17px] leading-[26px] mb-10 pr-10">
                  {Step.description}
                </Text>

                <View className="flex-row gap-2 mb-12">
                  {STEPS.map((_, index) => (
                    <View
                      key={index}
                      className={`h-1.5 rounded-full ${
                        index === currentStep ? "bg-primary w-10" : "bg-white/20 w-3"
                      }`}
                    />
                  ))}
                </View>

                <Button 
                  title={currentStep === STEPS.length - 1 ? "Get Started" : "Next Step"} 
                  onPress={handleNext}
                  size="lg"
                  className="h-16"
                />

                <View className="flex-row items-center justify-center mt-8 gap-2">
                  <Text className="text-white/50 text-sm">Already have an account?</Text>
                  <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                    <Text weight="bold" className="text-white uppercase text-[13px] tracking-wider">Log In</Text>
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
