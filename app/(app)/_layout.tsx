import { useAuth } from '@/contexts/AuthContext';
import { router, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function AppLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="create-article" />
      <Stack.Screen name="article-result" />
      <Stack.Screen name="history" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
