import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { MapPin, Clock, CheckCheck, MessageCircle, Sparkles, Zap, Wrench } from "lucide-react-native";
import StatusBadge from "./StatusBadge";
import { OrderStatus } from "../../services/db";
import { Colors, Shadows } from "../../src/constants/theme";

const ICON_MAP = {
  sparkles: Sparkles,
  zap: Zap,
  wrench: Wrench,
} as const;

interface BookingCardProps {
  serviceType: string;
  serviceIcon: keyof typeof ICON_MAP;
  title: string;
  description: string;
  status: OrderStatus;
  address: string;
  timeAgo: string;
  provider?: {
    name: string;
    arrivalTime: string;
    avatarUrl: string;
  } | null;
  onPress?: () => void;
}

export default function BookingCard({
  serviceType,
  serviceIcon,
  title,
  description,
  status,
  address,
  timeAgo,
  provider,
  onPress,
}: BookingCardProps) {
  const IconComponent = ICON_MAP[serviceIcon] || Sparkles;
  const isActive = ["accepted", "en_route", "in_progress"].includes(status);
  const isEnded = ["completed", "cancelled", "declined"].includes(status);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      className={`bg-surface-container-lowest rounded-xl p-4 gap-3 ${
        isActive ? "border-secondary border" : "border border-outline-variant"
      } ${isEnded ? "opacity-80" : ""}`}
      style={Shadows.md}
    >
      {/* Header: service type + status */}
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center gap-1 bg-surface-container py-1 px-2 rounded">
          <IconComponent size={14} color={Colors.onSurface} />
          <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-surface">
            {serviceType}
          </Text>
        </View>
        <StatusBadge status={status} />
      </View>

      {/* Title + description */}
      <View className="gap-1">
        <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 18 }} className="text-on-surface" numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant" numberOfLines={2}>
          {description}
        </Text>
      </View>

      {/* Provider info (if accepted) */}
      {provider && (
        <View className="flex-row items-center gap-2 bg-surface-container-low p-2 rounded-lg">
          <View className="w-8 h-8 rounded-full overflow-hidden">
            <Image source={{ uri: provider.avatarUrl }} className="w-full h-full" resizeMode="cover" />
          </View>
          <View className="flex-1">
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13 }} className="text-on-surface">
              {provider.name}
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 11 }} className="text-on-surface-variant">
              {provider.arrivalTime}
            </Text>
          </View>
          <TouchableOpacity className="p-1 rounded-full">
            <MessageCircle size={18} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Footer: location + time */}
      <View className="gap-2 pt-2 border-t border-surface-variant">
        <View className="flex-row items-center gap-2">
          <MapPin size={16} color={Colors.onSurfaceVariant} />
          <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
            {address}
          </Text>
        </View>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            {isEnded ? (
              <CheckCheck size={16} color={Colors.onSurfaceVariant} />
            ) : (
              <Clock size={16} color={Colors.onSurfaceVariant} />
            )}
            <Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant">
              {timeAgo}
            </Text>
          </View>
          <TouchableOpacity>
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 13, color: Colors.secondary }}>
              {status === "pending" ? "Edit" : isEnded ? "Receipt" : "Details"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
