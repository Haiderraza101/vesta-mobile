import React from 'react';
import { View, Modal as RNModal, TouchableOpacity, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from './Text';
import { X } from 'lucide-react-native';

interface ModalLayoutProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ModalLayout({ visible, onClose, title, children }: ModalLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <RNModal
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
              className="bg-white w-full rounded-t-[48px] shadow-2xl"
              style={{ 
                maxHeight: '100%'
              }}
            >
              <View className="items-center py-5">
                <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
              </View>

              <View className="flex-row justify-between items-center px-8 mb-6">
                <Text weight="bold" className="text-2xl text-slate-900">{title}</Text>
                <TouchableOpacity 
                  onPress={onClose}
                  className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
                >
                  <X size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                showsVerticalScrollIndicator={false}
                className="px-8"
                contentContainerStyle={{ 
                  paddingBottom: Math.max(insets.bottom, 40) 
                }}
              >
                {children}
              </ScrollView>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
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
