import { Tabs } from 'expo-router';
import { Home, Calendar, User } from 'lucide-react-native';
import { theme } from '../../src/utils/theme';

export default function CustomerTabsLayout() {
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
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
      <Tabs.Screen name="discovery" options={{ href: null }} />
      <Tabs.Screen name="provider-detail" options={{ href: null }} />
      <Tabs.Screen name="booking-creation" options={{ href: null }} />
    </Tabs>
  );
}
