import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions, Platform, Modal } from 'react-native';
import { Text } from '../components/ui/Text';
import { CheckCircle, AlertCircle, Info, Check } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

type ToastType = 'success' | 'error' | 'info';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const [type, setType] = useState<ToastType>('info');
  const [visible, setVisible] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const successScale = useRef(new Animated.Value(0)).current;
  const successFade = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((msg: string, t: ToastType = 'info') => {
    setMessage(msg);
    setType(t);
    setVisible(true);

    if (t === 'success') {
      // Full screen success animation
      Animated.parallel([
        Animated.timing(successFade, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(successScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        hideSuccess();
      }, 2500);
    } else {
      // Pill style for info/error
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
        hidePill();
      }, 3000);
    }
  }, [fadeAnim, slideAnim, successScale, successFade]);

  const hidePill = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -20,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => setVisible(false));
  }, [fadeAnim, slideAnim]);

  const hideSuccess = useCallback(() => {
    Animated.timing(successFade, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
      successScale.setValue(0);
    });
  }, [successFade, successScale]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Pill Style (Info/Error) */}
      {visible && type !== 'success' && (
        <Animated.View 
          style={[
            styles.pillWrapper, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View className="bg-white/95 border border-slate-50 flex-row items-center px-5 py-4 rounded-[28px] shadow-2xl">
            <View className={`w-1 h-8 rounded-full mr-4 ${type === 'error' ? 'bg-rose-500' : 'bg-primary'}`} />
            <View className="mr-3">
              {type === 'error' ? <AlertCircle size={20} color="#F43F5E" /> : <Info size={20} color="#4C6FFF" />}
            </View>
            <Text weight="semibold" className="text-slate-900 text-[14px] flex-1 leading-5">
              {message}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Full Screen Success Overlay (Apple Style) */}
      <Modal visible={visible && type === 'success'} transparent animationType="none">
        <Animated.View 
          style={[styles.successOverlay, { opacity: successFade }]}
          className="bg-primary items-center justify-center"
        >
          <Animated.View style={{ transform: [{ scale: successScale }] }} className="items-center">
            <View className="w-32 h-32 bg-white/20 rounded-full items-center justify-center mb-8">
              <View className="w-24 h-24 bg-white rounded-full items-center justify-center">
                <Check size={56} color="#4C6FFF" strokeWidth={4} />
              </View>
            </View>
            <Text weight="bold" className="text-white text-3xl mb-4">Done!</Text>
            <Text weight="medium" className="text-white/80 text-lg text-center px-10 leading-6">
              {message}
            </Text>
          </Animated.View>
        </Animated.View>
      </Modal>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

const styles = StyleSheet.create({
  pillWrapper: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 24,
    right: 24,
    zIndex: 9999,
  },
  successOverlay: {
    flex: 1,
    width: width,
    height: height,
    zIndex: 10000,
  }
});
