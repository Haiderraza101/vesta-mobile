import { Platform } from 'react-native';

export const theme = {
  colors: {
    primary: '#0F172A', // Slate-900
    brand: '#2563EB',   // Blue-600
    secondary: '#64748B', // Slate-500
    accent: '#10B981',  // Emerald-500
    background: '#F8FAFC', // Slate-50
    foreground: '#0F172A',
    muted: '#94A3B8', // Slate-400
    border: '#E2E8F0', // Slate-200
    danger: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    info: '#3B82F6',
    white: '#FFFFFF',
    gray: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
    status: {
      pending: {
        bg: '#FEF3C7',
        text: '#D97706',
      },
      accepted: {
        bg: '#DBEAFE',
        text: '#2563EB',
      },
      completed: {
        bg: '#D1FAE5',
        text: '#059669',
      },
      cancelled: {
        bg: '#FEE2E2',
        text: '#DC2626',
      },
    },
  },
  typography: {
    fontFamily: 'Poppins',
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
    },
  },
  shadows: {
    sm: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
    md: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
    lg: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
};
