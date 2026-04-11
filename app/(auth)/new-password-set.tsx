import { IMAGE } from '@/assets/images/image.index'
import PasswordInput from '@/components/PasswordInput'
import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import { useToast } from '@/components/toast/useToast'
import Button, { ButtonSize } from '@/components/ui/button'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { useResetPasswordMutation } from '../redux/services/authApis'

export default function NewPasswordSet() {
  const router = useRouter()
  const { width, height } = useWindowDimensions()
  const { t } = useTranslation()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const { email } = useLocalSearchParams<{ email?: string }>();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation()
  const toast = useToast()
  const validate = () => {
    let valid = true
    setNewPasswordError('')
    setConfirmPasswordError('')

    if (!newPassword || newPassword.length < 8) {
      setNewPasswordError(t('new_password_set.password_must_be_at_least_8_characters'))
      valid = false
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(t('new_password_set.passwords_do_not_match'))
      valid = false
    }

    return valid
  }

  const handleUpdatePassword = async () => {
    try {
      Keyboard.dismiss()
      if (!validate()) return
      if (!email) {
        throw new Error('Email is required')
      }
      const resetPasswordPayload = {
        email,
        password: newPassword,
        confirmPassword
      }

      const response = await resetPassword(resetPasswordPayload).unwrap()
      if (!response?.success) {
        throw new Error(response?.message || 'Failed to reset password')
      }
      toast.success(response?.message || 'Password reset successfully')

      router.push({
        pathname: '/(auth)/login',
        params: { email: email || '' }
      })
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || 'Failed to reset password'
      toast.error(errorMessage)
    }
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
              <Text style={styles.title}>{t('new_password_set.title')}</Text>
              <Text style={styles.subtitle}>
                {t('new_password_set.subtitle')}
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formSection}>
              <PasswordInput
                label={t('new_password_set.new_password')}
                placeholder="••••••••"
                value={newPassword}
                onChangeText={setNewPassword}
                error={newPasswordError}
                returnKeyType="next"
              />
              <PasswordInput
                label={t('new_password_set.confirm_new_password')}
                placeholder="••••••••"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPasswordError}
                returnKeyType="done"
                onSubmitEditing={handleUpdatePassword}
              />
              <Text
                style={{
                  marginTop: 12,
                  alignSelf: "flex-end",
                  fontSize: 14,
                  color: '#3B82F6',
                  fontWeight: '500',
                  marginBottom: 10
                }}
                onPress={() => {
                  router.push('/(auth)/login')
                }}>{t('action.back_to_login')}</Text>
              <Button
                title={t('new_password_set.update_password')}
                onPress={handleUpdatePassword}
                size={ButtonSize.LARGE}
                disabled={!newPassword || !confirmPassword}
                loading={isResettingPassword}
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
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 8,
  },
  formSection: {
    width: '100%',
  },
})
