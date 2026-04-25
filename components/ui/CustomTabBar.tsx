import React from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Calendar, MessageSquare, User } from "lucide-react-native";
import { Text } from "./Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Math.max(insets.bottom, 20) }]}>
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
              case "index": return <Home size={size} color={color} />;
              case "bookings": return <Calendar size={size} color={color} />;
              case "categories": return <MessageSquare size={size} color={color} />;
              case "account": return <User size={size} color={color} />;
              default: return <Home size={size} color={color} />;
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
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderRadius: 35,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  tabItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
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
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconContainerActive: {
    backgroundColor: '#4C6FFF', // The theme blue
  },
  label: {
    color: '#0F172A',
    marginLeft: 10,
    fontSize: 14,
  },
});
