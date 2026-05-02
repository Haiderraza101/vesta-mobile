import React from "react";
import { View, Text } from "react-native";
import { Check } from "lucide-react-native";
import { Colors } from "../../src/constants/theme";

interface Step {
  label: string;
  time: string;
  status: "completed" | "current" | "pending";
}

interface ProgressStepperProps {
  steps: Step[];
}

export default function ProgressStepper({ steps }: ProgressStepperProps) {
  return (
    <View className="flex-col relative ml-1">
      {/* Vertical track line */}
      <View
        className="absolute bg-outline-variant rounded-full"
        style={{ left: 10, top: 24, bottom: 28, width: 2 }}
      />

      {steps.map((step, index) => (
        <View key={index} className="flex-row items-start gap-4 relative py-3" style={{ zIndex: 10 }}>
          {/* Step indicator */}
          {step.status === "completed" ? (
            <View className="w-6 h-6 rounded-full bg-primary items-center justify-center mt-0.5" style={{ elevation: 2 }}>
              <Check size={12} color={Colors.onPrimary} strokeWidth={3} />
            </View>
          ) : step.status === "current" ? (
            <View className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-primary items-center justify-center mt-0.5">
              <View className="w-2.5 h-2.5 rounded-full bg-primary" />
            </View>
          ) : (
            <View className="w-6 h-6 rounded-full bg-surface-container-lowest border-2 border-outline-variant mt-0.5 opacity-50" />
          )}

          {/* Step content */}
          <View className={`flex-1 ${step.status === "pending" ? "opacity-50" : ""}`}>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface">
              {step.label}
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant mt-1">
              {step.time}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
