import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputField } from '@/components';
import { storage } from '@/services/storage';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      const success = await login(email.trim(), password);

      if (!success) {
        setErrorMessage('Invalid email or password. Please check your credentials.');
        return;
      }

      router.replace('/(tabs)/home');
    } catch {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoAccount = async () => {
    setErrorMessage(null);
    const registeredUser = await storage.getUser();

    if (registeredUser) {
      setEmail(registeredUser.email);
      setPassword(registeredUser.password);
    } else {
      setEmail('demo@fotoowl.ai');
      setPassword('password123');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 32, flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / Brand Header */}
          <View className="items-center mb-6">
            <View className="w-14 h-14 rounded-2xl bg-black items-center justify-center mb-3 shadow-lg shadow-black/20">
              <Ionicons name="images-sharp" size={28} color="#FFFFFF" />
            </View>
            <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">FotoOwl</Text>
            <Text className="text-sm text-gray-500 text-center mt-1">
              Sign in to access your gallery
            </Text>
          </View>

          {/* Inline Error Banner */}
          {errorMessage && (
            <View className="flex-row items-center bg-red-50 border border-red-200 rounded-xl p-3 mb-4 gap-2.5">
              <Ionicons name="alert-circle" size={20} color="#E53935" />
              <Text className="text-red-700 text-sm font-medium flex-1">{errorMessage}</Text>
            </View>
          )}

          {/* Form Fields */}
          <View className="mb-4">
            <InputField
              label="Email Address"
              value={email}
              onChangeText={(val) => {
                setEmail(val);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="name@example.com"
              iconName="mail-outline"
              keyboardType="email-address"
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={(val) => {
                setPassword(val);
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Enter your password"
              iconName="lock-closed-outline"
              isPassword
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            className={`h-13 rounded-xl bg-black items-center justify-center mt-6 shadow-md shadow-black/10 ${isSubmitting ? 'opacity-60' : ''
              }`}
            onPress={handleLogin}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-white text-base font-bold">Sign In</Text>
            )}
          </TouchableOpacity>

          {/* Quick Demo Credentials Action */}
          <TouchableOpacity className="flex-row items-center justify-center mt-3.5 py-2 gap-1.5" onPress={fillDemoAccount}>
            <Ionicons name="flash-outline" size={16} color="#4A5568" />
            <Text className="text-gray-600 text-sm font-semibold">Auto-fill Credentials</Text>
          </TouchableOpacity>

          {/* Registration Link Footer */}
          <View className="items-center gap-1.5">
            <Text className="text-sm text-gray-500">Don&apos;t have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-base font-bold text-black">Create an Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}