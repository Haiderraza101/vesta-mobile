import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Calendar, Clock, ChevronRight } from 'lucide-react-native';
import { Booking } from '@/services/bookingService';
import { useConfig } from '@/context/ConfigContext';

interface BookingCardProps {
  booking: Booking;
  onPress?: () => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const { settings } = useConfig();
  
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': return { text: 'text-amber-600', bg: 'bg-amber-50', label: 'Pending' };
      case 'confirmed': return { text: 'text-blue-600', bg: 'bg-blue-50', label: 'Confirmed' };
      case 'completed': return { text: 'text-emerald-600', bg: 'bg-emerald-50', label: 'Completed' };
      case 'cancelled': return { text: 'text-rose-600', bg: 'bg-rose-50', label: 'Cancelled' };
      default: return { text: 'text-slate-600', bg: 'bg-slate-50', label: status };
    }
  };

  const statusStyle = getStatusStyle(booking.status);

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={onPress}
      className="bg-white rounded-2xl p-4 mb-4 border border-slate-50 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 mr-4">
          <Text weight="bold" className="text-base text-slate-900 mb-1">{booking.serviceName}</Text>
          <View className={`self-start px-2 py-1 rounded-lg ${statusStyle.bg}`}>
            <Text weight="bold" className={`text-[10px] uppercase tracking-wider ${statusStyle.text}`}>{statusStyle.label}</Text>
          </View>
        </View>
        <Text weight="bold" className="text-primary text-base">{settings.currencySymbol}{booking.price}</Text>
      </View>

      <View className="h-[1px] bg-slate-50 w-full mb-4" />

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center gap-1.5">
            <Calendar size={14} color="#64748B" />
            <Text className="text-slate-500 text-xs font-medium">{booking.date}</Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <Clock size={14} color="#64748B" />
            <Text className="text-slate-500 text-xs font-medium">{booking.time}</Text>
          </View>
        </View>
        
        <View className="w-8 h-8 rounded-full bg-slate-50 items-center justify-center">
          <ChevronRight size={16} color="#4C6FFF" strokeWidth={3} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
