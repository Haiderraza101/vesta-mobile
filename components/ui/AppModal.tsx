import React from 'react';
import { Modal, View, TouchableOpacity, StyleSheet, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text } from './Text';
import { X } from 'lucide-react-native';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}

export function AppModal({ visible, onClose, title, children, height }: AppModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View 
          className="bg-white rounded-t-[40px] shadow-2xl w-full"
          style={{ maxHeight: '90%', minHeight: 200 }}
        >
          {/* Handle */}
          <View className="items-center py-4">
            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </View>

          {/* Header */}
          <View className="px-8 flex-row items-center justify-between mb-4">
            {title ? (
              <Text weight="bold" className="text-2xl text-slate-900">{title}</Text>
            ) : <View />}
            <TouchableOpacity 
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            className="px-8 pb-12" 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
});
