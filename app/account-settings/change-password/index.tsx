import PasswordInput from '@/components/PasswordInput'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, useWindowDimensions, View } from 'react-native'

export default function ChangePassword() {
  const router = useRouter()
  const { t } = useTranslation()
  const { width } = useWindowDimensions()

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [oldPasswordError, setOldPasswordError] = useState('')
  const [newPasswordError, setNewPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')

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

  const handleUpdatePassword = () => {
    if (!validate()) return

    // 🔐 API call goes here
    console.log('Password updated')
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

        <Button
          title={t('action.update_password')}
          onPress={handleUpdatePassword}
          disabled={!oldPassword || !newPassword || !confirmPassword}
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

