import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Calendar, LayoutGrid, User } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="absolute bottom-14 left-6 right-6">
      <View className="bg-slate-900 h-20 rounded-full flex-row items-center justify-around px-4 shadow-2xl shadow-slate-900/40 border border-white/5">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const Icon = () => {
            const color = isFocused ? "#FFFFFF" : "#64748B";
            const size = 22;
            const strokeWidth = isFocused ? 2.5 : 2;
            
            switch (route.name) {
              case "index": return <Home size={size} color={color} strokeWidth={strokeWidth} />;
              case "bookings": return <Calendar size={size} color={color} strokeWidth={strokeWidth} />;
              case "categories": return <LayoutGrid size={size} color={color} strokeWidth={strokeWidth} />;
              case "account": return <User size={size} color={color} strokeWidth={strokeWidth} />;
              default: return <Home size={size} color={color} strokeWidth={strokeWidth} />;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              className={`w-14 h-14 rounded-full items-center justify-center ${isFocused ? 'bg-primary shadow-lg shadow-primary/30' : ''}`}
            >
              <Icon />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
