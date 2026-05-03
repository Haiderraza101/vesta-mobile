import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Selector } from "@/components/ui/Selector";
import { LoadingState } from "@/components/ui/LoadingState";
import { useToast } from "@/context/ToastContext";
import { configService } from "@/services/configService";
import { ArrowLeft, Globe, Percent } from "lucide-react-native";

export default function PlatformSettingsScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [platformName, setPlatformName] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [taxRate, setTaxRate] = useState("");

  const currencyOptions = [
    { label: "US Dollar (USD)", value: "USD", symbol: "$" },
    { label: "Pakistani Rupee (PKR)", value: "PKR", symbol: "Rs" },
    { label: "UAE Dirham (AED)", value: "AED", symbol: "د.إ" },
    { label: "British Pound (GBP)", value: "GBP", symbol: "£" },
    { label: "Euro (EUR)", value: "EUR", symbol: "€" },
    { label: "Indian Rupee (INR)", value: "INR", symbol: "₹" },
    { label: "Saudi Riyal (SAR)", value: "SAR", symbol: "SR" },
  ];

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await configService.getSettings();
        setPlatformName(settings.platformName);
        setCurrencyCode(settings.currencyCode);
        setCurrencySymbol(settings.currencySymbol);
        setTaxRate(settings.taxRate.toString());
      } catch (error) {
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleCurrencySelect = (val: string) => {
    setCurrencyCode(val);
    const option = currencyOptions.find(o => o.value === val);
    if (option) setCurrencySymbol(option.symbol);
  };

  const handleSave = async () => {
    if (!platformName || !currencyCode || !currencySymbol) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setSaving(true);
    try {
      await configService.updateSettings({
        platformName,
        currencyCode: currencyCode.toUpperCase(),
        currencySymbol,
        taxRate: parseFloat(taxRate) || 0
      });
      showToast("Settings updated successfully", "success");
      router.back();
    } catch (error) {
      showToast("Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingState message="Configuring platform..." />;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row items-center gap-4 mb-10">
          <TouchableOpacity onPress={() => router.back()} className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl">
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text weight="bold" className="text-xl text-slate-900">Platform Settings</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="pb-20">
          <View className="gap-6">
            <View className="bg-slate-50 p-7 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-100">
              <Text weight="bold" className="text-slate-900 mb-6 text-lg">General</Text>
              <Input 
                label="Marketplace Name" 
                value={platformName} 
                onChangeText={setPlatformName}
                leftIcon={<Globe size={20} color="#4C6FFF" />}
              />
            </View>

            <View className="bg-slate-50 p-7 rounded-[40px] border border-slate-100 shadow-sm shadow-slate-100">
              <Text weight="bold" className="text-slate-900 mb-6 text-lg">Localization & Finance</Text>
              <View className="gap-5">
                <Selector 
                  label="Currency" 
                  options={currencyOptions} 
                  value={currencyCode} 
                  onSelect={handleCurrencySelect}
                />
                <View className="flex-row items-center justify-between bg-white p-5 rounded-3xl border border-slate-100">
                  <Text weight="medium" className="text-slate-400">Active Symbol</Text>
                  <View className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10">
                    <Text weight="bold" className="text-primary text-lg">{currencySymbol}</Text>
                  </View>
                </View>
              </View>
              <View className="mt-6">
                <Input 
                  label="Service Tax Rate (%)" 
                  placeholder="0" 
                  keyboardType="numeric"
                  value={taxRate} 
                  onChangeText={setTaxRate}
                  leftIcon={<Percent size={20} color="#4C6FFF" />}
                />
              </View>
            </View>
          </View>
        </ScrollView>
        <Button 
          title={saving ? "Saving..." : "Save Changes"} 
          onPress={handleSave} 
          loading={saving}
          className="mb-6 h-16 rounded-2xl shadow-lg shadow-primary/20"
        />
      </View>
    </SafeAreaView>
  );
}
