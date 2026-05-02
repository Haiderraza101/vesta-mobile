<<<<<<< Updated upstream
import { RoleSelectionView } from "../../src/views/auth/RoleSelectionView";
export default RoleSelectionView;
=======
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { User, Wrench, CheckCircle, ArrowRight, Sparkles, Zap } from "lucide-react-native";
import ChipSelector from "../../components/ui/ChipSelector";
import PrimaryButton from "../../components/ui/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import { Colors } from "../../src/constants/theme";
import { TRADES } from "../../src/constants/mockData";
import { SafeAreaView } from "react-native-safe-area-context";

const TRADE_ICONS: Record<string, React.ReactNode> = {
  sparkles: <Sparkles size={14} color="currentColor" />,
  zap: <Zap size={14} color="currentColor" />,
  wrench: <Wrench size={14} color="currentColor" />,
};

export default function RoleSelectionScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<"customer" | "provider" | null>(null);
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      router.replace("/(tabs)");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 16 }}>
        {/* Header */}
        <View className="items-center mb-8">
          <Text style={{ fontFamily: "Manrope-Bold", fontSize: 32, lineHeight: 38, letterSpacing: -0.64 }} className="text-on-surface mb-2">
            Choose your path
          </Text>
          <Text style={{ fontFamily: "Inter", fontSize: 18, lineHeight: 29 }} className="text-on-surface-variant text-center">
            Tell us how you'd like to use ServiceHub to get started.
          </Text>
        </View>

        {/* Role cards */}
        <View className="gap-4 mb-6">
          {/* Customer card */}
          <TouchableOpacity
            onPress={() => setSelectedRole("customer")}
            activeOpacity={0.9}
            className={`items-center justify-center p-8 bg-surface-container-lowest border rounded-xl ${
              selectedRole === "customer" ? "border-2" : "border-outline-variant"
            }`}
            style={selectedRole === "customer" ? { borderColor: Colors.blue600 } : {}}
          >
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${selectedRole === "customer" ? "" : "bg-secondary-fixed"}`} style={selectedRole === "customer" ? { backgroundColor: Colors.blue600 } : {}}>
              <User size={32} color={selectedRole === "customer" ? "#ffffff" : Colors.blue600} />
            </View>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface mb-1">
              I Need a Service
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant text-center">
              Find and book trusted professionals for your needs.
            </Text>
            {selectedRole === "customer" && (
              <View className="absolute top-3 right-3">
                <CheckCircle size={24} color={Colors.blue600} />
              </View>
            )}
          </TouchableOpacity>

          {/* Provider card */}
          <TouchableOpacity
            onPress={() => setSelectedRole("provider")}
            activeOpacity={0.9}
            className={`items-center justify-center p-8 bg-surface-container-lowest border rounded-xl ${
              selectedRole === "provider" ? "border-2" : "border-outline-variant"
            }`}
            style={selectedRole === "provider" ? { borderColor: Colors.blue600 } : {}}
          >
            <View className={`w-16 h-16 rounded-full items-center justify-center mb-4 ${selectedRole === "provider" ? "" : "bg-secondary-fixed"}`} style={selectedRole === "provider" ? { backgroundColor: Colors.blue600 } : {}}>
              <Wrench size={32} color={selectedRole === "provider" ? "#ffffff" : Colors.blue600} />
            </View>
            <Text style={{ fontFamily: "Manrope-SemiBold", fontSize: 20 }} className="text-on-surface mb-1">
              I Offer a Service
            </Text>
            <Text style={{ fontFamily: "Inter", fontSize: 14 }} className="text-on-surface-variant text-center">
              List your services and connect with local customers.
            </Text>
            {selectedRole === "provider" && (
              <View className="absolute top-3 right-3">
                <CheckCircle size={24} color={Colors.blue600} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Trade selection (only for provider) */}
        {selectedRole === "provider" && (
          <View className="bg-surface-container-low p-4 rounded-xl border border-outline-variant mb-6">
            <Text style={{ fontFamily: "Inter-SemiBold", fontSize: 14, letterSpacing: 0.28 }} className="text-on-surface mb-4">
              Select your primary trade:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {TRADES.map((trade) => (
                <ChipSelector
                  key={trade.id}
                  label={trade.name}
                  selected={selectedTrade === trade.id}
                  onPress={() => setSelectedTrade(trade.id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Continue */}
        <PrimaryButton
          title="Continue"
          iconRight={<ArrowRight size={18} color={Colors.onSecondary} />}
          onPress={handleContinue}
          disabled={!selectedRole}
          style={{ backgroundColor: Colors.blue600 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
>>>>>>> Stashed changes
