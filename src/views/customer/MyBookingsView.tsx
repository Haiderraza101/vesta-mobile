import React from 'react';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBookings } from '../../context/BookingContext';
import { theme } from '../../utils/theme';
import { BrushCleaning, Zap, Wrench, Clock, MapPin } from 'lucide-react-native';
import { formatRelativeTime } from '../../utils/helpers';

const StatusBadge = ({ status }: { status: string }) => {
  const config = (theme.colors.status as any)[status] || theme.colors.status.pending;
  return (
    <View
      className="px-3 py-1 rounded-full"
      style={{ backgroundColor: config.bg }}
    >
      <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: config.text }}>
        {status}
      </Text>
    </View>
  );
};

const BookingCard = ({ item }: any) => {
  const Icon = item.serviceCategory === 'Cleaning' ? BrushCleaning : item.serviceCategory === 'Electrical' ? Zap : Wrench;
  const iconBg = item.serviceCategory === 'Cleaning' ? '#E6FFFA' : item.serviceCategory === 'Electrical' ? '#FEFCBF' : '#EBF8FF';
  const iconColor = item.serviceCategory === 'Cleaning' ? '#319795' : item.serviceCategory === 'Electrical' ? '#B45309' : '#2B6CB0';

  return (
    <View
      className="bg-white p-5 rounded-[30px] mb-4 border border-slate-50"
      style={theme.shadows}
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center">
          <View className="w-12 h-12 rounded-2xl items-center justify-center mr-4" style={{ backgroundColor: iconBg }}>
            <Icon size={24} color={iconColor} />
          </View>
          <View>
            <Text className="text-lg font-bold text-slate-900">{item.serviceCategory}</Text>
            <View className="flex-row items-center">
              <Clock size={12} color={theme.colors.muted} />
              <Text className="text-slate-400 text-xs ml-1">{formatRelativeTime(item.createdAt)}</Text>
            </View>
          </View>
        </View>
        <StatusBadge status={item.status} />
      </View>

      <Text className="text-slate-600 text-sm mb-4 leading-5" numberOfLines={2}>
        {item.description}
      </Text>

      <View className="flex-row items-center pt-4 border-t border-slate-50">
        <MapPin size={14} color={theme.colors.muted} />
        <Text className="text-slate-400 text-xs ml-2 flex-1" numberOfLines={1}>{item.address}</Text>
      </View>
    </View>
  );
};

export const MyBookingsView = () => {
  const { activeBookings, bookingHistory, loading } = useBookings();

  const sections = [
    { title: 'Active Requests', data: activeBookings },
    { title: 'Past Bookings', data: bookingHistory },
  ].filter(s => s.data.length > 0);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top', 'bottom']}>
      <View className="px-6 py-6">
        <Text className="text-3xl font-bold text-slate-900">My Bookings</Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-6 mb-4 ml-1">
            {title}
          </Text>
        )}
        renderItem={({ item }) => <BookingCard item={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className="flex-1 items-center justify-center mt-20">
              <Text className="text-slate-500 text-lg">No bookings yet.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};
