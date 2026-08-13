import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export interface FilterOption<T extends string = string> {
  label: string;
  value: T;
}

export interface FilterPillsProps<T extends string = string> {
  options: FilterOption<T>[];
  selectedValue: T;
  onSelect: (value: T) => void;
}

export function FilterPills<T extends string = string>({ options, selectedValue, onSelect }: FilterPillsProps<T>) {
  return (
    <View className="flex-row items-center gap-2">
      {options.map((item) => {
        const isSelected = selectedValue === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            className={`px-3 py-1.5 rounded-full border ${
              isSelected ? 'bg-slate-900 border-slate-900' : 'bg-slate-100 border-slate-200'
            }`}
            onPress={() => onSelect(item.value)}
            activeOpacity={0.7}
          >
            <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-600'}`}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
