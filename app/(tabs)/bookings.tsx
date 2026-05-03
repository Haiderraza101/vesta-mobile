import React from 'react';
import { BookingsTab } from '@/components/customer/BookingsTab';
import { ProviderJobsTab } from '@/components/provider/ProviderJobsTab';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';

export default function BookingsScreen() {
  const { userProfile, loading } = useAuth();

  if (loading) return <LoadingState />;

  if (userProfile?.role === 'provider') {
    return <ProviderJobsTab />;
  }

  return <BookingsTab />;
}
