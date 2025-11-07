import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import "react-native-reanimated";

import PreLoader from "@/components/pre-loader";
import { AuthProvider } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AppRoute = "/" | "/select-categories";

export const unstable_settings = {
  anchor: "index",
};

const CATEGORIES_STORAGE_KEY = "user_selected_categories";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<AppRoute | null>(null);

  useEffect(() => {
    const checkCategoriesAndNavigate = async () => {
      try {
        setInitialRoute("/select-categories");
      } catch (error) {
        console.error("Failed to load categories from storage:", error);
        setInitialRoute("/select-categories"); // Fallback to selection page on error
      } finally {
        // Simulate pre-loader time, then set loading to false
        setTimeout(() => {
          setIsLoading(false);
        }, 3000);
      }
    };

    checkCategoriesAndNavigate();
  }, []);

  useEffect(() => {
    if (!isLoading && initialRoute) {
      router.replace(initialRoute);
    }
  }, [isLoading, initialRoute]);

  if (isLoading || !initialRoute) {
    return <PreLoader />;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="select-categories" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(app)" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}
