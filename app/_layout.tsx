import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../src/context/AuthContext";
import { BookingProvider } from "../src/context/BookingContext";
import { ToastProvider } from "../context/ToastContext";
import Toast from 'react-native-toast-message';
import "../globals.css";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Poppins: Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
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
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <BookingProvider>
              <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="splash" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(customer-tabs)" />
                <Stack.Screen name="(provider-tabs)" />
              </Stack>
              <Toast />
            </BookingProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
