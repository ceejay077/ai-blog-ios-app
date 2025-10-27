import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, View } from "react-native";

export default function AppLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!loading && !user) {
      setTimeout(() => router.replace("/"), 0);
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerLeft: () =>
          router.canGoBack() ? (
            <Pressable onPress={() => router.back()}>
              {({ pressed }) => (
                <IconSymbol
                  name="chevron.backward"
                  size={28}
                  color={Colors[colorScheme ?? "light"].text}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ) : null,
      }}
    >
      <Stack.Screen
        name="create-article"
        options={{ title: "Create Article" }}
      />
      <Stack.Screen
        name="article-result"
        options={{ title: "Article Result" }}
      />
      <Stack.Screen
        name="generating-article"
        options={{ title: "Generating Article" }}
      />
      <Stack.Screen name="history" options={{ title: "History" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}
