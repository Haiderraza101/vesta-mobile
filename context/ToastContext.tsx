import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Text } from '../components/ui/Text';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const getToastConfig = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          title: 'Success',
          color: '#10B981',
          icon: <CheckCircle2 size={24} color="#10B981" />
        };
      case 'error':
        return {
          title: 'Error',
          color: '#EF4444',
          icon: <AlertCircle size={24} color="#EF4444" />
        };
      case 'warning':
        return {
          title: 'Warning',
          color: '#F59E0B',
          icon: <AlertTriangle size={24} color="#F59E0B" />
        };
      case 'info':
      default:
        return {
          title: 'Info',
          color: '#3B82F6',
          icon: <Info size={24} color="#3B82F6" />
        };
    }
  };

  const hideToast = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [fadeAnim, slideAnim]);

  const showToast = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      hideToast();
    }, 4000);
  }, [fadeAnim, slideAnim, hideToast]);

  const config = getToastConfig(type);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {visible && (
        <Animated.View 
          style={[
            styles.toastWrapper, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View 
            className="bg-white flex-row items-center rounded-2xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100"
            style={{ minHeight: 80 }}
          >
            <View style={{ width: 6, height: '100%', backgroundColor: config.color }} />
            
            <View className="flex-1 flex-row items-center py-4 px-5">
              <View className="mr-4">
                {config.icon}
              </View>
              
              <View className="flex-1">
                <Text weight="bold" className="text-slate-900 text-[17px] mb-0.5">
                  {config.title}
                </Text>
                <Text className="text-slate-500 text-[13px] leading-5">
                  {message}
                </Text>
              </View>

              <TouchableOpacity 
                onPress={hideToast}
                className="ml-2 w-8 h-8 items-center justify-center rounded-full"
              >
                <X size={20} color="#94A3B8" strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
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
  toastWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    zIndex: 9999,
  }
});
