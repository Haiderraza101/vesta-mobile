import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, BarChart3, LayoutGrid, User } from 'lucide-react-native';
import { Text } from '../ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type TabType = 'home' | 'analytics' | 'management' | 'profile';

interface AdminBottomTabsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export function AdminBottomTabs({ activeTab, onTabPress }: AdminBottomTabsProps) {
  const insets = useSafeAreaInsets();

  const TABS = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'analytics' as TabType, label: 'Stats', icon: BarChart3 },
    { id: 'management' as TabType, label: 'Manage', icon: LayoutGrid },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isFocused = activeTab === tab.id;
          const color = isFocused ? "#4C6FFF" : "#64748B";
          const Icon = tab.icon;

          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => onTabPress(tab.id)}
              activeOpacity={0.7}
              style={styles.tabItem}
            >
              <View style={styles.iconContainer}>
                <Icon size={22} color={color} />
              </View>
              <Text
                variant="caption"
                weight={isFocused ? "medium" : "normal"}
                style={[styles.label, { color }]}
              >
                {tab.label}
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
