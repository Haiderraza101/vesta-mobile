import { Platform } from 'react-native';

export const formatRelativeTime = (date: Date | any): string => {
  if (!date) return '';
  const now = new Date();
  const diff = now.getTime() - (date.toDate ? date.toDate().getTime() : new Date(date).getTime());

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
