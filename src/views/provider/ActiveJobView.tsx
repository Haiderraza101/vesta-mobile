import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useActiveJobViewModel } from '../../viewmodels/useActiveJobViewModel';
import { theme } from '../../utils/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MapPin, Phone, Copy, ExternalLink, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { PrimaryButton } from '../../components/ui/PrimaryButton';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export const ActiveJobView = () => {
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { booking, customer, loading, isCompleting, markAsCompleted } = useActiveJobViewModel(bookingId);
  const router = useRouter();

  if (loading || !booking) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color={theme.colors.secondary} />
      </View>
    );
  }

  const copyAddress = async () => {
    await Clipboard.setStringAsync(booking.address);
    Toast.show({ type: 'info', text1: 'Address copied to clipboard' });
  };

  const openMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}`;
    Linking.openURL(url);
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="bg-green-500 py-4 px-6 flex-row items-center">
        <View className="w-2 h-2 rounded-full bg-white mr-3 animate-pulse" />
        <Text className="text-white font-bold uppercase tracking-widest text-xs">Job in Progress</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-8">
        <View className="flex-row items-center mb-10">
          <View className="w-16 h-16 rounded-full bg-blue-50 items-center justify-center mr-4" style={theme.shadows}>
            <Text className="text-blue-600 font-bold text-2xl">{customer?.fullName[0]}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Customer</Text>
            <Text className="text-2xl font-bold text-slate-900">{customer?.fullName}</Text>
          </View>
          <TouchableOpacity
            className="w-12 h-12 rounded-2xl bg-blue-500 items-center justify-center"
            onPress={() => Linking.openURL(`tel:1234567890`)}
          >
            <Phone size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="bg-slate-50 p-6 rounded-[35px] mb-8">
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-3">Service Details</Text>
          <View className="flex-row items-center mb-4">
            <View className="bg-blue-100 px-3 py-1 rounded-full mr-3">
              <Text className="text-blue-700 font-bold text-[10px] uppercase">{booking.serviceCategory}</Text>
            </View>
            <Text className="text-slate-900 font-bold text-base">Service Request</Text>
          </View>
          <Text className="text-slate-600 leading-6 mb-6">{booking.description}</Text>

          <View className="h-[1px] bg-slate-200 mb-6" />

          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-3">Location</Text>
          <View className="flex-row items-start mb-6">
            <MapPin size={18} color={theme.colors.muted} className="mt-1 mr-3" />
            <Text className="text-slate-900 font-medium flex-1 text-base leading-6">{booking.address}</Text>
          </View>

          <View className="flex-row space-x-3 gap-3">
            <TouchableOpacity
              onPress={copyAddress}
              className="flex-1 flex-row items-center justify-center bg-white border border-slate-200 h-12 rounded-2xl"
            >
              <Copy size={16} color={theme.colors.muted} className="mr-2" />
              <Text className="text-slate-600 font-bold">Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={openMaps}
              className="flex-1 flex-row items-center justify-center bg-white border border-slate-200 h-12 rounded-2xl"
            >
              <ExternalLink size={16} color={theme.colors.muted} className="mr-2" />
              <Text className="text-slate-600 font-bold">Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="p-6 border-t border-slate-100">
        <PrimaryButton
          title="Mark as Completed"
          onPress={markAsCompleted}
          isLoading={isCompleting}
          color={theme.colors.success}
        />
      </View>
    </SafeAreaView>
  );
};
