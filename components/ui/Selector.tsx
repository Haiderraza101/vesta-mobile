import React, { useState } from "react";
import { View, TouchableOpacity, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "./Text";
import { cn } from "../../utils/utils";
import { ChevronDown, X } from "lucide-react-native";

interface Option {
  label: string;
  value: string;
}

interface SelectorProps {
  label?: string;
  options: Option[];
  value: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export function Selector({
  label,
  options,
  value,
  onSelect,
  placeholder = "Select an option",
  className,
  error,
}: SelectorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <View className={cn("flex-col gap-2 w-full", className)}>
      {label && (
        <Text variant="small" weight="semibold" className="text-muted uppercase tracking-wider ml-1">
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setIsVisible(true)}
        className={cn(
          "h-14 w-full px-4 rounded-sm bg-white border border-border flex-row items-center justify-between",
          error && "border-destructive"
        )}
      >
        <Text className={cn(!selectedOption && "text-muted")}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <ChevronDown size={20} color="#64748B" />
      </TouchableOpacity>

      {error && (
        <Text variant="small" className="text-destructive ml-1">
          {error}
        </Text>
      )}

      <Modal
        visible={isVisible}
        animationType="slide"
        transparent={true}
      >
        <View className="flex-1 bg-black/40 justify-end">
          <SafeAreaView className="bg-white rounded-t-3xl h-[60%]">
            <View className="flex-row items-center justify-between p-6 border-b border-border">
              <Text variant="h3" weight="bold">{label || "Select Option"}</Text>
              <TouchableOpacity onPress={() => setIsVisible(false)}>
                <X size={24} color="#0F172A" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item.value);
                    setIsVisible(false);
                  }}
                  className={cn(
                    "p-4 rounded-sm mb-2 flex-row items-center justify-between",
                    item.value === value ? "bg-primary" : "bg-secondary"
                  )}
                >
                  <Text 
                    weight={item.value === value ? "semibold" : "normal"}
                    className={item.value === value ? "text-white" : "text-foreground"}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}
