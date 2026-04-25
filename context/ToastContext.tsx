import React, { createContext, useContext, useState, useCallback } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';
import { Text } from '../components/ui/Text';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  const showToast = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, []);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="#10B981" />;
      case 'error': return <AlertCircle size={18} color="#EF4444" />;
      case 'info': return <Info size={18} color="#3B82F6" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-100';
      case 'error': return 'bg-red-50 border-red-100';
      case 'info': return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {visible && (
        <Animated.View 
          style={[styles.toastContainer, { opacity: fadeAnim }]}
          className={`flex-row items-center p-4 rounded-2xl border shadow-sm ${getBgColor()}`}
        >
          {getIcon()}
          <Text weight="semibold" className="ml-3 text-slate-800 text-[13px] flex-1">
            {message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
  }
});
