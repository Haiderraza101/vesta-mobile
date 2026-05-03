import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/Text';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { useAuth } from '@/context/AuthContext';
import { useConfig } from '@/context/ConfigContext';
import { bookingService, Booking } from '@/services/bookingService';
import { serviceService } from '@/services/serviceService';
import { Briefcase, Star, DollarSign, Clock, ChevronRight, LayoutGrid, Plus, ShieldCheck, UserCheck } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnalyticsGraph } from '@/components/ui/AnalyticsGraph';
import { useRouter } from 'expo-router';
import { ProfileSetupCard } from '@/components/ui/ProfileSetupCard';
import { ModalLayout } from '@/components/ui/ModalLayout';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/context/ToastContext';

export function ProviderHomeTab() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { settings } = useConfig();
  const { showToast } = useToast();
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isHiringModalOpen, setIsHiringModalOpen] = useState(false);
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hiringRequest, setHiringRequest] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = bookingService.subscribeToBookings(user.uid, 'provider', (data) => {
      setBookings(data);
      setLoading(false);
      setRefreshing(false);
    });

    const unsubHiring = serviceService.getProviderRequests((requests) => {
      const pending = requests.find(r => r.providerId === user.uid && r.type === 'hiring' && r.status === 'pending');
      setHiringRequest(pending);
    });

    return () => {
      unsubscribe && unsubscribe();
      unsubHiring && unsubHiring();
    };
  }, [user]);

  const stats = {
    totalJobs: bookings.filter(b => b.status === 'completed').length,
    activeJobs: bookings.filter(b => b.status === 'confirmed').length,
    pendingJobs: bookings.filter(b => b.status === 'pending').length,
    rating: (userProfile?.totalRatings && userProfile?.ratingSum) ? (userProfile.ratingSum / userProfile.totalRatings).toFixed(1) : '0.0',
    earnings: bookings.filter(b => b.status === 'completed').reduce((acc, b) => acc + (Number(b.price) || 0), 0)
  };

  const getDailyStats = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(today.getDate() - (6 - i));
      return {
        label: days[d.getDay()],
        dateStr: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        value: 0
      };
    });

    bookings.filter(b => b.status === 'completed').forEach(booking => {
      const dayIndex = last7Days.findIndex(d => d.dateStr === booking.date);
      if (dayIndex !== -1) {
        last7Days[dayIndex].value += Number(booking.price) || 0;
      }
    });

    return last7Days;
  };

  const dailyEarnings = getDailyStats();

  const handleApplyToJoin = async () => {
    if (!experience || !bio) {
      showToast("Please fill all fields", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      await serviceService.requestHiring(user!.uid, userProfile?.fullName || 'Anonymous Provider', experience, bio);
      showToast("Hiring application sent!", "success");
      setIsHiringModalOpen(false);
    } catch (error) {
      showToast("Failed to send application", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const isHired = userProfile?.isHired;

  return (
    <View className="flex-1 bg-slate-50">
      <SafeAreaView edges={['top']} className="bg-white shadow-sm z-10">
        <ScreenHeader 
          title={`Welcome, ${userProfile?.fullName?.split(' ')[0] || 'Provider'}`} 
          subtitle={userProfile?.location || 'Location N/A'}
        />
      </SafeAreaView>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View className="px-6 mt-6">
          <ProfileSetupCard userProfile={userProfile} role="provider" />
        </View>

        {!isHired ? (
          <View className="px-6 py-8">
            <LinearGradient
              colors={hiringRequest ? ['#F59E0B', '#D97706'] : ['#4C6FFF', '#3b5edb']}
              className="rounded-[40px] p-8 shadow-xl shadow-primary/20 items-center"
            >
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mb-6">
                {hiringRequest ? <Clock size={40} color="white" /> : <ShieldCheck size={40} color="white" />}
              </View>
              <Text weight="bold" className="text-white text-2xl text-center mb-2">
                {hiringRequest ? 'Application Pending' : 'Join Vesta Network'}
              </Text>
              <Text className="text-white/80 text-center mb-8 leading-5">
                {hiringRequest 
                  ? "We've received your application. Our team is currently reviewing your profile to ensure the best quality for our customers."
                  : 'Apply to become a verified Vesta provider. Once hired, you can offer services and start earning.'}
              </Text>
              {!hiringRequest && (
                <TouchableOpacity 
                  onPress={() => setIsHiringModalOpen(true)}
                  className="bg-white w-full h-16 rounded-2xl items-center justify-center"
                >
                  <Text weight="bold" className="text-primary text-base">Apply to Join Now</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </View>
        ) : (
          <View className="px-6 py-6">
            <LinearGradient
              colors={['#0F172A', '#1E293B']}
              className="rounded-[32px] p-6 shadow-xl shadow-slate-200"
            >
              <View className="flex-row justify-between items-center mb-6">
                <View>
                  <Text className="text-slate-400 text-xs mb-1 uppercase tracking-widest font-bold">Total Earnings</Text>
                  <Text weight="bold" className="text-white text-3xl">{settings.currencySymbol}{stats.earnings.toFixed(2)}</Text>
                </View>
                <View className="w-12 h-12 bg-white/10 rounded-2xl items-center justify-center">
                  <DollarSign size={24} color="white" />
                </View>
              </View>
              
              <View className="flex-row justify-between pt-6 border-t border-white/10">
                <View className="items-center">
                  <Text weight="bold" className="text-white text-lg">{stats.totalJobs}</Text>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold">Jobs Done</Text>
                </View>
                <View className="items-center">
                  <Text weight="bold" className="text-white text-lg">{stats.rating}</Text>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold">Rating</Text>
                </View>
                <View className="items-center">
                  <Text weight="bold" className="text-white text-lg">{stats.activeJobs}</Text>
                  <Text className="text-slate-400 text-[10px] uppercase font-bold">Active</Text>
                </View>
              </View>
            </LinearGradient>

            <View className="mt-6">
              <AnalyticsGraph 
                title="Earnings Overview" 
                data={dailyEarnings}
                color="#10B981"
              />
            </View>

            <View className="mt-10 mb-6 flex-row justify-between items-center">
              <Text weight="bold" className="text-xl text-slate-900">Recent Jobs</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/bookings')}>
                <Text weight="bold" className="text-primary text-sm">View All</Text>
              </TouchableOpacity>
            </View>

            {bookings.slice(0, 3).map((job) => (
              <TouchableOpacity 
                key={job.id}
                className="bg-white p-5 rounded-3xl mb-4 border border-slate-50 flex-row items-center"
                onPress={() => router.push('/(tabs)/bookings')}
              >
                <View className="w-12 h-12 bg-slate-50 rounded-2xl items-center justify-center">
                  <Briefcase size={20} color="#4C6FFF" />
                </View>
                <View className="flex-1 ml-4">
                  <Text weight="bold" className="text-slate-900 text-sm">{job.serviceName}</Text>
                  <Text className="text-slate-400 text-[10px]">{job.date} • {job.time}</Text>
                </View>
                <View className="bg-emerald-50 px-3 py-1 rounded-full">
                  <Text weight="bold" className="text-emerald-600 text-[10px]">{settings.currencySymbol}{job.price}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {isHired && (
        <TouchableOpacity 
          onPress={() => router.push('/provider/marketplace')}
          className="absolute bottom-32 right-6 w-16 h-16 bg-primary rounded-full items-center justify-center shadow-xl shadow-primary/40"
        >
          <Plus size={32} color="white" />
        </TouchableOpacity>
      )}

      <ModalLayout
        visible={isHiringModalOpen}
        onClose={() => setIsHiringModalOpen(false)}
        title="Apply for Platform"
      >
        <View className="pb-8">
          <Text className="text-slate-500 text-sm mb-6">
            Tell us about your professional background to join the Vesta network.
          </Text>

          <View className="mb-6">
            <Text weight="bold" className="text-slate-900 text-sm mb-2">Total Experience</Text>
            <TextInput 
              placeholder="e.g. 5 Years in Home Maintenance"
              className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-4 text-slate-900 text-sm font-medium"
              value={experience}
              onChangeText={setExperience}
            />
          </View>

          <View className="mb-8">
            <Text weight="bold" className="text-slate-900 text-sm mb-2">Professional Bio</Text>
            <TextInput 
              placeholder="Tell us about your expertise..."
              multiline
              numberOfLines={4}
              className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-4 text-slate-900 text-sm font-medium h-32"
              textAlignVertical="top"
              value={bio}
              onChangeText={setBio}
            />
          </View>

          <Button 
            title="Submit Application" 
            onPress={handleApplyToJoin}
            loading={isSubmitting}
            className="h-14 rounded-2xl bg-primary"
          />
        </View>
      </ModalLayout>
    </View>
  );
}
