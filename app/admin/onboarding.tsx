import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Text } from "@/components/ui/Text";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ModalLayout } from "@/components/ui/ModalLayout";
import { Selector } from "@/components/ui/Selector";
import { useDisclosure } from "@/hooks/useDisclosure";
import { useToast } from "@/context/ToastContext";
import { onboardingService, OnboardingQuestion } from "@/services/onboardingService";
import { ArrowLeft, Plus, Trash2, Edit2, MessageSquare, List, RotateCcw } from "lucide-react-native";
import { seedOnboardingData } from "@/utils/seedOnboarding";

export default function OnboardingManagement() {
  const router = useRouter();
  const { showToast } = useToast();
  const addDisclosure = useDisclosure();
  
  const [role, setRole] = useState<'customer' | 'provider'>('provider');
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [type, setType] = useState<'text' | 'choice' | 'number'>('text');
  const [field, setField] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const fetchQuestions = async () => {
    setLoading(true);
    const data = await onboardingService.getQuestions(role);
    setQuestions(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [role]);

  const handleSaveQuestion = async () => {
    if (!text || !field) {
      showToast("Text and Field ID are required", "error");
      return;
    }

    const newQuestion: OnboardingQuestion = {
      id: editingId || Math.random().toString(36).substr(2, 9),
      text,
      type,
      field,
      options: type === 'choice' ? options : undefined
    };

    let updatedQuestions;
    if (editingId) {
      updatedQuestions = questions.map(q => q.id === editingId ? newQuestion : q);
    } else {
      updatedQuestions = [...questions, newQuestion];
    }

    setSaving(true);
    try {
      await onboardingService.updateQuestions(role, updatedQuestions);
      setQuestions(updatedQuestions);
      showToast("Flow updated", "success");
      resetForm();
      addDisclosure.close();
    } catch (error) {
      showToast("Update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const updated = questions.filter(q => q.id !== id);
    try {
      await onboardingService.updateQuestions(role, updated);
      setQuestions(updated);
      showToast("Question removed", "success");
    } catch (error) {
      showToast("Delete failed", "error");
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setText("");
    setType('text');
    setField("");
    setOptions([]);
    setNewOption("");
  };

  const handleEdit = (q: OnboardingQuestion) => {
    setEditingId(q.id);
    setText(q.text);
    setType(q.type);
    setField(q.field);
    setOptions(q.options || []);
    addDisclosure.open();
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <View className="flex-1 px-6 pt-4">
        <View className="flex-row items-center justify-between mb-8">
          <TouchableOpacity onPress={() => router.back()} className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl">
            <ArrowLeft size={22} color="#0F172A" />
          </TouchableOpacity>
          <Text weight="bold" className="text-xl text-slate-900">Onboarding Flows</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity onPress={async () => {
              Alert.alert("Restore Defaults", "This will overwrite current questions with defaults. Continue?", [
                { text: "Cancel", style: "cancel" },
                { text: "Restore", style: "destructive", onPress: async () => {
                  await seedOnboardingData();
                  fetchQuestions();
                  showToast("Defaults restored", "success");
                }}
              ]);
            }} className="h-12 w-12 items-center justify-center border border-slate-100 rounded-2xl">
              <RotateCcw size={20} color="#64748B" />
            </TouchableOpacity>
            <TouchableOpacity onPress={addDisclosure.open} className="h-12 w-12 items-center justify-center bg-primary rounded-2xl">
              <Plus size={22} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row gap-4 mb-8">
          <TouchableOpacity 
            onPress={() => setRole('provider')}
            className={`flex-1 py-4 rounded-2xl items-center ${role === 'provider' ? 'bg-slate-900' : 'bg-slate-50'}`}
          >
            <Text weight="bold" className={role === 'provider' ? 'text-white' : 'text-slate-500'}>Providers</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setRole('customer')}
            className={`flex-1 py-4 rounded-2xl items-center ${role === 'customer' ? 'bg-slate-900' : 'bg-slate-50'}`}
          >
            <Text weight="bold" className={role === 'customer' ? 'text-white' : 'text-slate-500'}>Customers</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#4C6FFF" className="flex-1" />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {questions.map((q, i) => (
              <View key={q.id} className="bg-slate-50 p-6 rounded-[32px] mb-4 border border-slate-100">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="flex-row items-center gap-3">
                    <View className="w-8 h-8 bg-white rounded-xl items-center justify-center">
                      <Text weight="bold" className="text-primary text-xs">{i + 1}</Text>
                    </View>
                    <View className="bg-primary/10 px-3 py-1 rounded-full">
                       <Text weight="bold" className="text-primary text-[10px] uppercase tracking-widest">{q.type}</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity onPress={() => handleEdit(q)} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-100">
                      <Edit2 size={16} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(q.id)} className="w-10 h-10 bg-white rounded-full items-center justify-center border border-slate-100">
                      <Trash2 size={16} color="#F43F5E" />
                    </TouchableOpacity>
                  </View>
                </View>

                <Text weight="bold" className="text-slate-900 text-lg mb-2">{q.text}</Text>
                <View className="flex-row items-center gap-2">
                  <MessageSquare size={14} color="#94A3B8" />
                  <Text className="text-slate-400 text-xs font-bold uppercase tracking-widest">{q.field}</Text>
                </View>

                {q.options && q.options.length > 0 && (
                  <View className="mt-4 flex-row flex-wrap gap-2">
                    {q.options.map(opt => (
                      <View key={opt} className="bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                        <Text className="text-slate-600 text-[11px] font-medium">{opt}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        <ModalLayout 
          visible={addDisclosure.isOpen} 
          onClose={() => {
            resetForm();
            addDisclosure.close();
          }} 
          title={editingId ? "Edit Question" : "Add Question"}
        >
          <View className="gap-y-6 pb-10">
            <Input 
              label="Question Text"
              placeholder="e.g. What is your phone number?"
              value={text}
              onChangeText={setText}
            />

            <Input 
              label="Field Key (DB)"
              placeholder="e.g. phoneNumber"
              value={field}
              onChangeText={setField}
            />

            <View>
              <Text weight="bold" className="text-slate-800 text-sm mb-3 uppercase tracking-widest">Input Type</Text>
              <Selector 
                options={['text', 'choice', 'number']}
                selected={type}
                onSelect={(val: any) => setType(val)}
              />
            </View>

            {type === 'choice' && (
              <View>
                <Text weight="bold" className="text-slate-800 text-sm mb-3 uppercase tracking-widest">Options</Text>
                <View className="flex-row gap-2 mb-4">
                  <Input 
                    placeholder="New option..."
                    className="flex-1 mb-0"
                    value={newOption}
                    onChangeText={setNewOption}
                  />
                  <TouchableOpacity 
                    onPress={() => {
                      if (newOption) {
                        setOptions([...options, newOption]);
                        setNewOption("");
                      }
                    }}
                    className="h-14 w-14 items-center justify-center bg-primary rounded-2xl"
                  >
                    <Plus size={24} color="white" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {options.map((opt, i) => (
                    <View key={i} className="bg-slate-50 px-4 py-2 rounded-xl flex-row items-center gap-2 border border-slate-100">
                      <Text className="text-slate-700 font-medium">{opt}</Text>
                      <TouchableOpacity onPress={() => setOptions(options.filter((_, idx) => idx !== i))}>
                        <Trash2 size={14} color="#F43F5E" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <Button 
              title={editingId ? "Update Question" : "Create Question"}
              loading={saving}
              onPress={handleSaveQuestion} 
              className="mt-4"
            />
          </View>
        </ModalLayout>
      </View>
    </SafeAreaView>
  );
}
