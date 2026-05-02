import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from "@expo-google-fonts/manrope";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Colors } from "../src/constants/theme";
import "../globals.css";

SplashScreen.preventAutoHideAsync();

/** Inner component that handles auth-aware navigation */
function RootNavigator() {
  const { isAuthenticated, profile, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Still checking auth state

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Not logged in and not on auth screen → redirect to login
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Logged in but on auth screen → check if role is set
      if (profile?.role) {
        router.replace("/(tabs)");
      } else {
        // Role not set yet → go to role selection
        router.replace("/(auth)/role-selection");
      }
    }
  }, [isAuthenticated, loading, profile?.role, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.secondary} />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
      <Stack.Screen name="provider-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="book-service" options={{ animation: "slide_from_bottom", presentation: "modal" }} />
      <Stack.Screen name="edit-profile" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="provider-dashboard" options={{ animation: "fade" }} />
      <Stack.Screen name="job-detail" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="active-job" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="job-completed" options={{ animation: "fade" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Inter: Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    Manrope: Manrope_600SemiBold,
    "Manrope-SemiBold": Manrope_600SemiBold,
    "Manrope-Bold": Manrope_700Bold,
    "Manrope-ExtraBold": Manrope_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
