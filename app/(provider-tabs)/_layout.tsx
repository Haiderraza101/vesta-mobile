import { Tabs } from 'expo-router';
import { Briefcase, User } from 'lucide-react-native';
import { theme } from '../../src/utils/theme';

export default function ProviderTabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: theme.colors.secondary,
      tabBarInactiveTintColor: theme.colors.muted,
      tabBarStyle: {
        borderTopWidth: 0,
        elevation: 0,
        height: 70,
        paddingBottom: 15,
        paddingTop: 10,
        backgroundColor: 'white',
      },
      tabBarLabelStyle: {
        fontFamily: 'Poppins-Medium',
        fontSize: 10,
      }
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color, size }) => <Briefcase size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="active-job" options={{ href: null }} />
      <Tabs.Screen name="job-completed" options={{ href: null }} />
    </Tabs>
  );
}
