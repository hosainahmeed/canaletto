import SplashScreen from '@/components/SplahScreen';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';
import { AuthProvider } from '../contexts/AuthContext';
import '../lib/i18n';
import { updateLanguageFromSecureStore } from '../lib/i18n';
import GlobalContextProvider from './providers/GlobalContextProvider';
export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    updateLanguageFromSecureStore();
  }, []);

  if (!isReady) {
    return <SplashScreen setIsReady={setIsReady} />;
  }

  return (
    <AuthProvider>
      <GestureHandlerRootView>
        <KeyboardProvider>
          <GlobalContextProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal' }}
              />
            </Stack>
            <StatusBar style="auto" />
          </GlobalContextProvider>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </AuthProvider>
  );
}
