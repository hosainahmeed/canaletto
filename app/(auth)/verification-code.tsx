import { IMAGE } from '@/assets/images/image.index'
import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { OtpInput } from 'react-native-otp-entry'

const { width, height } = Dimensions.get('window')

export default function VerificationCode() {
  const router = useRouter()
  const [otpCode, setOtpCode] = useState('')
  const [resendTimer, setResendTimer] = useState(30)

  /* --------------- Timer Logic --------------- */
  useEffect(() => {
    if (resendTimer === 0) return
    const interval = setInterval(() => setResendTimer(prev => prev - 1), 1000)
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleVerify = () => {
    if (otpCode.length === 6) {
      console.log('Entered OTP:', otpCode)
      router.push('/new-password-set')
    }
  }

  const handleResend = () => {
    setResendTimer(30)
    setOtpCode('')
  }
  const handleBackToLogin = () => {
    router.push('/(auth)/login')
  }
  return (
    <SafeAreaViewWithSpacing>
      <StatusBar style="dark" />
      <View style={{ position: "relative", flex: 1 }}>
        <View style={[styles.backgroundContainer, { width, height }]}>
          <Image
            source={IMAGE.bursar}
            style={{ width, height }}
            contentFit="contain"
            priority="high"
          />
        </View>

        <KeyboardAvoider
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            <View style={styles.container}>
              {/* Header */}
              <Text style={styles.title}>Verify Your OTP</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit verification code sent to your email address.
              </Text>

              {/* OTP Input */}
              <View style={styles.otpWrapper}>
                <OtpInput
                  numberOfDigits={6}
                  focusColor="#D4B785"
                  type="numeric"
                  autoFocus
                  onTextChange={setOtpCode}
                  placeholder="______"
                />
              </View>

              {/* Resend Timer */}
              <View style={styles.resendRow}>
                <Text style={styles.resendLabel}>Didn’t receive the code?</Text>
                {resendTimer > 0 ? (
                  <Text style={styles.timer}>
                    Resend in 00:{resendTimer.toString().padStart(2, '0')}
                  </Text>
                ) : (
                  <Pressable onPress={handleResend}>
                    <Text style={styles.resendAction}>Resend</Text>
                  </Pressable>
                )}
              </View>

              {/* Verify Button */}
              <Pressable
                onPress={handleVerify}
                style={[styles.button, otpCode.length < 6 && styles.buttonDisabled]}
                disabled={otpCode.length < 6}
              >
                <Text style={styles.buttonText}>Verify Code</Text>
              </Pressable>
              <Text
                style={{
                  marginTop: 12,
                  alignSelf: "flex-end",
                  fontSize: 16,
                  color: '#3B82F6',
                  fontWeight: '500',
                }}
                onPress={() => {
                  handleBackToLogin()
                }}>Back to Login</Text>
            </View>
          </ScrollView>
        </KeyboardAvoider>
      </View>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: "transparent",
    opacity: 0.6,
    pointerEvents: 'none',
  },
  keyboardView: {
    flex: 1,
    position: 'relative',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    width: width - 20,
    marginHorizontal: "auto",
    paddingTop: 40,
    paddingBottom: Platform.OS === 'android' ? 20 : 0,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 32,
  },
  otpWrapper: {
    alignItems: 'center',
    marginBottom: 32,
  },
  otp: {},
  resendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  resendLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  timer: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  resendAction: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#D4A574',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
})
