import React from 'react';
import { View, Modal, TouchableOpacity, Animated } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react-native';
import { cn } from '../../utils/utils';

interface DeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
  confirmText?: string;
}

export function DeleteModal({
  visible,
  onClose,
  onConfirm,
  title,
  description,
  loading = false,
  confirmText = "Delete"
}: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-900/40 items-center justify-center px-6">
        <View className="bg-white w-full rounded-[40px] p-8 shadow-2xl overflow-hidden relative">
          <TouchableOpacity 
            onPress={onClose}
            className="absolute right-6 top-6 w-10 h-10 items-center justify-center rounded-full bg-slate-50"
          >
            <X size={20} color="#64748B" />
          </TouchableOpacity>

          <View className="items-center mb-6">
            <View className="w-20 h-20 bg-rose-50 rounded-[30px] items-center justify-center mb-6">
              <AlertTriangle size={40} color="#F43F5E" />
            </View>
            <Text weight="bold" className="text-2xl text-slate-900 text-center mb-3">
              {title}
            </Text>
            <Text className="text-slate-500 text-center leading-6 text-base">
              {description}
            </Text>
          </View>

          <View className="flex-row gap-4">
            <View className="flex-1">
              <Button 
                title="Cancel" 
                variant="outline" 
                onPress={onClose}
                size="lg"
                className="rounded-3xl border-slate-100"
              />
            </View>
            <View className="flex-1">
              <Button 
                title={confirmText} 
                onPress={onConfirm}
                loading={loading}
                size="lg"
                className="rounded-3xl bg-rose-500 shadow-lg shadow-rose-200"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
