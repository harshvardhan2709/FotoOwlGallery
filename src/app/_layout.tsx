import '../global.css';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function RootLayout() {
  const { isAuthenticated, isLoading, loadSession } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login' || segments[0] === 'register';

    if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)/home');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#111111" />
      </View>
    );
  }

  return <Slot />;
}