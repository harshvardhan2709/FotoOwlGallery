import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Header Card */}
          <View style={styles.avatarCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {getInitials(user?.fullName || 'User')}
              </Text>
            </View>

            <Text style={styles.userName}>{user?.fullName || 'User Name'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{favoritesCount}</Text>
                <Text style={styles.statLabel}>Favorites</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{user?.city || 'N/A'}</Text>
                <Text style={styles.statLabel}>Location</Text>
              </View>
            </View>
          </View>

          {/* User Details & Edit Form */}
          <View style={styles.detailsCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Profile Details</Text>
              {!isEditing && (
                <TouchableOpacity onPress={handleStartEditing} style={styles.editButton}>
                  <Ionicons name="create-outline" size={18} color="#111111" />
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditing ? (
              /* Editable Form */
              <View style={styles.formContainer}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={form.fullName}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, fullName: val }))}
                  placeholder="Enter full name"
                />

                <Text style={styles.label}>Gender</Text>
                <View style={styles.genderRow}>
                  {(['Male', 'Female', 'Other'] as Gender[]).map((g) => (
                    <Pressable
                      key={g}
                      style={styles.genderOption}
                      onPress={() => setForm((prev) => ({ ...prev, gender: g }))}
                    >
                      <View style={styles.radioOuter}>
                        {form.gender === g && <View style={styles.radioInner} />}
                      </View>
                      <Text style={styles.genderText}>{g}</Text>
                    </Pressable>
                  ))}
                </View>

                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  value={form.mobile}
                  onChangeText={(val) =>
                    setForm((prev) => ({ ...prev, mobile: val.replace(/[^0-9]/g, '') }))
                  }
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                  style={[styles.input, styles.multilineInput]}
                  value={form.address}
                  onChangeText={(val) => setForm((prev) => ({ ...prev, address: val }))}
                  multiline
                  numberOfLines={2}
                  placeholder="Enter address"
                />

                <Text style={styles.label}>City</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={form.city}
                    onValueChange={(val) => setForm((prev) => ({ ...prev, city: val }))}
                  >
                    {CITIES.map((c) => (
                      <Picker.Item key={c} label={c} value={c} />
                    ))}
                  </Picker>
                </View>

                <View style={styles.editActionRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                    disabled={isSaving}
                  >
                    <Text style={styles.saveText}>
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              /* Read-only List */
              <View style={styles.infoList}>
                <View style={styles.infoRow}>
                  <Ionicons name="mail-outline" size={20} color="#666" style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infoLabel}>Email</Text>
                    <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="call-outline" size={20} color="#666" style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infoLabel}>Mobile</Text>
                    <Text style={styles.infoValue}>{user?.mobile || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="person-outline" size={20} color="#666" style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infoLabel}>Gender</Text>
                    <Text style={styles.infoValue}>{user?.gender || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="location-outline" size={20} color="#666" style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infoLabel}>City</Text>
                    <Text style={styles.infoValue}>{user?.city || 'N/A'}</Text>
                  </View>
                </View>

                <View style={styles.infoRow}>
                  <Ionicons name="home-outline" size={20} color="#666" style={styles.infoIcon} />
                  <View>
                    <Text style={styles.infoLabel}>Address</Text>
                    <Text style={styles.infoValue}>{user?.address || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            )}
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#E53935" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#111111',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarInitials: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111111',
  },
  userEmail: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#EDF2F7',
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  statLabel: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111111',
  },
  infoList: {
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: {
    width: 24,
  },
  infoLabel: {
    fontSize: 12,
    color: '#718096',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A202C',
    marginTop: 2,
  },
  formContainer: {
    gap: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2D3748',
    marginTop: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#1A202C',
    backgroundColor: '#FFFFFF',
  },
  multilineInput: {
    height: 70,
    paddingTop: 10,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 16,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2D3748',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#111111',
  },
  genderText: {
    fontSize: 14,
    color: '#2D3748',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#CBD5E0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  editActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E0',
    alignItems: 'center',
  },
  cancelText: {
    color: '#4A5568',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#111111',
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEB2B2',
    paddingVertical: 14,
    borderRadius: 12,
  },
  logoutText: {
    color: '#E53935',
    fontSize: 15,
    fontWeight: '700',
  },
});