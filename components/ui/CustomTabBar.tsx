import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Home, Calendar, LayoutGrid, User, Briefcase, ShoppingBag } from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";

const { width } = Dimensions.get('window');

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { userProfile } = useAuth();
  const isProvider = userProfile?.role === 'provider';

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const descriptor = descriptors[route.key];
          if (!descriptor) return null;
          
          const { options } = descriptor;
          const isFocused = state.index === index;

          if ((options as any).href === null) return null;

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

          const color = isFocused ? "#FFFFFF" : "#94A3B8";
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
              activeOpacity={0.8}
              style={[
                styles.tabItem,
                isFocused && styles.tabItemFocused
              ]}
            >
              {icon}
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
    left: 28,
    right: 28,
  },
  tabBar: {
    backgroundColor: '#0F172A', 
    height: 72, 
    borderRadius: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 10,
  },
  tabItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemFocused: {
    backgroundColor: '#4C6FFF', 
  }
});
