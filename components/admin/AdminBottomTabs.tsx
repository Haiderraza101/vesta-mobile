import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Home, BarChart3, LayoutGrid, User } from 'lucide-react-native';

export type TabType = 'home' | 'analytics' | 'management' | 'profile';

interface AdminBottomTabsProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

export function AdminBottomTabs({ activeTab, onTabPress }: AdminBottomTabsProps) {
  return (
    <View className="absolute bottom-14 left-6 right-6">
      <View className="bg-slate-900 h-20 rounded-full flex-row items-center justify-around px-4 shadow-2xl shadow-slate-900/40 border border-white/5">
        <TouchableOpacity 
          onPress={() => onTabPress('home')}
          className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'home' ? 'bg-primary' : 'transparent'}`}
        >
          <Home size={22} color={activeTab === 'home' ? "white" : "#64748B"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onTabPress('analytics')}
          className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'analytics' ? 'bg-primary' : 'transparent'}`}
        >
          <BarChart3 size={22} color={activeTab === 'analytics' ? "white" : "#64748B"} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => onTabPress('management')}
          className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'management' ? 'bg-primary' : 'transparent'}`}
        >
          <LayoutGrid size={22} color={activeTab === 'management' ? "white" : "#64748B"} />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => onTabPress('profile')}
          className={`w-14 h-14 rounded-full items-center justify-center ${activeTab === 'profile' ? 'bg-primary' : 'transparent'}`}
        >
          <User size={22} color={activeTab === 'profile' ? "white" : "#64748B"} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
