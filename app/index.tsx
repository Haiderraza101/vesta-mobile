import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import { useAuth } from "../context/AuthContext";

export default function Index() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#0051d5" />
      </View>
    );
  }

  // Not logged in → go to login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in but no role set yet → go to role selection
  if (!profile?.role) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  // Logged in with role → go to tabs
  return <Redirect href="/(tabs)" />;
}
