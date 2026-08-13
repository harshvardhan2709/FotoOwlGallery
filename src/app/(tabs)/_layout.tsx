import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="dark" />
      <Tabs
        backBehavior="firstRoute"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#0F172A',
          tabBarInactiveTintColor: '#94A3B8',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
            height: Platform.OS === 'ios' ? 88 : 64,
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'ios' ? 28 : 10),
            paddingTop: 1,
            elevation: 1,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -3 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '700',
            marginTop: 2,
            marginBottom: 2,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Gallery',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'images-sharp' : 'images-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="favorites"
          options={{
            title: 'Favorites',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'heart-sharp' : 'heart-outline'}
                size={22}
                color={focused ? '#E53935' : color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'person-sharp' : 'person-outline'}
                size={22}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}