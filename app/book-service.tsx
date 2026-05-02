import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowRight, MapPin, Star, Verified } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import { useAuth } from "../context/AuthContext";
import { getProviderById, createBooking, ProviderProfile } from "../services/db";
import { Colors, Shadows } from "../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookServiceScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [provider, setProvider] = useState<ProviderProfile | null>(null);
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProvider();
  }, [id]);

  const loadProvider = async () => {
    if (!id) return;
    try {
      const data = await getProviderById(id);
      setProvider(data);
    } catch (error) {
      console.error("Error loading provider:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!provider || !user) return;
    if (!description.trim()) {
      Alert.alert("Error", "Please describe your problem.");
      return;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter your service address.");
      return;
    }

    setSubmitting(true);
    try {
      const laborCost = provider.hourlyRate * 2;
      const serviceFee = 45;
      const platformFee = 12.5;
      const totalPrice = laborCost + serviceFee + platformFee;

      await createBooking({
        providerId: provider.providerId,
        providerName: provider.fullName,
        serviceCategory: provider.serviceCategory,
        title: `${provider.specialty} Service`,
        description: description.trim(),
        customerMessage: description.trim(),
        address: address.trim(),
        notes: "",
        price: totalPrice,
        scheduledDate: new Date(),
      });

      Alert.alert("Success!", "Your booking request has been submitted.", [
        { text: "View Bookings", onPress: () => router.replace("/(tabs)/bookings") },
      ]);
    } catch (error) {
      console.error("Booking error:", error);
      Alert.alert("Error", "Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={Colors.secondary} />
      </SafeAreaView>
    );
  }

  if (!provider) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">Provider not found.</Text>
      </SafeAreaView>
    );
  }

  const laborCost = provider.hourlyRate * 2;
  const serviceFee = 45;
  const platformFee = 12.5;
  const totalPrice = laborCost + serviceFee + platformFee;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4">
          {/* Progress bar */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-2">
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
                Request Details
              </Text>
              <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface-variant">
                Step 2 of 3
              </Text>
            </View>
            <View className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
              <View className="h-full bg-secondary rounded-full" style={{ width: "66%" }} />
            </View>
          </View>

          {/* Section title */}
          <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31, letterSpacing: -0.24 }} className="text-primary mb-6">
            Describe your needs
          </Text>

          {/* Provider summary card */}
          <View className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-6" style={Shadows.sm}>
            <Text style={{ fontFamily: "Inter-Medium", fontSize: 11, letterSpacing: 1 }} className="text-on-surface-variant uppercase mb-2">
              Selected Provider
            </Text>
            <View className="flex-row items-center gap-3">
              <View className="relative">
                <View className="w-14 h-14 rounded-full bg-secondary-fixed items-center justify-center border border-outline-variant">
                  <Text style={{ fontFamily: "Manrope-Bold", fontSize: 20, color: Colors.secondary }}>
                    {provider.fullName.charAt(0)}
                  </Text>
                </View>
                <View className="absolute -bottom-1 -right-1 bg-surface-container-lowest rounded-full p-0.5 border border-outline-variant">
                  <Verified size={12} color={Colors.secondary} />
                </View>
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-primary">
                  {provider.fullName}
                </Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <Star size={14} fill={Colors.onSurface} color={Colors.onSurface} />
                  <Text style={{ fontFamily: "Inter-Medium", fontSize: 12 }} className="text-on-surface">
                    {provider.rating}
                  </Text>
                  <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                    · {provider.specialty}
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-primary">
                  ${provider.hourlyRate}/hr
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                  Est. rate
                </Text>
              </View>
            </View>
          </View>

          {/* Form */}
          <View className="gap-6">
            {/* Description */}
            <View>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface mb-2">
                Describe your problem in detail
              </Text>
              <TextInput
                className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 text-on-surface"
                style={{ fontFamily: "Inter", fontSize: 16, lineHeight: 24, height: 130, textAlignVertical: "top" }}
                placeholder="Please provide specific details about the issue..."
                placeholderTextColor={`${Colors.onSurfaceVariant}80`}
                multiline
                value={description}
                onChangeText={setDescription}
                maxLength={500}
              />
              <View className="flex-row justify-between items-center mt-1">
                <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                  Be as specific as possible.
                </Text>
                <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
                  {description.length} / 500
                </Text>
              </View>
            </View>

            {/* Address */}
            <View>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface mb-2">
                Service Address
              </Text>
              <View className="flex-row items-center bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3">
                <MapPin size={20} color={Colors.onSurfaceVariant} />
                <TextInput
                  className="flex-1 ml-3 text-on-surface"
                  style={{ fontFamily: "Inter", fontSize: 16 }}
                  placeholder="Enter full address"
                  placeholderTextColor={`${Colors.onSurfaceVariant}80`}
                  value={address}
                  onChangeText={setAddress}
                />
              </View>
            </View>

            {/* Price breakdown */}
            <View className="bg-surface-container-low border border-outline-variant rounded-xl p-4 mt-2">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-primary mb-4">
                Estimated Price Summary
              </Text>
              <View className="gap-2">
                <View className="flex-row justify-between">
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">Estimated Labor (2 hours)</Text>
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface">${laborCost.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">Service Call Fee</Text>
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface">${serviceFee.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">Platform Trust Fee</Text>
                  <Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface">${platformFee.toFixed(2)}</Text>
                </View>
              </View>
              <View className="h-px bg-outline-variant my-4" />
              <View className="flex-row justify-between items-center">
                <View>
                  <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-primary">Total Estimate</Text>
                  <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant mt-1">Final price may vary based on actual work.</Text>
                </View>
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 24, lineHeight: 31 }} className="text-primary">${totalPrice.toFixed(2)}</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-4" style={Shadows.md}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting}
          className={`w-full bg-secondary py-4 rounded-xl flex-row items-center justify-center gap-2 ${submitting ? "opacity-50" : ""}`}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color={Colors.onSecondary} />
          ) : (
            <>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.onSecondary }}>Submit Request</Text>
              <ArrowRight size={18} color={Colors.onSecondary} />
            </>
          )}
        </TouchableOpacity>
        <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48 }} className="text-on-surface-variant text-center mt-1">
          You won't be charged until the provider accepts.
        </Text>
      </View>
    </SafeAreaView>
  );
}
