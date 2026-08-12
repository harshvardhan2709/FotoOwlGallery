import React, { useState } from 'react';
import {
  ActivityIndicator,
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
import { Gender, RegistrationData } from '@/types/auth';
import { validateRegistration } from '@/utils/validation';

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        'Account Created! 🎉',
        'Your registration was successful. Please log in to continue.',
        [
          {
            text: 'Sign In Now',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch (error) {
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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Bar with Back Action */}
          <View style={styles.headerBar}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#111111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Register</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.titleSection}>
            <Text style={styles.title}>Join FotoOwl</Text>
            <Text style={styles.subtitle}>Create your account to start exploring gallery photos</Text>
          </View>

          {/* Inline Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={20} color="#E53935" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Registration Form */}
          <View style={styles.form}>
            {/* Full Name Field */}
            <Text style={styles.inputLabel}>Full Name</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedInput === 'fullName' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons name="person-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="John Doe"
                placeholderTextColor="#A0AEC0"
                value={form.fullName}
                onChangeText={(val) => updateField('fullName', val)}
                onFocus={() => setFocusedInput('fullName')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Email Field */}
            <Text style={styles.inputLabel}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedInput === 'email' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons name="mail-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="name@example.com"
                placeholderTextColor="#A0AEC0"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={form.email}
                onChangeText={(val) => updateField('email', val)}
                onFocus={() => setFocusedInput('email')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* Gender Selection */}
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.genderRow}>
              {(['Male', 'Female', 'Other'] as Gender[]).map((option) => {
                const selected = form.gender === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.genderCard, selected && styles.genderCardActive]}
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
                    <Text style={[styles.genderText, selected && styles.genderTextActive]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Mobile Number Field */}
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedInput === 'mobile' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons name="call-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="10-digit mobile number"
                placeholderTextColor="#A0AEC0"
                keyboardType="number-pad"
                maxLength={10}
                value={form.mobile}
                onChangeText={(val) => updateField('mobile', val.replace(/[^0-9]/g, ''))}
                onFocus={() => setFocusedInput('mobile')}
                onBlur={() => setFocusedInput(null)}
              />
              {form.mobile.length === 10 && (
                <Ionicons name="checkmark-circle" size={20} color="#38A169" />
              )}
            </View>

            {/* Address Field */}
            <Text style={styles.inputLabel}>Address</Text>
            <View
              style={[
                styles.inputWrapper,
                styles.multilineWrapper,
                focusedInput === 'address' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons name="home-outline" size={20} color="#718096" style={styles.inputIconTop} />
              <TextInput
                style={[styles.textInput, styles.multilineInput]}
                placeholder="Enter street address"
                placeholderTextColor="#A0AEC0"
                multiline
                numberOfLines={2}
                value={form.address}
                onChangeText={(val) => updateField('address', val)}
                onFocus={() => setFocusedInput('address')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>

            {/* City Field */}
            <Text style={styles.inputLabel}>City</Text>
            <View style={styles.pickerWrapper}>
              <Ionicons name="location-outline" size={20} color="#718096" style={styles.pickerIcon} />
              <View style={{ flex: 1 }}>
                <Picker
                  selectedValue={form.city}
                  onValueChange={(val) => updateField('city', val)}
                  dropdownIconColor="#111111"
                >
                  {CITIES.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Password Field */}
            <Text style={styles.inputLabel}>Password</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedInput === 'password' && styles.inputWrapperFocused,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Minimum 6 characters"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showPassword}
                value={form.password}
                onChangeText={(val) => updateField('password', val)}
                onFocus={() => setFocusedInput('password')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#718096"
                />
              </TouchableOpacity>
            </View>

            {/* Confirm Password Field */}
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View
              style={[
                styles.inputWrapper,
                focusedInput === 'confirmPassword' && styles.inputWrapperFocused,
                passwordsMismatch && styles.inputWrapperError,
              ]}
            >
              <Ionicons name="shield-checkmark-outline" size={20} color="#718096" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Re-enter password"
                placeholderTextColor="#A0AEC0"
                secureTextEntry={!showConfirmPassword}
                value={form.confirmPassword}
                onChangeText={(val) => updateField('confirmPassword', val)}
                onFocus={() => setFocusedInput('confirmPassword')}
                onBlur={() => setFocusedInput(null)}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword((prev) => !prev)}>
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color="#718096"
                />
              </TouchableOpacity>
            </View>

            {/* Password Match Status */}
            {passwordsMatch && (
              <View style={styles.matchHintRow}>
                <Ionicons name="checkmark-circle" size={16} color="#38A169" />
                <Text style={styles.matchHintText}>Passwords match</Text>
              </View>
            )}
            {passwordsMismatch && (
              <View style={styles.matchHintRow}>
                <Ionicons name="close-circle" size={16} color="#E53935" />
                <Text style={styles.mismatchHintText}>Passwords do not match</Text>
              </View>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.registerButton, isSubmitting && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.registerButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.replace('/login')}
            >
              <Text style={styles.loginText}>
                Already have an account? <Text style={styles.loginTextBold}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111111',
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111111',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#718096',
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FEB2B2',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    gap: 10,
  },
  errorBannerText: {
    color: '#C53030',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  form: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2D3748',
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    backgroundColor: '#F8FAFC',
  },
  multilineWrapper: {
    height: 80,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputWrapperFocused: {
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
  },
  inputWrapperError: {
    borderColor: '#E53935',
  },
  inputIcon: {
    marginRight: 10,
  },
  inputIconTop: {
    marginRight: 10,
    marginTop: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A202C',
  },
  multilineInput: {
    textAlignVertical: 'top',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
  genderCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  genderCardActive: {
    backgroundColor: '#111111',
    borderColor: '#111111',
  },
  genderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  genderTextActive: {
    color: '#FFFFFF',
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingLeft: 14,
    backgroundColor: '#F8FAFC',
    overflow: 'hidden',
  },
  pickerIcon: {
    marginRight: 4,
  },
  matchHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingLeft: 4,
  },
  matchHintText: {
    fontSize: 12,
    color: '#38A169',
    fontWeight: '600',
  },
  mismatchHintText: {
    fontSize: 12,
    color: '#E53935',
    fontWeight: '600',
  },
  registerButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#111111',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 18,
  },
  loginText: {
    fontSize: 14,
    color: '#718096',
  },
  loginTextBold: {
    color: '#111111',
    fontWeight: '700',
  },
});