import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, Clock, CheckCheck, Sparkles, Zap, Wrench } from "lucide-react-native";
import StatusBadge from "./StatusBadge";
import { OrderStatus } from "../../services/db";
import { Colors, Shadows } from "../../src/constants/theme";

const ICON_MAP = { sparkles: Sparkles, zap: Zap, wrench: Wrench } as const;

interface BookingCardProps {
  serviceType: string;
  serviceIcon: keyof typeof ICON_MAP;
  title: string;
  description: string;
  status: OrderStatus;
  address: string;
  timeAgo: string;
  onPress?: () => void;
}

export default function BookingCard({
  serviceType, serviceIcon, title, description, status, address, timeAgo, onPress,
}: BookingCardProps) {
  const IconComponent = ICON_MAP[serviceIcon] || Sparkles;
  const isActive = status === "accepted" || status === "en_route" || status === "in_progress";
  const isDone = status === "completed" || status === "cancelled" || status === "declined";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`bg-surface-container-lowest rounded-xl p-4 gap-3 ${
        isActive ? "border-secondary border" : "border border-outline-variant"
      } ${isDone ? "opacity-70" : ""}`}
      style={Shadows.md}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-1 bg-surface-container py-1 px-2 rounded">
          <IconComponent size={14} color={Colors.onSurface} />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-surface">
            {serviceType}
          </Text>
        </View>
        <StatusBadge status={status} />
      </View>

      <View className="gap-1">
        <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface" numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant" numberOfLines={2}>
          {description}
        </Text>
      </View>

      <View className="gap-2 pt-2 border-t border-surface-variant">
        <View className="flex-row items-center gap-2">
          <MapPin size={16} color={Colors.onSurfaceVariant} />
          <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
            {address || "No address"}
          </Text>
        </View>
        {timeAgo ? (
          <View className="flex-row items-center gap-2">
            {isDone ? <CheckCheck size={16} color={Colors.onSurfaceVariant} /> : <Clock size={16} color={Colors.onSurfaceVariant} />}
            <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">{timeAgo}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
