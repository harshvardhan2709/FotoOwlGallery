import React, { useState } from 'react';
import {
  KeyboardTypeOptions,
  StyleProp,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  isPassword?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  error?: string | null;
  containerStyle?: StyleProp<ViewStyle>;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  iconName,
  isPassword = false,
  keyboardType = 'default',
  maxLength,
  multiline = false,
  numberOfLines = 1,
  error,
  containerStyle,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-3" style={containerStyle}>
      <Text className="text-sm font-bold text-slate-700 mb-1.5">{label}</Text>

      <View
        className={`flex-row items-center border rounded-xl px-3.5 bg-slate-50 ${
          multiline ? 'py-3' : 'h-13'
        } ${error ? 'border-red-500 bg-red-50/20' : isFocused ? 'border-slate-900 bg-white' : 'border-slate-200'}`}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={20}
            color={error ? '#EF4444' : isFocused ? '#0F172A' : '#718096'}
            style={{ marginRight: 10, alignSelf: multiline ? 'flex-start' : 'center', marginTop: multiline ? 2 : 0 }}
          />
        )}

        <TextInput
          className="flex-1 text-base text-slate-900 font-medium"
          placeholder={placeholder}
          placeholderTextColor="#A0AEC0"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoCapitalize={isPassword ? 'none' : 'sentences'}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#718096"
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? <Text className="text-xs font-semibold text-red-500 mt-1 ml-1">{error}</Text> : null}
    </View>
  );
};
