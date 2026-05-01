import React from "react";
import { Tabs, Redirect } from "expo-router";
import { CustomTabBar } from "../../components/ui/CustomTabBar";
import { useAuth } from "../../hooks/useAuth";

export default function TabLayout() {
  const { user, userProfile, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;
  
  // Admin Guard: Admins should not be in (tabs)
  if (userProfile?.role === 'admin') {
    return <Redirect href="/admin" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarLabel: "Booking",
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          tabBarLabel: "Chat",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tabs>
  );
}
