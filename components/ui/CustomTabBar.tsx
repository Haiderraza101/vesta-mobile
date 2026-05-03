import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Calendar, LayoutGrid, User, Briefcase, ShoppingBag } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { Text } from "./Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { userProfile } = useAuth();
  const isProvider = userProfile?.role === 'provider';
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          if (!descriptor) return null;
          
          const { options } = descriptor;
          const isFocused = state.index === index;

          if ((options as any).href === null) return null;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

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

          const color = isFocused ? "#4C6FFF" : "#94A3B8";
          const size = 22;

          let icon;
          switch (route.name) {
            case "index": 
              icon = <Home size={size} color={color} />; break;
            case "bookings": 
              icon = isProvider ? <Briefcase size={size} color={color} /> : <Calendar size={size} color={color} />; break;
            case "categories": 
              icon = isProvider ? <ShoppingBag size={size} color={color} /> : <LayoutGrid size={size} color={color} />; break;
            case "account": 
              icon = <User size={size} color={color} />; break;
            default: 
              icon = <Home size={size} color={color} />;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                {icon}
              </View>
              <Text
                variant="caption"
                weight={isFocused ? "medium" : "normal"}
                style={[styles.label, { color }]}
              >
                {label as string}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  tabBar: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
  }
});
