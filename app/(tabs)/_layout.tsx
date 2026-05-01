import React from "react";
import { Tabs, Redirect } from "expo-router";
import { CustomTabBar } from "../../components/ui/CustomTabBar";
import { useAuth } from "../../hooks/useAuth";

export default function TabLayout() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Redirect href="/(auth)/login" />;

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
