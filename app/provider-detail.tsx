import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Star, CheckCircle2, Info, Calendar, ChevronRight, CalendarPlus, Zap, Verified } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import { Colors, Shadows } from "../src/constants/theme";
import { PROVIDERS, AVAILABILITY_DAYS, TIME_SLOTS } from "../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProviderDetailScreen() {
  const router = useRouter();
  const provider = PROVIDERS[0]; // John Doe
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState(1);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack avatarUrl={provider.avatarUrl} />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4 gap-6">
          {/* Profile Header */}
          <View className="items-center">
            <View className="relative mb-4">
              <View className="w-36 h-36 rounded-full overflow-hidden border-4 border-surface-container-lowest" style={Shadows.lg}>
                <Image source={{ uri: provider.avatarUrl }} className="w-full h-full" resizeMode="cover" />
              </View>
              <View className="absolute bottom-2 right-2 bg-secondary rounded-full p-1.5 border-2 border-surface-container-lowest" style={Shadows.sm}>
                <Verified size={18} color={Colors.onSecondary} />
              </View>
            </View>
            <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-background">
              {provider.name}
            </Text>
            <View className="flex-row items-center gap-1 mt-2">
              <Zap size={16} color={Colors.onSurfaceVariant} />
              <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface-variant">
                {provider.specialty}
              </Text>
            </View>
          </View>

          {/* Stats grid */}
          <View className="flex-row gap-2">
            <View className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 items-center" style={Shadows.sm}>
              <View className="flex-row items-center gap-1 mb-1">
                <Star size={22} fill={Colors.secondary} color={Colors.secondary} />
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24 }} className="text-on-background">
                  {provider.rating}
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 1 }} className="text-on-surface-variant uppercase mt-1">
                Rating
              </Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 items-center" style={Shadows.sm}>
              <View className="flex-row items-center gap-1 mb-1">
                <CheckCircle2 size={22} color={Colors.primaryContainer} />
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24 }} className="text-on-background">
                  {provider.jobsCompleted}
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 1 }} className="text-on-surface-variant uppercase mt-1">
                Jobs
              </Text>
            </View>
            <View className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 items-center" style={Shadows.sm}>
              <View className="flex-row items-baseline gap-1 mb-1">
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24 }} className="text-on-background">
                  {provider.experience}
                </Text>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface-variant">
                  yrs
                </Text>
              </View>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 1 }} className="text-on-surface-variant uppercase mt-1">
                Experience
              </Text>
            </View>
          </View>

          {/* About */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
            <View className="flex-row items-center gap-2 mb-3">
              <Info size={20} color={Colors.secondary} />
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-background">
                About
              </Text>
            </View>
            <Text style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 26 }} className="text-on-surface-variant">
              {provider.about}
            </Text>
            <View className="flex-row flex-wrap gap-2 mt-4">
              {provider.skills.map((skill) => (
                <View key={skill} className="bg-surface-container px-4 py-1.5 rounded-full border border-outline-variant">
                  <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-on-surface-variant">
                    {skill}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Availability */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <Calendar size={20} color={Colors.secondary} />
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-on-background">
                  Availability
                </Text>
              </View>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>
                  View full calendar
                </Text>
                <ChevronRight size={14} color={Colors.secondary} />
              </TouchableOpacity>
            </View>

            {/* Day scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
              <View className="flex-row gap-2">
                {AVAILABILITY_DAYS.map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => day.available && setSelectedDay(index)}
                    disabled={!day.available}
                    className={`items-center justify-center min-w-[72px] h-24 rounded-xl border ${
                      selectedDay === index
                        ? "border-2"
                        : day.available
                        ? "border-outline-variant bg-surface"
                        : "border-outline-variant bg-surface-container-low opacity-40"
                    }`}
                    style={selectedDay === index ? { borderColor: Colors.secondary, backgroundColor: Colors.secondaryContainer } : {}}
                  >
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: selectedDay === index ? Colors.onSecondaryContainer : Colors.onSurfaceVariant }} className="uppercase mb-1">
                      {day.day}
                    </Text>
                    <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: selectedDay === index ? 24 : 20, color: selectedDay === index ? Colors.onSecondaryContainer : Colors.onSurface }}>
                      {day.date}
                    </Text>
                    {day.available && (
                      <View className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: selectedDay === index ? Colors.onSecondaryContainer : Colors.secondary }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Time slots */}
            <View className="mt-2">
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-on-surface-variant mb-2">
                Available times for {AVAILABILITY_DAYS[selectedDay]?.day}, {AVAILABILITY_DAYS[selectedDay]?.date}th
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {TIME_SLOTS.map((time, index) => (
                  <TouchableOpacity
                    key={time}
                    onPress={() => setSelectedTime(index)}
                    className={`flex-1 min-w-[100px] py-3 px-4 rounded-lg border items-center ${
                      selectedTime === index ? "border-2" : "border-outline-variant bg-surface"
                    }`}
                    style={selectedTime === index ? { borderColor: Colors.secondary, backgroundColor: `${Colors.secondary}15` } : {}}
                  >
                    <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: selectedTime === index ? Colors.secondary : Colors.onSurface }}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-4" style={Shadows.md}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 1 }} className="text-on-surface-variant uppercase">
              Estimated Rate
            </Text>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24 }} className="text-on-background">
              ${provider.rate}<Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">/hr</Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/book-service")}
            className="bg-secondary px-6 py-4 rounded-xl flex-row items-center gap-2"
            style={Shadows.md}
            activeOpacity={0.85}
          >
            <CalendarPlus size={18} color={Colors.onSecondary} />
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onSecondary }}>
              Book {provider.name}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
