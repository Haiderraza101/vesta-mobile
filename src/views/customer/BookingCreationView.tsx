import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookingCreationViewModel } from '../../viewmodels/useBookingCreationViewModel';
import { theme } from '../../utils/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, ClipboardList } from 'lucide-react-native';
import { InputField } from '../../components/ui/InputField';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import { keyboardBehavior } from '../../utils/helpers';

export const BookingCreationView = () => {
  const { providerId, providerName, category } = useLocalSearchParams<{ providerId: string; providerName: string; category: string }>();
  const { description, setDescription, address, setAddress, loading, handleBooking } = useBookingCreationViewModel(providerId, category);
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior={keyboardBehavior} className="flex-1">
        <View className="px-6 py-4 flex-row items-center border-b border-slate-50">
          <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft size={24} color={theme.colors.foreground} />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-slate-900 ml-2">New Request</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-8">
          <View className="bg-slate-50 p-6 rounded-[30px] mb-8 flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center mr-4" style={theme.shadows}>
              <ClipboardList size={24} color={theme.colors.secondary} />
            </View>
            <View>
              <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Booking with</Text>
              <Text className="text-slate-900 font-bold text-lg">{providerName}</Text>
            </View>
          </View>

          <InputField
            label="What do you need help with?"
            placeholder="e.g. My kitchen sink is leaking..."
            multiline
            numberOfLines={4}
            value={description}
            onChangeText={setDescription}
            style={{ height: 120, textAlignVertical: 'top', paddingTop: 15 }}
          />
          <Text className="text-slate-400 text-right text-xs -mt-2 mb-6">{description.length} / 300</Text>

          <InputField
            label="Where do you need the service?"
            placeholder="Enter your full address"
            value={address}
            onChangeText={setAddress}
          />
          <View className="flex-row items-center ml-1 mb-10">
            <MapPin size={14} color={theme.colors.muted} />
            <Text className="text-slate-400 text-xs ml-2">The provider will travel to this address.</Text>
          </View>
        </ScrollView>

        <View className="p-6 border-t border-slate-50">
          <PrimaryButton
            title="Submit Request"
            onPress={handleBooking}
            isLoading={loading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
