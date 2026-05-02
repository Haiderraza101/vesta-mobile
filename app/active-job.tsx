import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Phone, MessageCircle, MapPin, Navigation, CheckCircle, Truck, Play } from "lucide-react-native";
import AppHeader from "../components/ui/AppHeader";
import StatusBadge from "../components/ui/StatusBadge";
import ProgressStepper from "../components/ui/ProgressStepper";
import { getBookingById, updateOrderStatus, completeJob, Booking, OrderStatus } from "../services/db";
import { useAuth } from "../context/AuthContext";
import { Colors, Shadows } from "../src/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";

/** State machine: what button to show + what status to transition to */
const TRANSITIONS: Record<string, { label: string; next: OrderStatus; color: string; icon: "truck" | "play" | "check" }> = {
  accepted:    { label: "I'm En Route",         next: "en_route",    color: "#2563eb", icon: "truck" },
  en_route:    { label: "Start Working",         next: "in_progress", color: "#ea580c", icon: "play" },
  in_progress: { label: "Mark Job Completed",    next: "completed",   color: "#7c3aed", icon: "check" },
};

const ICONS = { truck: Truck, play: Play, check: CheckCircle };

export default function ActiveJobScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (id) getBookingById(id).then((d) => { setBooking(d); setLoading(false); });
  }, [id]);

  const handleTransition = async () => {
    if (!booking || !user) return;
    const tx = TRANSITIONS[booking.status];
    if (!tx) return;

    setTransitioning(true);
    try {
      if (tx.next === "completed") {
        // Batch: mark completed + increment provider's jobsCompleted
        await completeJob(booking.id, user.uid);
        router.replace({ pathname: "/job-completed", params: { id: booking.id, price: String(booking.price || 0) } });
      } else {
        await updateOrderStatus(booking.id, tx.next);
        // Refresh local state
        setBooking({ ...booking, status: tx.next });
      }
    } catch (e) {
      Alert.alert("Error", "Failed to update job status.");
    } finally {
      setTransitioning(false);
    }
  };

  const getSteps = () => {
    const all: { label: string; status: "completed" | "current" | "pending" }[] = [
      { label: "Job Accepted",      status: "pending" },
      { label: "En Route",          status: "pending" },
      { label: "Work In Progress",  status: "pending" },
      { label: "Completed",         status: "pending" },
    ];
    const statusMap: Record<string, number> = { accepted: 0, en_route: 1, in_progress: 2, completed: 3 };
    const currentIdx = statusMap[booking?.status || "accepted"] ?? 0;
    return all.map((s, i) => ({
      ...s,
      time: i <= currentIdx ? "Done" : "Pending",
      status: i < currentIdx ? "completed" as const : i === currentIdx ? "current" as const : "pending" as const,
    }));
  };

  if (loading) return <SafeAreaView className="flex-1 bg-background items-center justify-center"><ActivityIndicator size="large" color={Colors.secondary} /></SafeAreaView>;
  if (!booking) return <SafeAreaView className="flex-1 bg-background items-center justify-center"><Text style={{ fontFamily: "Inter", fontSize: 16 }} className="text-on-surface-variant">Job not found.</Text></SafeAreaView>;

  const tx = TRANSITIONS[booking.status];
  const TxIcon = tx ? ICONS[tx.icon] : null;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <AppHeader showBack />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="px-4 pt-4 gap-4">
          {/* Live status banner */}
          <View className="rounded-lg p-4 flex-row items-center justify-between" style={{ borderWidth: 1, borderColor: booking.status === "in_progress" ? "#6ee7b7" : "#93c5fd", backgroundColor: booking.status === "in_progress" ? "#ecfdf5" : "#eff6ff" }}>
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: booking.status === "in_progress" ? Colors.emerald500 : Colors.secondary }} />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: booking.status === "in_progress" ? "#065f46" : "#1e40af" }}>
                {booking.status.replace("_", " ").toUpperCase()}
              </Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>

          {/* Customer card */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-4" style={Shadows.md}>
            <View className="flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-full bg-secondary-fixed items-center justify-center border border-outline-variant">
                <Text style={{ fontFamily: "Manrope-Bold", fontSize: 24, color: Colors.secondary }}>{(booking.customerName || "C").charAt(0)}</Text>
              </View>
              <View className="flex-1">
                <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">{booking.customerName}</Text>
                <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant mt-1">{booking.serviceCategory}</Text>
              </View>
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-primary">${booking.price?.toFixed(0)}</Text>
            </View>
            <View className="flex-row gap-3 pt-2">
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg border border-secondary">
                <Phone size={16} color={Colors.secondary} /><Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg border border-secondary">
                <MessageCircle size={16} color={Colors.secondary} /><Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: Colors.secondary }}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Customer message */}
          {booking.customerMessage && (
            <View className="bg-surface-container-low border border-outline-variant rounded-xl p-4" style={Shadows.sm}>
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-on-surface mb-2">Customer's Request</Text>
              <Text style={{ fontFamily: "Inter", fontSize: 15, lineHeight: 23, fontStyle: "italic" }} className="text-on-surface-variant">
                "{booking.customerMessage}"
              </Text>
            </View>
          )}

          {/* Location */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 gap-3" style={Shadows.sm}>
            <View className="flex-row justify-between items-center">
              <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface">Location</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <Navigation size={14} color={Colors.secondary} />
                <Text style={{ fontFamily: "Inter-Medium", fontSize: 12, color: Colors.secondary }}>Navigate</Text>
              </TouchableOpacity>
            </View>
            <View className="w-full h-36 rounded-lg bg-surface-container-low border border-outline-variant items-center justify-center">
              <MapPin size={28} color={Colors.secondary} /><Text style={{ fontFamily: "Inter", fontSize: 13 }} className="text-on-surface-variant mt-1">Map Preview</Text>
            </View>
            <View className="flex-row items-start gap-2">
              <MapPin size={20} color={Colors.outline} />
              <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14 }} className="text-on-surface">{booking.address || "Not specified"}</Text>
            </View>
          </View>

          {/* Progress stepper */}
          <View className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4" style={Shadows.sm}>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface mb-2">Job Progress</Text>
            <ProgressStepper steps={getSteps()} />
          </View>
        </View>
      </ScrollView>

      {/* State-machine action button */}
      {tx && (
        <View className="absolute bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-4" style={Shadows.md}>
          <TouchableOpacity onPress={handleTransition} disabled={transitioning}
            className={`w-full py-4 rounded-xl flex-row items-center justify-center gap-2 ${transitioning ? "opacity-50" : ""}`}
            style={{ backgroundColor: tx.color }} activeOpacity={0.85}>
            {transitioning ? <ActivityIndicator color="#fff" /> : (
              <>{TxIcon && <TxIcon size={20} color="#fff" />}<Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, color: "#fff" }}>{tx.label}</Text></>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
