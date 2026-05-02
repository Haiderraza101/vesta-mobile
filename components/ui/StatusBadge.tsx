import React from "react";
import { View, Text } from "react-native";
import { OrderStatus } from "../../services/db";

interface StatusBadgeProps {
  status: OrderStatus;
  label?: string;
}

const CONFIG: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  pending:     { bg: "#fcdeb5", text: "#271901", label: "Pending" },
  accepted:    { bg: "#316bf3", text: "#fefcff", label: "Accepted" },
  en_route:    { bg: "#dbeafe", text: "#1e40af", label: "En Route" },
  in_progress: { bg: "#d1fae5", text: "#065f46", label: "In Progress" },
  completed:   { bg: "#e4e2e4", text: "#45464d", label: "Completed" },
  cancelled:   { bg: "#fee2e2", text: "#991b1b", label: "Cancelled" },
  declined:    { bg: "#fce4ec", text: "#880e4f", label: "Declined" },
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = CONFIG[status] || CONFIG.pending;
  return (
    <View className="px-2 py-1 rounded" style={{ backgroundColor: config.bg }}>
      <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, letterSpacing: 0.48, color: config.text }}>
        {label || config.label}
      </Text>
    </View>
  );
}
