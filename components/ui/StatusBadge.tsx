import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../../src/constants/theme";

type StatusType = "pending" | "accepted" | "completed" | "in-progress";

interface StatusBadgeProps {
  status: StatusType;
  label?: string;
}

const CONFIG: Record<StatusType, { bg: string; text: string; label: string }> = {
  pending: { bg: "#fcdeb5", text: "#271901", label: "Pending" },
  accepted: { bg: "#316bf3", text: "#fefcff", label: "Accepted" },
  completed: { bg: "#e4e2e4", text: "#45464d", label: "Completed" },
  "in-progress": { bg: "#d1fae5", text: "#065f46", label: "In Progress" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = CONFIG[status];
  return (
    <View className="px-2 py-1 rounded" style={{ backgroundColor: config.bg }}>
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48, color: config.text }}>
        {label || config.label}
      </Text>
    </View>
  );
}
