import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { AlertTriangle, X } from 'lucide-react-native';

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
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View 
          className="bg-white w-full rounded-t-[48px] shadow-2xl overflow-hidden"
          style={{ maxHeight: '80%' }}
        >
          {/* Grab Handle */}
          <View className="items-center py-5">
            <View className="w-12 h-1.5 bg-slate-200 rounded-full" />
          </View>

          <View className="px-8 pb-12">
            <View className="flex-row justify-end mb-2">
              <TouchableOpacity 
                onPress={onClose}
                className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
              >
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-rose-50 rounded-[30px] items-center justify-center mb-6">
                <AlertTriangle size={40} color="#F43F5E" />
              </View>
              <Text weight="bold" className="text-2xl text-slate-900 text-center mb-3">
                {title}
              </Text>
              <Text className="text-slate-500 text-center leading-6 text-base px-4">
                {description}
              </Text>
            </View>

            <View className="flex-row gap-4 mt-2">
              <View className="flex-1">
                <Button 
                  title="Cancel" 
                  variant="outline" 
                  onPress={onClose}
                  size="lg"
                  className="rounded-3xl border-slate-100 h-14"
                />
              </View>
              <View className="flex-1">
                <Button 
                  title={confirmText} 
                  onPress={onConfirm}
                  loading={loading}
                  size="lg"
                  className="rounded-3xl bg-rose-500 shadow-lg shadow-rose-200 h-14"
                />
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
});
