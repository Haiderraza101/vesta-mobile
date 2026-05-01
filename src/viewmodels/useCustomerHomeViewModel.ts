import { useAuth } from '../context/AuthContext';
import { getGreeting } from '../utils/helpers';

export const useCustomerHomeViewModel = () => {
  const { user } = useAuth();

  const firstName = user?.fullName.split(' ')[0] || '';
  const greeting = getGreeting();

  const categories = [
    { id: 'Cleaning', name: 'Cleaning', icon: 'broom', color: '#E6FFFA', iconColor: '#319795' },
    { id: 'Electrical', name: 'Electrical', icon: 'zap', color: '#FEFCBF', iconColor: '#B45309' },
    { id: 'Plumbing', name: 'Plumbing', icon: 'wrench', color: '#EBF8FF', iconColor: '#2B6CB0' },
  ];

  return {
    firstName,
    greeting,
    categories,
    profileImageUrl: user?.profileImageUrl,
  };
};
