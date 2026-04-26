import OnboardingScreen from '@/components/screens/Onboarding';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';
const { width, height } = Dimensions.get("window")
export default function Index() {
  const { loginUser, isLoading } = useAuth();
  // Show onboarding screen for first-time users
  if (isLoading) {
    return (
      <View style={styles.loaderScreen}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (!loginUser && !isLoading) {
    return <OnboardingScreen />;
  }

  // Redirect to authenticated tabs
  return <Redirect href="/(tabs)" />;
  // return <OnboardingScreen />;
}

const styles = StyleSheet.create({
  loaderScreen: {
    position: "fixed",
    top: 0,
    left: 0,
    width,
    height,
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
})
