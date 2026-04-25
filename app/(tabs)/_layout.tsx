import React from "react";
import { Tabs } from "expo-router";
import { CustomTabBar } from "../../components/ui/CustomTabBar";

export default function TabLayout() {
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
