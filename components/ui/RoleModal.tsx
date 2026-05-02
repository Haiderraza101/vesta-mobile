import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { ModalLayout } from './ModalLayout';
import { User, Briefcase, Shield, Check, Save } from 'lucide-react-native';
import { UserRole } from '../../services/userService';

interface RoleModalProps {
  visible: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onSelect: (role: UserRole) => void;
  userName: string;
  loading?: boolean;
}

export function RoleModal({ visible, onClose, currentRole, onSelect, userName, loading = false }: RoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>(currentRole);

  useEffect(() => {
    if (visible) {
      setSelectedRole(currentRole);
    }
  }, [visible, currentRole]);

  const roles: { label: string; value: UserRole; icon: any; color: string; bg: string }[] = [
    { label: 'Customer', value: 'customer', icon: User, color: '#64748B', bg: 'bg-slate-50' },
    { label: 'Service Provider', value: 'provider', icon: Briefcase, color: '#4C6FFF', bg: 'bg-primary/5' },
    { label: 'Administrator', value: 'admin', icon: Shield, color: '#F43F5E', bg: 'bg-rose-50' },
  ];

  return (
    <ModalLayout visible={visible} onClose={onClose} title="Change User Role">
      <View className="mb-6">
        <Text className="text-slate-500 mb-8 leading-6">
          Select the new access level for <Text weight="bold" className="text-slate-900">{userName}</Text>.
        </Text>

        <View className="gap-4 mb-10">
          {roles.map((role) => (
            <TouchableOpacity 
              key={role.value}
              onPress={() => setSelectedRole(role.value)}
              activeOpacity={0.7}
              className={`flex-row items-center p-5 rounded-[32px] border-2 transition-all ${
                selectedRole === role.value ? 'border-primary bg-primary/5' : 'border-slate-50 bg-white'
              }`}
            >
              <View className={`w-14 h-14 rounded-2xl items-center justify-center mr-4 ${role.bg}`}>
                <role.icon size={24} color={role.color} />
              </View>
              <View className="flex-1">
                <Text weight="bold" className="text-lg text-slate-900">{role.label}</Text>
                <Text className="text-slate-400 text-sm">Full access to {role.value} features</Text>
              </View>
              <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                selectedRole === role.value ? 'border-primary bg-primary' : 'border-slate-200'
              }`}>
                {selectedRole === role.value && <Check size={12} color="#FFF" strokeWidth={4} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Button 
          title="Update User Role"
          onPress={() => onSelect(selectedRole)}
          loading={loading}
          disabled={selectedRole === currentRole}
          size="lg"
          className="rounded-full h-16 shadow-lg shadow-primary/20"
          iconLeft={<Save size={20} color="#FFF" />}
        />
      </View>
    </ModalLayout>
  );
}
