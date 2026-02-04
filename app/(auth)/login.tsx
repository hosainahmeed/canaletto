import { IMAGE } from '@/assets/images/image.index';
import Checkbox from '@/components/Checkbox';
import CustomInput from '@/components/CustomInput';
import PasswordInput from '@/components/PasswordInput';
import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider';
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('hosaindev6@gmail.com');
  const [password, setPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { width, height } = useWindowDimensions();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const router = useRouter()
  const handleLogin = () => {
    // Dismiss keyboard
    Keyboard.dismiss();

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    }

    if (isValid) {
      console.log('Login:', { email, password, rememberMe });
      // Handle login logic
      router.push("/(tabs)")
    }
  };

  const handleForgotPassword = async () => {
    console.log('Forgot password');
    Keyboard.dismiss()
    router.push("/(auth)/forgot-password")
    // Navigate to forgot password screen
  };

  return (
    <SafeAreaViewWithSpacing>
      <StatusBar style="dark" />

      <KeyboardAvoider
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
        style={styles.keyboardView}
      >
        {/* Background Image */}
        <View style={[styles.backgroundImageContainer, { width, height }]}>
          <Image
            source={IMAGE.bursar}
            style={{ width, height }}
            contentFit="contain"
            priority="high"
          />
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Access your property details, updates, and investment insights securely.
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {/* Email Input */}
              <CustomInput
                label="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={emailError}
                returnKeyType="next"
              />

              {/* Password Input */}
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                error={passwordError}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />

              {/* Remember Me & Forgot Password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.7}
                >
                  <Checkbox
                    checked={rememberMe}
                    onPress={() => setRememberMe(!rememberMe)}
                  />
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={[styles.loginButton, { opacity: !rememberMe ? 0.7 : 1 }]}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={!rememberMe}
              >
                <Text style={styles.loginButtonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoider>
    </SafeAreaViewWithSpacing>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
    position: 'relative',
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "transparent",
    pointerEvents: 'none',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginTop: 8,
  },
  formSection: {
    width: '100%',
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberMeText: {
    fontSize: 16,
    color: '#374151',
    marginLeft: 8,
  },
  forgotPasswordText: {
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#D4A574',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#D4A574',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});