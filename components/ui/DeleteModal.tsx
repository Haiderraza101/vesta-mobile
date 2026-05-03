import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Pressable, Dimensions } from 'react-native';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Trash2, X, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

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
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View 
          className="bg-white w-[90%] rounded-[40px] shadow-2xl overflow-hidden p-8"
        >
          <View className="flex-row justify-end absolute top-6 right-6 z-10">
            <TouchableOpacity 
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-slate-50"
            >
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="relative mb-8">
              <View className="w-24 h-24 bg-rose-50 rounded-[32px] items-center justify-center">
                <Trash2 size={42} color="#F43F5E" strokeWidth={1.5} />
              </View>
              <View className="absolute -top-1 -right-1 w-8 h-8 bg-rose-500 rounded-full border-4 border-white items-center justify-center">
                <AlertCircle size={14} color="white" />
              </View>
            </View>

            <Text weight="bold" className="text-2xl text-slate-900 text-center mb-3">
              {title}
            </Text>
            <Text className="text-slate-500 text-center leading-6 text-[15px] px-2 mb-10">
              {description}
            </Text>

            <View className="w-full gap-4">
              <Button 
                title={confirmText} 
                onPress={onConfirm}
                loading={loading}
                variant="destructive"
                className="h-14 rounded-2xl shadow-xl shadow-rose-200"
              />
              <Button 
                title="Cancel" 
                variant="ghost" 
                onPress={onClose}
                className="h-14 rounded-2xl"
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
});
