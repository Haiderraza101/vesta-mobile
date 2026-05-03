import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/context/ToastContext';
import { serviceService, ProviderRequest } from '@/services/serviceService';
import { ChevronLeft, UserCheck, CheckCircle2, XCircle, Briefcase, Info, ShieldCheck} from 'lucide-react-native';

export default function AdminProviderRequests() {
  const router = useRouter();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = serviceService.getProviderRequests((data) => {
      const hiringRequests = data.filter(r => r.type === 'hiring');
      setRequests(hiringRequests);
      setLoading(false);
      setRefreshing(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const handleVerify = async (requestId: string, status: 'accepted' | 'rejected') => {
    setProcessingId(requestId);
    try {
      await serviceService.verifyProviderRequest(requestId, status);
      showToast(`${status === 'accepted' ? 'Approved' : 'Rejected'} successfully`, "success");
    } catch (error) {
      showToast("Verification failed", "error");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <View className="px-6 py-4 flex-row items-center gap-4">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-slate-50 rounded-xl items-center justify-center border border-slate-100"
          >
            <ChevronLeft size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text weight="bold" className="text-xl text-slate-900">Admin Approvals</Text>
        </View>
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}
      >
        {requests.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <View className="w-20 h-20 bg-slate-100 rounded-3xl items-center justify-center mb-4">
              <UserCheck size={32} color="#94A3B8" />
            </View>
            <Text weight="bold" className="text-lg text-slate-900 mb-1">No pending requests</Text>
            <Text className="text-slate-500 text-sm text-center px-10">
              Applications for platform hiring will appear here.
            </Text>
          </View>
        ) : (
          requests.map((request) => (
            <View 
              key={request.id}
              className="bg-white rounded-[40px] p-8 mb-8 border border-slate-50 shadow-xl shadow-slate-100"
            >
              <View className="flex-row items-center justify-between mb-8">
                <View className="flex-row items-center gap-4">
                  <View className="w-14 h-14 bg-slate-100 rounded-2xl items-center justify-center overflow-hidden">
                    <Text weight="bold" className="text-primary text-xl">{(request.providerName || 'P').charAt(0)}</Text>
                  </View>
                  <View>
                    <Text weight="bold" className="text-lg text-slate-900">{request.providerName}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-primary" />
                      <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                        Platform Hiring
                      </Text>
                    </View>
                  </View>
                </View>
                <View className={`px-4 py-2 rounded-2xl ${request.status === 'pending' ? 'bg-amber-50' : request.status === 'accepted' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  <Text weight="bold" className={`text-[10px] uppercase ${request.status === 'pending' ? 'text-amber-600' : request.status === 'accepted' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {request.status}
                  </Text>
                </View>
              </View>

              <View className="bg-slate-50 rounded-[32px] p-6 mb-8">
                <View className="mb-6 items-center">
                  <View className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center mb-4">
                    <ShieldCheck size={32} color="#4C6FFF" />
                  </View>
                  <Text weight="bold" className="text-slate-900 text-lg mb-1">Join Vesta Request</Text>
                  <Text className="text-slate-400 text-xs text-center mb-6 px-4">
                    Provider wants to join the platform. Verify their background to hire them.
                  </Text>
                  <View className="w-full h-[1px] bg-slate-100 mb-6" />
                  <View className="flex-row items-center gap-3">
                    <Briefcase size={16} color="#4C6FFF" />
                    <Text weight="bold" className="text-slate-900 text-sm">{request.experience}</Text>
                  </View>
                </View>

                <View className="bg-white p-5 rounded-2xl border border-slate-100">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Info size={14} color="#64748B" />
                    <Text weight="bold" className="text-slate-400 text-[10px] uppercase tracking-widest">Provider Bio / Notes</Text>
                  </View>
                  <Text className="text-slate-600 text-sm leading-6 italic">"{request.additionalInfo || 'No extra info provided'}"</Text>
                </View>
              </View>

              {request.status === 'pending' && (
                <View className="flex-row gap-4">
                  <TouchableOpacity 
                    onPress={() => handleVerify(request.id!, 'rejected')}
                    className="flex-1 h-16 bg-rose-50 rounded-2xl items-center justify-center flex-row gap-3"
                  >
                    <XCircle size={20} color="#E11D48" />
                    <Text weight="bold" className="text-rose-600 text-base">Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => handleVerify(request.id!, 'accepted')}
                    className="flex-1 h-16 bg-emerald-500 rounded-2xl items-center justify-center flex-row gap-3 shadow-lg shadow-emerald-200"
                  >
                    <CheckCircle2 size={20} color="white" />
                    <Text weight="bold" className="text-white text-base">Approve</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
