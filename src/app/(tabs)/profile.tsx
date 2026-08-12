import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/store/authStore';
import { useGalleryStore } from '@/store/galleryStore';
import { Gender, User } from '@/types/auth';

const CITIES = ['Pune', 'Mumbai', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad'];

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();
  const favoritesCount = useGalleryStore((state) => state.favorites.length);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<User>>({
    fullName: user?.fullName || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    city: user?.city || '',
    gender: user?.gender || 'Male',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleStartEditing = () => {
    setForm({
      fullName: user?.fullName || '',
      mobile: user?.mobile || '',
      address: user?.address || '',
      city: user?.city || '',
      gender: user?.gender || 'Male',
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!form.fullName?.trim()) {
      Alert.alert('Validation Error', 'Full name is required.');
      return;
    }
    if (!form.mobile?.trim() || !/^\d{10}$/.test(form.mobile)) {
      Alert.alert('Validation Error', 'Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!form.address?.trim()) {
      Alert.alert('Validation Error', 'Address is required.');
      return;
    }
    if (!form.city?.trim()) {
      Alert.alert('Validation Error', 'Please select a city.');
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({
        fullName: form.fullName.trim(),
        mobile: form.mobile.trim(),
        address: form.address.trim(),
        city: form.city,
        gender: form.gender,
      });
      setIsEditing(false);
      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Hero Card */}
          <View className="bg-slate-900 rounded-2xl p-5 items-center mb-4 shadow-md shadow-slate-900/10 relative overflow-hidden">
            <View className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 items-center justify-center mb-3">
              <Text className="text-white text-xl font-black">
                {getInitials(user?.fullName || 'User')}
              </Text>
            </View>

            <Text className="text-xl font-black text-white tracking-tight">{user?.fullName || 'User Name'}</Text>
            <Text className="text-sm font-medium text-slate-400 mt-0.5">{user?.email || 'user@example.com'}</Text>

            <View className="flex-row items-center mt-4 pt-3 border-t border-white/10 w-full">
              <View className="flex-1 items-center">
                <Text className="text-xl font-extrabold text-white">{favoritesCount}</Text>
                <Text className="text-xs font-semibold text-slate-400 mt-0.5">Favorites</Text>
              </View>
              <View className="w-px h-6 bg-white/20" />
              <View className="flex-1 items-center">
                <Text className="text-xl font-extrabold text-white">{user?.city || 'N/A'}</Text>
                <Text className="text-xs font-semibold text-slate-400 mt-0.5">City</Text>
              </View>
              <View className="w-px h-6 bg-white/20" />
              <View className="flex-1 items-center">
                <View className="flex-row items-center gap-1">
                  <View className="w-2 h-2 rounded-full bg-emerald-400 mr-1" />
                  <Text className="text-sm font-extrabold text-emerald-400">Active</Text>
                </View>
                <Text className="text-xs font-semibold text-slate-400 mt-0.5">Status</Text>
              </View>
            </View>
          </View>

          {/* User Details Card */}
          <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-200/80 shadow-sm">
            <View className="flex-row justify-between items-center mb-3 pb-2.5 border-b border-slate-100">
              <Text className="text-lg font-black text-slate-900">Personal Account Info</Text>
              {!isEditing && (
                <TouchableOpacity
                  onPress={handleStartEditing}
                  className="flex-row items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl"
                >
                  <Ionicons name="create-outline" size={16} color="#0F172A" />
                  <Text className="text-xs font-bold text-slate-900">Edit Profile</Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditing ? (
              /* Editable Form */
              <View className="gap-3">
                <Text className="text-sm font-bold text-slate-700">Full Name</Text>
                <TextInput
                  className="border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 bg-slate-50"
                  value={form.fullName}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, fullName: val }))}
                  placeholder="Enter full name"
                />

                <Text className="text-sm font-bold text-slate-700">Gender</Text>
                <View className="flex-row gap-3">
                  {(['Male', 'Female', 'Other'] as Gender[]).map((g) => {
                    const selected = form.gender === g;
                    return (
                      <Pressable
                        key={g}
                        className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-xl border ${
                          selected ? 'bg-slate-900 border-slate-900' : 'bg-slate-50 border-slate-200'
                        }`}
                        onPress={() => setForm((prev) => ({ ...prev, gender: g }))}
                      >
                        <Text className={`text-xs font-bold ${selected ? 'text-white' : 'text-slate-700'}`}>
                          {g}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <Text className="text-sm font-bold text-slate-700">Mobile Number</Text>
                <TextInput
                  className="border border-slate-200 rounded-xl px-3.5 py-3 text-sm font-medium text-slate-900 bg-slate-50"
                  value={form.mobile}
                  onChangeText={(val) =>
                    setForm((prev) => ({ ...prev, mobile: val.replace(/[^0-9]/g, '') }))
                  }
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                />

                <Text className="text-sm font-bold text-slate-700">Address</Text>
                <TextInput
                  className="border border-slate-200 rounded-xl px-3.5 py-3 h-22 text-sm font-medium text-slate-900 bg-slate-50"
                  style={{ textAlignVertical: 'top' }}
                  value={form.address}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, address: val }))}
                  multiline
                  numberOfLines={3}
                  placeholder="Enter address"
                />

                {/* City Selection */}
                <View className="flex-row justify-between items-center mt-1">
                  <Text className="text-sm font-bold text-slate-700">City</Text>
                  {form.city ? (
                    <View className="flex-row items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Ionicons name="checkmark-circle" size={13} color="#059669" />
                      <Text className="text-xs font-bold text-emerald-800">Selected: {form.city}</Text>
                    </View>
                  ) : null}
                </View>

                <View className="flex-row flex-wrap gap-2 mt-1">
                  {CITIES.map((c) => {
                    const isSelected = form.city === c;
                    return (
                      <TouchableOpacity
                        key={c}
                        className={`flex-row items-center gap-1.5 px-3 py-2 rounded-xl border ${
                          isSelected ? 'bg-slate-900 border-slate-900' : 'bg-slate-50 border-slate-200'
                        }`}
                        onPress={() => setForm((prev) => ({ ...prev, city: c }))}
                      >
                        <Ionicons
                          name={isSelected ? 'checkmark-circle' : 'location-outline'}
                          size={14}
                          color={isSelected ? '#FFFFFF' : '#64748B'}
                        />
                        <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                          {c}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <View className="flex-row gap-3 mt-5">
                  <TouchableOpacity
                    className="flex-1 py-3 rounded-xl border border-slate-300 items-center"
                    onPress={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <Text className="text-slate-700 text-sm font-bold">Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 py-3 rounded-xl bg-slate-900 items-center shadow-sm"
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text className="text-white text-sm font-bold">Save Changes</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Read-only Info List */
              <View className="gap-4">
                <View className="flex-row items-center gap-3.5">
                  <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                    <Ionicons name="mail-outline" size={18} color="#475569" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-400">Email Address</Text>
                    <Text className="text-base font-bold text-slate-900 mt-0.5">{user?.email || 'N/A'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3.5">
                  <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                    <Ionicons name="call-outline" size={18} color="#475569" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-400">Mobile Number</Text>
                    <Text className="text-base font-bold text-slate-900 mt-0.5">{user?.mobile || 'N/A'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3.5">
                  <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                    <Ionicons name="person-outline" size={18} color="#475569" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-400">Gender</Text>
                    <Text className="text-base font-bold text-slate-900 mt-0.5">{user?.gender || 'N/A'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3.5">
                  <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                    <Ionicons name="location-outline" size={18} color="#475569" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-400">City</Text>
                    <Text className="text-base font-bold text-slate-900 mt-0.5">{user?.city || 'N/A'}</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-3.5">
                  <View className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center">
                    <Ionicons name="home-outline" size={18} color="#475569" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-slate-400">Address</Text>
                    <Text className="text-base font-bold text-slate-900 mt-0.5">{user?.address || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity
            className="flex-row items-center justify-center gap-2 bg-red-50 border border-red-200/80 py-4 rounded-2xl shadow-sm"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
            <Text className="text-red-600 text-sm font-bold">Log Out of Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}