import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Image, Camera, X } from 'lucide-react-native';

interface ImageSourceModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (useCamera: boolean) => void;
}

export function ImageSourceModal({ visible, onClose, onSelect }: ImageSourceModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        activeOpacity={1} 
        onPress={onClose}
        className="flex-1 bg-slate-900/40 justify-end"
      >
        <View className="bg-white rounded-t-[40px] p-8 pb-12">
          <View className="flex-row justify-between items-center mb-8">
            <Text weight="bold" className="text-2xl text-slate-900">Select Source</Text>
            <TouchableOpacity onPress={onClose} className="bg-slate-50 p-2 rounded-full">
              <X size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-4">
            <TouchableOpacity 
              onPress={() => { onSelect(false); onClose(); }}
              className="flex-1 bg-slate-50 p-8 rounded-[32px] items-center border border-slate-100"
            >
              <View className="w-16 h-16 bg-primary/10 rounded-2xl items-center justify-center mb-4">
                <Image size={32} color="#4C6FFF" />
              </View>
              <Text weight="semibold" className="text-slate-900">Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => { onSelect(true); onClose(); }}
              className="flex-1 bg-slate-50 p-8 rounded-[32px] items-center border border-slate-100"
            >
              <View className="w-16 h-16 bg-slate-100 rounded-2xl items-center justify-center mb-4">
                <Camera size={32} color="#4C6FFF" />
              </View>
              <Text weight="semibold" className="text-slate-900">Camera</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
