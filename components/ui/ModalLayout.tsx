import React from 'react';
import { View, Modal as RNModal, TouchableOpacity, ScrollView, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from './Text';
import { X } from 'lucide-react-native';

interface ModalLayoutProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function ModalLayout({ visible, onClose, title, children }: ModalLayoutProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable 
          style={styles.overlay} 
          onPress={onClose}
        >
          <View 
            className="bg-white w-full rounded-t-[48px] shadow-2xl overflow-hidden"
            style={{ maxHeight: '90%' }}
          >
            {/* Grab Handle */}
            <View className="items-center py-5">
              <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </View>

            {/* Header */}
            <View className="flex-row justify-between items-center px-8 mb-6">
              <Text weight="bold" className="text-2xl text-slate-900">{title}</Text>
              <TouchableOpacity 
                onPress={onClose}
                className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView 
              showsVerticalScrollIndicator={false}
              className="px-8 pb-12"
              contentContainerStyle={{ paddingBottom: 40 }}
            >
              {children}
            </ScrollView>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
});
