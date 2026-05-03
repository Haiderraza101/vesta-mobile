import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { X } from 'lucide-react-native';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxHeight?: string | number;
}

export function AppModal({ visible, onClose, title, children, maxHeight = '90%' }: AppModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable 
          style={styles.overlay} 
          onPress={onClose}
        />
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className="w-full"
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View 
              className="bg-white w-full rounded-t-[48px] shadow-2xl overflow-hidden"
              style={{ 
                maxHeight: maxHeight as any,
                paddingBottom: Math.max(insets.bottom, 20)
              }}
            >
              <View className="items-center py-5">
                <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </View>

              {title && (
                <View className="flex-row justify-between items-center px-8 mb-6">
                  <Text weight="bold" className="text-2xl text-slate-900">{title}</Text>
                  <TouchableOpacity 
                    onPress={onClose}
                    className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
                  >
                    <X size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
              )}

              <ScrollView 
                showsVerticalScrollIndicator={false}
                className="px-8"
              >
                <View className="pb-10">
                  {children}
                </View>
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
});
