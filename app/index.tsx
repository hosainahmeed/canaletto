import OnboardingScreen from '@/components/screens/Onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';

export default function Index() {
  const { loginUser } = useAuth();

  // Show onboarding screen for first-time users
  if (!loginUser) {
    return <OnboardingScreen />;
  }

  // Redirect to authenticated tabs
  return <Redirect href="/(tabs)" />;
}
