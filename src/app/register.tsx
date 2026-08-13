import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { Gender, RegistrationData } from '@/types/auth';
import { validateRegistration } from '@/utils/validation';
import { InputField } from '@/components';

const CITIES = ['Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad'];

const initialForm: RegistrationData = {
  fullName: '',
  email: '',
  gender: 'Male',
  mobile: '',
  address: '',
  city: 'Pune',
  password: '',
  confirmPassword: '',
};

export default function RegisterScreen() {
  const register = useAuthStore((state) => state.register);

  const [form, setForm] = useState<RegistrationData>(initialForm);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const onBackPress = () => {
      if (router.canGoBack()) {
        router.back();
        return true;
      }
      router.replace('/login');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, []);

  const updateField = <K extends keyof RegistrationData>(
    field: K,
    value: RegistrationData[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleRegister = async () => {
    setErrorMessage(null);
    const validationError = validateRegistration(form);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      await register({
        fullName: form.fullName.trim(),
        email: form.email.trim().toLowerCase(),
        gender: form.gender,
        mobile: form.mobile,
        address: form.address.trim(),
        city: form.city,
        password: form.password,
      });

      Alert.alert(
        'Account Created!',
        'Your registration was successful. Please log in to continue.',
        [
          {
            text: 'Sign In Now',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch {
      setErrorMessage('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const passwordsMatch =
    form.confirmPassword.length > 0 && form.password === form.confirmPassword;
  const passwordsMismatch =
    form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar with Back Action */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#111111" />
            </TouchableOpacity>
            <Text className="text-base font-bold text-gray-900">Register</Text>
            <View style={{ width: 40 }} />
          </View>

          <View className="mb-4">
            <Text className="text-2xl font-extrabold text-gray-900 tracking-tight">Join FotoOwl</Text>
            <Text className="text-sm text-gray-500 mt-1">Create your account to get started</Text>
          </View>

          {/* Inline Error Banner */}
          {errorMessage && (
            <View className="flex-row items-center bg-red-50 border border-red-200 rounded-xl p-3 mb-4 gap-2.5">
              <Ionicons name="alert-circle" size={20} color="#E53935" />
              <Text className="text-red-700 text-sm font-medium flex-1">{errorMessage}</Text>
            </View>
          )}

          {/* Registration Form */}
          <View className="gap-1">
            <InputField
              label="Full Name"
              value={form.fullName}
              onChangeText={(val) => updateField('fullName', val)}
              placeholder="Raj Sharma"
              iconName="person-outline"
            />

            <InputField
              label="Email Address"
              value={form.email}
              onChangeText={(val) => updateField('email', val)}
              placeholder="name@example.com"
              iconName="mail-outline"
              keyboardType="email-address"
            />

            {/* Gender Selection */}
            <Text className="text-sm font-bold text-gray-700 mb-1.5 mt-1">Gender</Text>
            <View className="flex-row gap-2.5 mb-2">
              {(['Male', 'Female', 'Other'] as Gender[]).map((option) => {
                const selected = form.gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    className={`flex-1 flex-row items-center justify-center gap-1.5 py-3 rounded-xl border ${
                      selected ? 'bg-black border-black' : 'bg-slate-50 border-gray-200'
                    }`}
                    onPress={() => updateField('gender', option)}
                  >
                    <Ionicons
                      name={
                        option === 'Male'
                          ? 'male-outline'
                          : option === 'Female'
                          ? 'female-outline'
                          : 'transgender-outline'
                      }
                      size={18}
                      color={selected ? '#FFFFFF' : '#4A5568'}
                    />
                    <Text className={`text-sm font-semibold ${selected ? 'text-white' : 'text-gray-600'}`}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <InputField
              label="Mobile Number"
              value={form.mobile}
              onChangeText={(val) => updateField('mobile', val.replace(/[^0-9]/g, ''))}
              placeholder="10-digit mobile number"
              iconName="call-outline"
              keyboardType="number-pad"
              maxLength={10}
            />

            <InputField
              label="Address"
              value={form.address}
              onChangeText={(val) => updateField('address', val)}
              placeholder="Enter street address"
              iconName="home-outline"
              multiline
              numberOfLines={3}
            />

            {/* City Field - Dropdown/Toggle Buttons */}
            <View className="flex-row justify-between items-center mt-1 mb-1.5">
              <Text className="text-sm font-bold text-gray-700">City</Text>
              {form.city ? (
                <View className="flex-row items-center gap-1 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                  <Ionicons name="checkmark-circle" size={14} color="#38A169" />
                  <Text className="text-xs font-bold text-green-800">Selected: {form.city}</Text>
                </View>
              ) : null}
            </View>

            <View className="flex-row flex-wrap gap-2 mb-2">
              {CITIES.map((city) => {
                const isSelected = form.city === city;
                return (
                  <TouchableOpacity
                    key={city}
                    className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                      isSelected ? 'bg-black border-black' : 'bg-slate-50 border-gray-200'
                    }`}
                    onPress={() => updateField('city', city)}
                  >
                    <Ionicons
                      name={isSelected ? 'checkmark-circle' : 'location-outline'}
                      size={15}
                      color={isSelected ? '#FFFFFF' : '#4A5568'}
                    />
                    <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                      {city}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <InputField
              label="Password"
              value={form.password}
              onChangeText={(val) => updateField('password', val)}
              placeholder="Minimum 6 characters"
              iconName="lock-closed-outline"
              isPassword
            />

            <InputField
              label="Confirm Password"
              value={form.confirmPassword}
              onChangeText={(val) => updateField('confirmPassword', val)}
              placeholder="Re-enter password"
              iconName="shield-checkmark-outline"
              isPassword
              error={passwordsMismatch ? 'Passwords do not match' : null}
            />

            {/* Password Match Status */}
            {passwordsMatch && (
              <View className="flex-row items-center gap-1.5 mt-1.5 pl-1">
                <Ionicons name="checkmark-circle" size={16} color="#38A169" />
                <Text className="text-sm font-semibold text-green-600">Passwords match</Text>
              </View>
            )}
            {passwordsMismatch && (
              <View className="flex-row items-center gap-1.5 mt-1.5 pl-1">
                <Ionicons name="close-circle" size={16} color="#E53935" />
                <Text className="text-sm font-semibold text-red-600">Passwords do not match</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              className={`h-13 rounded-xl bg-black items-center justify-center mt-6 shadow-md shadow-black/10 ${
                isSubmitting ? 'opacity-60' : ''
              }`}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              className="items-center mt-4.5"
              onPress={() => router.replace('/login')}
            >
              <Text className="text-sm text-gray-500">
                Already have an account? <Text className="text-black font-bold">Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}