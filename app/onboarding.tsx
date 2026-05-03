import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/Text';
import { useAuth } from '@/context/AuthContext';
import { sendEmailVerification } from 'firebase/auth';
import { useToast } from '@/context/ToastContext';
import { userService } from '@/services/userService';
import { onboardingService, OnboardingQuestion } from '@/services/onboardingService';
import { ArrowLeft, Send } from 'lucide-react-native';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

type Message = {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  type?: 'text' | 'choice' | 'number';
  options?: string[];
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const { showToast } = useToast();
  
  const [questions, setQuestions] = useState<OnboardingQuestion[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [answers, setAnswers] = useState<any>({});
  const [isTyping, setIsTyping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const scrollViewRef = useRef<ScrollView>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (!userProfile?.role || initialized.current) return;
      initialized.current = true;
      
      const dynamicQuestions = await onboardingService.getQuestions(userProfile.role as any);
      
      if (dynamicQuestions.length === 0) {
        showToast("No onboarding questions configured", "error");
        router.replace('/(tabs)');
        return;
      }
      
      setQuestions(dynamicQuestions);
      setLoading(false);

      const data = userProfile.onboardingData || {};
      let nextStep = 0;
      
      if (data) {
        for (let i = 0; i < dynamicQuestions.length; i++) {
          if (data[dynamicQuestions[i].field]) {
            nextStep = i + 1;
          } else {
            break;
          }
        }
      }

      if (nextStep < dynamicQuestions.length) {
        setCurrentStep(nextStep);
        setAnswers(data);
        const prefix = nextStep > 0 ? "Welcome back! Let's continue. " : "";
        addBotMessage(prefix + dynamicQuestions[nextStep].text, dynamicQuestions[nextStep].type, dynamicQuestions[nextStep].options);
      } else {
        router.replace('/(tabs)');
      }
    };

    loadData();
  }, [userProfile]);

  const addBotMessage = (text: string, type: any = 'text', options?: string[]) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage: Message = {
        id: Math.random().toString(),
        text,
        sender: 'bot',
        type,
        options
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Math.random().toString(),
      text,
      sender: 'user'
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async (value: string) => {
    if (!value.trim()) return;

    const question = questions[currentStep];

    if (question.type === 'number' || question.field.includes('phone')) {
      const phoneRegex = /^\+?[\d\s-]{10,}$/;
      if (!phoneRegex.test(value)) {
        showToast("Please enter a valid phone number", "error");
        return;
      }
    }

    addUserMessage(value);
    setInputValue('');

    const newAnswers = { ...answers, [question.field]: value };
    setAnswers(newAnswers);

    const nextStep = currentStep + 1;
    const isEmailVerified = user?.emailVerified || false;
    
    const questionWeight = 50 / questions.length;
    let progress = Math.round(nextStep * questionWeight);
    if (isEmailVerified) progress += 50;
    
    if (nextStep < questions.length) {
      setCurrentStep(nextStep);
      addBotMessage(questions[nextStep].text, questions[nextStep].type, questions[nextStep].options);
      saveProgress(newAnswers, progress);
    } else {
      setSubmitting(true);
      const finalProgress = isEmailVerified ? 100 : 50;
      await saveProgress(newAnswers, finalProgress);
      setSubmitting(false);

      if (!isEmailVerified) {
        addBotMessage("Great! I have all your info. Now, for 50% of your progress, please verify your email. Check your inbox and refresh!", "choice", ["I've verified my email", "Send again"]);
      } else {
        addBotMessage("Excellent! Your profile is now 100% complete. Welcome aboard!", "choice", ["Go to Dashboard"]);
      }
    }
  };

  const saveProgress = async (data: any, status: number) => {
    if (!user?.uid) return;
    try {
      await userService.updateUserProfile(user.uid, {
        onboardingData: data,
        onboardingStatus: status
      });
    } catch (error) {
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (option === "Go to Dashboard" || option === "Maybe later" || option === "Skip for now") {
      router.replace('/(tabs)');
      return;
    }
    if (option === "I've verified my email") {
      await user?.reload();
      if (user?.emailVerified) {
        await saveProgress(answers, 100);
        addBotMessage("Verification confirmed! You are now at 100%.", "choice", ["Go to Dashboard"]);
      } else {
        showToast("Email not verified yet. Please check your inbox.", "error");
      }
      return;
    }
    if (option === "Send again") {
      try {
        if (user) await sendEmailVerification(user);
        showToast("Verification email sent!", "success");
      } catch (e) {
        showToast("Rate limited. Please try again later.", "error");
      }
      return;
    }
    handleSend(option);
  };

  if (loading) return <ActivityIndicator color="#4C6FFF" className="flex-1" />;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="px-6 py-4 flex-row items-center justify-between border-b border-slate-50">
          <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-slate-50 rounded-full">
            <ArrowLeft size={20} color="#0F172A" />
          </TouchableOpacity>
          <View className="items-center">
            <Text weight="bold" className="text-slate-900">Setup Profile</Text>
            <Text className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Step {currentStep + 1} of {questions.length}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.replace('/(tabs)')}
            className="px-4 py-2 bg-slate-50 rounded-xl"
          >
            <Text weight="bold" className="text-slate-400 text-xs">Skip</Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          ref={scrollViewRef}
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 40 }}
          onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, index) => (
            <Animated.View
              key={msg.id}
              entering={FadeInDown.duration(400)}
              layout={Layout.springify()}
              className={`mb-6 max-w-[85%] ${msg.sender === 'user' ? 'self-end' : 'self-start'}`}
            >
              <View className={`p-5 rounded-[28px] ${
                msg.sender === 'user' 
                  ? 'bg-primary rounded-tr-none' 
                  : 'bg-slate-50 rounded-tl-none border border-slate-100'
              }`}>
                <Text weight="medium" className={`text-base leading-6 ${msg.sender === 'user' ? 'text-white' : 'text-slate-700'}`}>
                  {msg.text}
                </Text>
              </View>
              
              {msg.sender === 'bot' && msg.type === 'choice' && msg.options && index === messages.length - 1 && (
                <View className="flex-row flex-wrap gap-3 mt-4">
                  {msg.options.map((opt) => (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => handleOptionSelect(opt)}
                      className="bg-white border-2 border-primary/20 px-6 py-3 rounded-2xl shadow-sm"
                    >
                      <Text weight="bold" className="text-primary text-sm">{opt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </Animated.View>
          ))}
          
          {isTyping && (
            <Animated.View
              entering={FadeInDown}
              className="bg-slate-50 p-4 rounded-2xl self-start flex-row gap-1"
            >
              <View className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
              <View className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              <View className="w-1.5 h-1.5 bg-slate-300 rounded-full" />
            </Animated.View>
          )}
        </ScrollView>

        <View className="p-6 bg-white border-t border-slate-50">
          {questions[currentStep]?.type !== 'choice' && !isTyping && (
            <View className="flex-row items-center bg-slate-50 rounded-3xl px-6 h-16 border border-slate-100">
              <TextInput
                placeholder={questions[currentStep]?.placeholder || "Type your answer..."}
                keyboardType={
                  questions[currentStep]?.type === 'number' ? 'numeric' : 
                  questions[currentStep]?.field?.toLowerCase().includes('phone') ? 'phone-pad' : 'default'
                }
                className="flex-1 h-full text-slate-900 font-bold"
                value={inputValue}
                onChangeText={setInputValue}
                onSubmitEditing={() => handleSend(inputValue)}
              />
              <TouchableOpacity 
                onPress={() => handleSend(inputValue)}
                className="w-10 h-10 bg-primary rounded-xl items-center justify-center shadow-lg shadow-primary/30"
              >
                <Send size={18} color="white" />
              </TouchableOpacity>
            </View>
          )}
          
          {submitting && (
            <View className="items-center py-2">
              <ActivityIndicator color="#4C6FFF" />
              <Text className="text-slate-400 text-[10px] mt-2 font-bold uppercase">Finalizing your profile...</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
