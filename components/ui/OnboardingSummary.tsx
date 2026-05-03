import React from 'react';
import { View } from 'react-native';
import { Text } from './Text';
import { ClipboardList, CheckCircle2 } from 'lucide-react-native';

interface OnboardingSummaryProps {
  data: Record<string, any>;
}

export function OnboardingSummary({ data }: OnboardingSummaryProps) {
  if (!data || Object.keys(data).length === 0) return null;

  return (
    <View className="bg-white rounded-3xl p-6 border border-slate-50 shadow-sm">
      <View className="flex-row items-center gap-3 mb-6">
        <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center">
          <ClipboardList size={20} color="#4C6FFF" />
        </View>
        <View>
          <Text weight="bold" className="text-slate-900 text-base">Profile Details</Text>
          <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Onboarding Answers</Text>
        </View>
      </View>

      <View className="gap-y-4">
        {Object.entries(data).map(([key, value]) => {
          // Format key: replace underscores/camelCase with spaces and capitalize
          const label = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .replace(/^\w/, c => c.toUpperCase());

          return (
            <View key={key} className="bg-slate-50/50 p-4 rounded-2xl border border-slate-50">
              <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">{label}</Text>
              <View className="flex-row items-center justify-between">
                <Text weight="bold" className="text-slate-900 text-sm flex-1 mr-2">{value || 'Not provided'}</Text>
                <CheckCircle2 size={14} color="#10B981" />
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
