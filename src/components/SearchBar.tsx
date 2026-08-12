import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search by author name...',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`flex-row items-center bg-white rounded-2xl border px-3.5 h-12 shadow-sm ${
        isFocused ? 'border-slate-900 bg-white' : 'border-slate-200 bg-white'
      }`}
    >
      <Ionicons
        name="search-outline"
        size={20}
        color={isFocused ? '#0F172A' : '#94A3B8'}
        style={{ marginRight: 8 }}
      />

      <TextInput
        className="flex-1 text-sm font-semibold text-slate-900"
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="p-1"
        >
          <Ionicons name="close-circle" size={18} color="#94A3B8" />
        </TouchableOpacity>
      )}
    </View>
  );
};
