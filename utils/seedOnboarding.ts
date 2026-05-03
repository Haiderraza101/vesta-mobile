import { onboardingService, OnboardingQuestion } from '@/services/onboardingService';

const DEFAULT_PROVIDER_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'intro',
    text: "Welcome to Vesta! I'm your assistant. Let's get your professional profile set up in just a few minutes. Ready?",
    type: 'choice',
    options: ["Let's do it!", "Maybe later"],
    field: 'intro'
  },
  {
    id: 'phone',
    text: "Great! First, what is your professional phone number? Customers will use this to contact you.",
    type: 'text',
    field: 'phone',
    placeholder: '+1 234 567 890'
  },
  {
    id: 'experience',
    text: "How many years of experience do you have in your field?",
    type: 'choice',
    options: ["1-2 years", "3-5 years", "5-10 years", "10+ years"],
    field: 'experience'
  },
  {
    id: 'bio',
    text: "Tell us a bit about yourself and your services. This will be shown on your profile.",
    type: 'text',
    field: 'bio',
    placeholder: 'I am a professional...'
  },
  {
    id: 'location',
    text: "Finally, where are you located? This helps us show your services to nearby customers.",
    type: 'text',
    field: 'location',
    placeholder: 'City, Country'
  }
];

const DEFAULT_CUSTOMER_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'welcome',
    text: "Welcome to Vesta! Help us personalize your experience. Ready to start?",
    type: 'choice',
    options: ["Yes, let's go!", "Skip for now"],
    field: 'welcome'
  },
  {
    id: 'interest',
    text: "Which services are you most interested in?",
    type: 'choice',
    options: ["Cleaning", "Maintenance", "Beauty", "Photography"],
    field: 'interest'
  },
  {
    id: 'frequency',
    text: "How often do you typically need home services?",
    type: 'choice',
    options: ["Weekly", "Monthly", "Occasionally"],
    field: 'frequency'
  }
];

export const seedOnboardingData = async () => {
  try {
    await onboardingService.updateQuestions('provider', DEFAULT_PROVIDER_QUESTIONS);
    await onboardingService.updateQuestions('customer', DEFAULT_CUSTOMER_QUESTIONS);
    console.log("Onboarding data seeded successfully!");
  } catch (error) {
    console.error("Error seeding onboarding data:", error);
  }
};
