import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, Switch, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProviderHomeViewModel } from '../../viewmodels/useProviderHomeViewModel';
import { theme } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { MapPin, Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { formatRelativeTime } from '../../utils/helpers';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';

const JobCard = ({ item, onAccept }: any) => (
  <Animated.View
    entering={FadeInRight}
    layout={Layout.springify()}
    className="bg-white p-6 rounded-[35px] mb-4 border border-slate-100"
    style={theme.shadows}
  >
    <View className="flex-row justify-between items-start mb-4">
      <View>
        <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">New Request</Text>
        <Text className="text-xl font-bold text-slate-900">{item.customerName}</Text>
      </View>
      <View className="bg-blue-50 px-3 py-1 rounded-full">
        <Text className="text-blue-600 text-[10px] font-bold uppercase">{item.serviceCategory}</Text>
      </View>
    </View>

    <Text className="text-slate-500 text-sm mb-4 leading-5" numberOfLines={3}>
      {item.description}
    </Text>

    <View className="flex-row items-center mb-6">
      <MapPin size={14} color={theme.colors.muted} />
      <Text className="text-slate-400 text-xs ml-2 flex-1" numberOfLines={1}>{item.address}</Text>
      <Clock size={14} color={theme.colors.muted} className="ml-4" />
      <Text className="text-slate-400 text-xs ml-2">{formatRelativeTime(item.createdAt)}</Text>
    </View>

    <View className="flex-row space-x-3 gap-3">
      <TouchableOpacity
        className="flex-1 bg-slate-50 h-12 rounded-2xl items-center justify-center"
      >
        <Text className="text-slate-400 font-bold">Decline</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onAccept(item.id)}
        className="flex-[2] bg-green-500 h-12 rounded-2xl items-center justify-center"
      >
        <Text className="text-white font-bold">Accept Job</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

export const ProviderHomeView = () => {
  const { isAvailable, toggleAvailability, jobs, loading, acceptJob, firstName } = useProviderHomeViewModel();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <View className="px-6 py-6 flex-row justify-between items-center">
        <View>
          <Text className="text-slate-500 text-sm font-medium">Welcome back,</Text>
          <Text className="text-2xl font-bold text-slate-900">{firstName}</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(provider-tabs)/profile')}>
          <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center border border-slate-100" style={theme.shadows}>
            <Text className="text-blue-600 font-bold text-lg">{firstName[0]}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        <GlassCard intensity={60} className="mb-10">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className={`text-lg font-bold mb-1 ${isAvailable ? 'text-green-700' : 'text-slate-700'}`}>
                You are {isAvailable ? 'ONLINE' : 'OFFLINE'}
              </Text>
              <Text className="text-slate-500 text-sm">
                {isAvailable ? 'Accepting new requests' : 'Toggle to start receiving jobs'}
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={toggleAvailability}
              trackColor={{ false: '#CBD5E0', true: '#27AE60' }}
              thumbColor="white"
            />
          </View>
        </GlassCard>

        <Text className="text-xl font-bold text-slate-900 mb-6">Incoming Requests</Text>

        {!isAvailable ? (
          <View className="items-center justify-center mt-10 py-10 bg-white rounded-[40px] border border-slate-100">
            <XCircle size={60} color={theme.colors.muted} strokeWidth={1.5} className="mb-4" />
            <Text className="text-slate-400 text-center px-10">You are offline. Toggle your status to start receiving jobs.</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color={theme.colors.secondary} className="mt-10" />
        ) : jobs.length === 0 ? (
          <View className="items-center justify-center mt-10 py-10 bg-white rounded-[40px] border border-slate-100">
            <Clock size={60} color={theme.colors.muted} strokeWidth={1.5} className="mb-4" />
            <Text className="text-slate-400 text-center px-10">No pending requests right now. Stay online — new requests will appear here instantly.</Text>
          </View>
        ) : (
          jobs.map(job => (
            <JobCard
              key={job.id}
              item={job}
              onAccept={(id: string) => {
                acceptJob(id);
                router.push({ pathname: '/(provider-tabs)/active-job', params: { bookingId: id } });
              }}
            />
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
};
