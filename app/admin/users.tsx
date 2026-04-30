import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "../../components/ui/Text";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { RoleModal } from "../../components/ui/RoleModal";
import { useToast } from "../../context/ToastContext";
import { userService, UserProfile, UserRole } from "../../services/userService";
import { ArrowLeft, Search, User, Briefcase, Shield, ChevronRight, Mail, Phone, Calendar } from "lucide-react-native";

export default function UserManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [roleUpdating, setRoleUpdating] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      showToast("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleUpdate = async (newRole: UserRole) => {
    if (!selectedUser) return;
    setRoleUpdating(true);
    try {
      await userService.updateUserRole(selectedUser.uid, newRole);
      showToast("User role updated", "success");
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setRoleUpdating(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4C6FFF" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <RoleModal 
        visible={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        userName={selectedUser?.fullName || "User"}
        currentRole={selectedUser?.role || "customer"}
        onSelect={handleRoleUpdate}
        loading={roleUpdating}
      />
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row items-center gap-4 mb-8">
          <TouchableOpacity onPress={() => router.back()} className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl">
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text weight="bold" className="text-xl text-slate-900">User Management</Text>
        </View>

        <View className="flex-row items-center bg-slate-50 rounded-2xl px-5 h-[56px] mb-8 border border-slate-100">
          <Search size={20} color="#94A3B8" />
          <Input 
            placeholder="Search by name or email..." 
            className="flex-1 mb-0 border-0 h-[56px]"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="pb-20">
          <View className="gap-4 pb-10">
            {filteredUsers.map((u) => (
              <TouchableOpacity 
                key={u.uid} 
                activeOpacity={0.7}
                onPress={() => setSelectedUser(u)}
                className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm flex-row items-center gap-5"
              >
                <View className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  u.role === 'admin' ? 'bg-rose-50' : u.role === 'provider' ? 'bg-primary/5' : 'bg-slate-50'
                }`}>
                  {u.role === 'admin' ? <Shield size={24} color="#F43F5E" /> : 
                   u.role === 'provider' ? <Briefcase size={24} color="#4C6FFF" /> : 
                   <User size={24} color="#64748B" />}
                </View>
                <View className="flex-1">
                  <Text weight="bold" className="text-lg text-slate-900 mb-0.5">{u.fullName}</Text>
                  <View className="flex-row items-center gap-2">
                    <Mail size={12} color="#94A3B8" />
                    <Text className="text-slate-400 text-xs">{u.email}</Text>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <View className={`px-2 py-0.5 rounded-full ${
                      u.role === 'admin' ? 'bg-rose-50' : u.role === 'provider' ? 'bg-primary/5' : 'bg-slate-50'
                    }`}>
                      <Text weight="bold" className={`text-[10px] uppercase tracking-widest ${
                        u.role === 'admin' ? 'text-rose-500' : u.role === 'provider' ? 'text-primary' : 'text-slate-500'
                      }`}>{u.role}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={18} color="#CBD5E1" strokeWidth={3} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
