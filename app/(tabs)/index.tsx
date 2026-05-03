import React from 'react';
import { HomeTab } from '@/components/customer/HomeTab';
import { ProviderHomeTab } from '@/components/provider/ProviderHomeTab';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';

export default function HomeDashboard() {
  const { userProfile, loading } = useAuth();

  if (loading) return <LoadingState />;

  if (userProfile?.role === 'provider') {
    return <ProviderHomeTab />;
  }

  return <HomeTab />;
}
