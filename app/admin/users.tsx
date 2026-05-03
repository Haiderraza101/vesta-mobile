import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { RoleModal } from "@/components/ui/RoleModal";
import { LoadingState } from "@/components/ui/LoadingState";
import { EmptyState } from "@/components/ui/EmptyState";
import { usePagination } from "@/hooks/usePagination";
import { useSort } from "@/hooks/useSort";
import { useToast } from "@/context/ToastContext";
import { userService, UserProfile, UserRole } from "@/services/userService";
import { ArrowLeft, Search, User as UserIcon, ArrowUpDown } from "lucide-react-native";
import { UserListItem } from "@/components/admin/UserListItem";

export default function UserManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [roleUpdating, setRoleUpdating] = useState(false);

  const {
    data: users,
    loading,
    refreshing,
    loadInitialData,
    refresh,
    loadMore,
    loadingMore
  } = usePagination<UserProfile>({
    fetchData: (page, limit) => userService.getAllUsers(page, limit),
    limit: 10
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const filteredData = users.filter(u => 
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const { sortedData: filteredUsers, toggleSort, sortKey } = useSort<UserProfile>(
    filteredData,
    'fullName',
    'asc'
  );

  const handleRoleUpdate = async (newRole: UserRole) => {
    if (!selectedUser) return;
    setRoleUpdating(true);
    try {
      await userService.updateUserRole(selectedUser.uid, newRole);
      showToast("User role updated", "success");
      setSelectedUser(null);
      refresh();
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setRoleUpdating(false);
    }
  };

  if (loading) return <LoadingState message="Fetching users..." />;

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

        <View className="flex-row items-center gap-4 mb-8">
          <View className="flex-1 flex-row items-center bg-slate-50 rounded-2xl px-5 h-[56px] border border-slate-100">
            <Search size={20} color="#94A3B8" />
            <Input 
              placeholder="Search users..." 
              className="flex-1 mb-0 border-0 h-[56px]"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity 
            onPress={() => toggleSort('fullName')}
            className="h-[56px] w-[56px] items-center justify-center bg-slate-50 rounded-2xl border border-slate-100"
          >
            <ArrowUpDown size={20} color={sortKey === 'fullName' ? "#4C6FFF" : "#94A3B8"} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} colors={['#4C6FFF']} />
          }
          onScroll={({ nativeEvent }) => {
            const isCloseToBottom = nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >= nativeEvent.contentSize.height - 50;
            if (isCloseToBottom) loadMore();
          }}
          scrollEventThrottle={400}
        >
          {filteredUsers.length === 0 ? (
            <EmptyState 
              title="No users found"
              description={searchQuery ? `We couldn't find anyone matching "${searchQuery}"` : "No users registered yet."}
              icon={UserIcon}
            />
          ) : (
            <View className="gap-4 pb-10">
              {filteredUsers.map((u) => (
                <UserListItem 
                  key={u.uid} 
                  user={u} 
                  onPress={setSelectedUser} 
                />
              ))}
              {loadingMore && <ActivityIndicator size="small" color="#4C6FFF" className="py-4" />}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
