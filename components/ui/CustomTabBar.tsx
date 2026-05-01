import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Calendar, LayoutGrid, User, MessageSquare } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 24) }]}>
      <View style={styles.tabBar}>
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
            
            switch (route.name) {
              case "index": return <Home size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
              case "bookings": return <Calendar size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
              case "categories": return <LayoutGrid size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
              case "account": return <User size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
              default: return <Home size={size} color={color} strokeWidth={isFocused ? 2.5 : 2} />;
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemActive
              ]}
              activeOpacity={0.7}
            >
              <Icon />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 24,
    right: 24,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    width: '100%',
    height: 80,
    backgroundColor: '#0F172A', // Dark Slate
    borderRadius: 40,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tabItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemActive: {
    backgroundColor: '#4C6FFF', // Primary Blue
    shadowColor: "#4C6FFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
