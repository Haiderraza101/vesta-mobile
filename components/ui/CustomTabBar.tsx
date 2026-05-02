import React from "react";
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Calendar, LayoutGrid, User } from "lucide-react-native";
import { Text } from "./Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 16) }]}>
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
            const color = isFocused ? "#FFFFFF" : "#94A3B8";
            const size = 20;
            
            switch (route.name) {
              case "index": return <Home size={size} color={color} strokeWidth={2.5} />;
              case "bookings": return <Calendar size={size} color={color} strokeWidth={2.5} />;
              case "categories": return <LayoutGrid size={size} color={color} strokeWidth={2.5} />;
              case "account": return <User size={size} color={color} strokeWidth={2.5} />;
              default: return <Home size={size} color={color} strokeWidth={2.5} />;
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
              activeOpacity={0.8}
            >
              <View style={[
                styles.iconContainer,
                isFocused && styles.iconContainerActive
              ]}>
                <Icon />
              </View>
              {isFocused && (
                <Text weight="bold" style={styles.label}>
                  {options.tabBarLabel as string}
                </Text>
              )}
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
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    height: 74,
    backgroundColor: '#FFFFFF',
    borderRadius: 37,
    paddingHorizontal: 8,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  tabItem: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    overflow: 'hidden',
  },
  tabItemActive: {
    flexDirection: 'row',
    width: 'auto',
    paddingRight: 20,
    paddingLeft: 4,
    backgroundColor: '#F0F5FF',
    borderRadius: 50,
  },
  iconContainer: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconContainerActive: {
    backgroundColor: '#4C6FFF',
  },
  label: {
    color: '#1E293B',
    marginLeft: 10,
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
