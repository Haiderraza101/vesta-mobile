import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, StatusBar, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { useToast } from '@/context/ToastContext';
import { serviceService, ProviderRequest } from '@/services/serviceService';
import { ChevronLeft, XCircle, Briefcase, DollarSign, Info, ShieldCheck, Layers } from 'lucide-react-native';

export default function AdminServiceRequests() {
  const router = useRouter();
  const { showToast } = useToast();
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = serviceService.getProviderRequests((data) => {
      const serviceRequests = data.filter(r => r.type === 'service');
      setRequests(serviceRequests);
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
          <Text weight="bold" className="text-xl text-slate-900">Service Requests</Text>
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
              <Layers size={32} color="#94A3B8" />
            </View>
            <Text weight="bold" className="text-lg text-slate-900 mb-1">No pending services</Text>
            <Text className="text-slate-500 text-sm text-center px-10">
              Provider requests to add new marketplace services will appear here.
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
                  <View className="w-14 h-14 bg-emerald-50 rounded-2xl items-center justify-center overflow-hidden">
                    <Text weight="bold" className="text-emerald-600 text-xl">{(request.providerName || 'P').charAt(0)}</Text>
                  </View>
                  <View>
                    <Text weight="bold" className="text-lg text-slate-900">{request.providerName || 'Unknown Provider'}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className="w-2 h-2 rounded-full bg-emerald-500" />
                      <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">
                        New Service Request
                      </Text>
                    </View>
                  </View>
                </View>
                <View className="px-4 py-2 rounded-2xl bg-amber-50">
                  <Text weight="bold" className="text-[10px] uppercase text-amber-600">{request.status}</Text>
                </View>
              </View>

              <View className="bg-slate-50 rounded-3xl p-6 mb-8 border border-slate-100">
                <View className="flex-row items-center gap-4 mb-6">
                  <View className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm">
                    {request.image ? (
                      <Image source={{ uri: request.image }} className="w-full h-full rounded-xl" />
                    ) : (
                      <Briefcase size={24} color="#4C6FFF" />
                    )}
                  </View>
                  <View>
                    <Text weight="bold" className="text-slate-900 text-base">{request.serviceName}</Text>
                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">{request.category}</Text>
                  </View>
                </View>

                <View className="flex-row gap-3 mb-6">
                  <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Proposed Price</Text>
                    <View className="flex-row items-center gap-1">
                      <DollarSign size={14} color="#10B981" />
                      <Text weight="bold" className="text-slate-900 text-lg">{request.proposedPrice}</Text>
                    </View>
                  </View>
                  <View className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-50">
                    <Text className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-1">Experience</Text>
                    <Text weight="bold" className="text-slate-900 text-lg">{request.experience || 'N/A'}</Text>
                  </View>
                </View>

                <View className="bg-white p-5 rounded-2xl shadow-sm border border-slate-50">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Info size={14} color="#4C6FFF" />
                    <Text weight="bold" className="text-slate-800 text-xs uppercase tracking-widest">Description</Text>
                  </View>
                  <Text className="text-slate-500 text-sm leading-5">{request.additionalInfo || 'No additional details provided.'}</Text>
                </View>
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => handleVerify(request.id!, 'rejected')}
                  disabled={!!processingId}
                  className="flex-1 h-14 rounded-2xl border border-rose-100 items-center justify-center bg-rose-50/50"
                >
                  {processingId === request.id ? (
                    <ActivityIndicator color="#F43F5E" />
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <XCircle size={18} color="#F43F5E" />
                      <Text weight="bold" className="text-rose-600">Reject</Text>
                    </View>
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleVerify(request.id!, 'accepted')}
                  disabled={!!processingId}
                  className="flex-2 h-14 rounded-2xl bg-emerald-500 items-center justify-center shadow-lg shadow-emerald-200"
                >
                  {processingId === request.id ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <View className="flex-row items-center gap-2">
                      <ShieldCheck size={18} color="white" />
                      <Text weight="bold" className="text-white">Approve Service</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
