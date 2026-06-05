import { useEffect } from "react";
import { Stack, router, useSegments } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuthStore } from "../features/auth/auth.store";
import "../global.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const segments = useSegments();

  // Initialize session state on startup
  useEffect(() => {
    initializeAuth();
  }, []);

  // Auth guard: redirect only after auth state is resolved
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!isAuthenticated && !inAuthGroup) {
      // Unauthenticated users → Login
      router.replace("/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Logged-in users that somehow ended up on auth screens → Home
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, isLoading, segments]);

  // CRITICAL: Stack must ALWAYS render — never conditionally unmount it.
  // Conditional rendering of Stack destroys the navigation context mid-render
  // and causes "Couldn't find a navigation context" crashes in all children.
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
