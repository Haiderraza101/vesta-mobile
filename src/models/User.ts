export type UserRole = 'customer' | 'provider' | null;

export interface User {
  uid: string;
  fullName: string;
  email: string;
  role: UserRole;
  profileImageUrl: string | null;
  createdAt: any;
}

export interface ProviderMeta {
  uid: string;
  serviceType: 'Cleaning' | 'Electrical' | 'Plumbing' | string;
  isAvailable: boolean;
  rating: number;
  totalJobs: number;
}
