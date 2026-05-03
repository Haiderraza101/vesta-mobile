import React from 'react';
import { ExploreTab } from '@/components/customer/ExploreTab';
import { ProviderMarketplaceTab } from '@/components/provider/ProviderMarketplaceTab';
import { useAuth } from '@/context/AuthContext';
import { LoadingState } from '@/components/ui/LoadingState';

export default function CategoriesScreen() {
  const { userProfile, loading } = useAuth();

  if (loading) return <LoadingState />;

  if (userProfile?.role === 'provider') {
    return <ProviderMarketplaceTab />;
  }

  return <ExploreTab />;
}
