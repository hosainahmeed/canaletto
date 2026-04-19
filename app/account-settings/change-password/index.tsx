import { useChangePasswordMutation } from '@/app/redux/services/authApis'
import PasswordInput from '@/components/PasswordInput'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import { useToast } from '@/components/toast/useToast'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'

export default function ChangePassword() {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowDimensions()
  const toast = useToast()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [oldPasswordError, setOldPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [changePassword, { isLoading, error }] = useChangePasswordMutation()
  const validate = () => {
    let valid = true

    setOldPasswordError('')
    setNewPasswordError('')
    setConfirmPasswordError('')

    if (!oldPassword) {
      setOldPasswordError('Old password is required')
      valid = false
    }

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

  const handleUpdatePassword = async () => {
    if (!validate()) return

    try {
      const payLoadData = {
        oldPassword,
        newPassword,
        confirmNewPassword: confirmPassword
      }
      const res = await changePassword(payLoadData).unwrap()
      if (!res?.success) {
        throw new Error(res?.message)
      }
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      toast.success(res?.message || 'Password changed successfully!')

      setTimeout(() => {
        router.back()
      }, 1500)
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to change password. Please try again.')
    }
  }

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('account_settings.change_password')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />

      <View style={[styles.container, { width: width - 20 }]}>
        <PasswordInput
          label={t('change_password.old_password')}
          placeholder="••••••••"
          value={oldPassword}
          onChangeText={setOldPassword}
          error={oldPasswordError}
          returnKeyType="next"
        />

        <PasswordInput
          label={t('change_password.new_password')}
          placeholder="••••••••"
          value={newPassword}
          onChangeText={setNewPassword}
          error={newPasswordError}
          returnKeyType="next"
        />

        <PasswordInput
          label={t('change_password.confirm_password')}
          placeholder="••••••••"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmPasswordError}
          returnKeyType="done"
          onSubmitEditing={handleUpdatePassword}
        />
        {error?.data?.message && <Text style={{ color: 'red', marginBottom: 4 }}>{error?.data?.message}</Text>}
        <Button
          title={t('action.update_password')}
          onPress={handleUpdatePassword}
          disabled={!oldPassword || !newPassword || !confirmPassword || isLoading}
          loading={isLoading}
        />
      </View>
    </SafeAreaViewWithSpacing>
  )
}
const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 12,
  },
})

