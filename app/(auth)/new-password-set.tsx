import { IMAGE } from '@/assets/images/image.index'
import PasswordInput from '@/components/PasswordInput'
import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import Button from '@/components/ui/button'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native'

export default function NewPasswordSet() {
  const router = useRouter()
  const { width, height } = useWindowDimensions()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

  const validate = () => {
    let valid = true
    setNewPasswordError('')
    setConfirmPasswordError('')

    if (!newPassword || newPassword.length < 8) {
      setNewPasswordError('Password must be at least 8 characters')
      valid = false
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
      valid = false
    }

    return valid
  }

  const handleUpdatePassword = () => {
    Keyboard.dismiss()
    if (!validate()) return

    // 🔐 API call goes here
    console.log('Password updated:', newPassword)
    router.push('/(auth)/login') // redirect after update
  }

  return (
    <SafeAreaViewWithSpacing>
      <StatusBar style="dark" />

      <KeyboardAvoider
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
        style={{ flex: 1 }}
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
          >
            {/* Header */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>Set New Password</Text>
              <Text style={styles.subtitle}>
                Create a new password for your account to continue securely.
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <PasswordInput
                label="New Password"
                placeholder="••••••••"
                value={newPassword}
                onChangeText={setNewPassword}
                error={newPasswordError}
                returnKeyType="next"
              />
              <PasswordInput
                label="Confirm New Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPasswordError}
                returnKeyType="done"
                onSubmitEditing={handleUpdatePassword}
              />
              <Button
                title="Update Password"
                onPress={handleUpdatePassword}
                disabled={!newPassword || !confirmPassword}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoider>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: -1,
    opacity: 0.2,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  headerSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#1F2937',
    marginBottom: 12,
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
})
