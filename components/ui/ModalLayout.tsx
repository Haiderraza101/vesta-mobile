import React from 'react';
import { View, Modal as RNModal, TouchableOpacity, ScrollView } from 'react-native';
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
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-900/40 items-center justify-center px-6">
        <View className="bg-white w-full rounded-[40px] p-8 shadow-2xl overflow-hidden relative max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <Text weight="bold" className="text-2xl text-slate-900">{title}</Text>
            <TouchableOpacity 
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
            >
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
}
