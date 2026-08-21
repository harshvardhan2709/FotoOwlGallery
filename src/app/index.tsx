import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/home" />;
  }

  return <Redirect href="/login" />;
}