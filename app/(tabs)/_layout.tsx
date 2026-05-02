<<<<<<< Updated upstream
import React from "react";
import { Tabs } from "expo-router";
import { CustomTabBar } from "../../components/ui/CustomTabBar";

export default function TabLayout() {
=======
import { Tabs } from "expo-router";
import { Home, Search, Calendar, User, Briefcase } from "lucide-react-native";
import { Colors } from "../../src/constants/theme";
import { useAuth } from "../../context/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();
  const isProvider = user?.role === "provider";

>>>>>>> Stashed changes
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.blue600,
        tabBarInactiveTintColor: "#94A3B8",
        tabBarLabelStyle: {
          fontFamily: "Manrope-SemiBold",
          fontSize: 10,
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: Colors.surfaceContainerLowest,
          borderTopColor: "#E2E8F0",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
          elevation: 8,
          shadowColor: "#0F172A",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.04,
          shadowRadius: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isProvider ? "Dashboard" : "Home",
          tabBarIcon: ({ color, focused }) => <Home size={22} color={color} fill={focused ? color : "transparent"} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: isProvider ? "Jobs" : "Explore",
          tabBarIcon: ({ color, focused }) =>
            isProvider ? (
              <Briefcase size={22} color={color} fill={focused ? color : "transparent"} />
            ) : (
              <Search size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color, focused }) => <Calendar size={22} color={color} fill={focused ? color : "transparent"} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => <User size={22} color={color} fill={focused ? color : "transparent"} />,
        }}
      />
    </Tabs>
  );
}
