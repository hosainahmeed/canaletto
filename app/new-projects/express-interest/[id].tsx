import { useCreateInterestedClientMutation } from '@/app/redux/services/projectApis'
import { IMAGE, modalIcon } from '@/assets/images/image.index'
import CustomInput from '@/components/CustomInput'
import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import InsightsDownSection from '@/components/share/InsightsDownSection'
import MessageModal from '@/components/share/MessageModal'
import { useToast } from '@/components/toast/useToast'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import Button from '@/components/ui/button'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useState } from 'react'
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native'

const SPACING = 12
const createModalMessage = (
  title: string,
  message: string,
  confirmText = 'OK'
) => ({
  icon: <Image source={modalIcon.success} style={{ width: 60, height: 60 }} />,
  title,
  message,
  confirmText,
})

export default function ExpressInterest() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [createInterest] = useCreateInterestedClientMutation()
  const [modalMessage, setModalMessage] = useState<{
    icon: React.ReactNode
    title: string
    message: string
    confirmText: string
  } | null>(null)
  const toast = useToast()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const { id } = useLocalSearchParams() as { id: string }

  const validateForm = () => {
    if (!fullName.trim()) {
      return 'Please enter your full name.'
    }

    if (!email.trim()) {
      return 'Please enter your email address.'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.'
    }

    if (!phone.trim()) {
      return 'Please enter your phone or WhatsApp number.'
    }

    if (!message.trim()) {
      return 'Please enter a short message.'
    }

    return null
  }

  const handleSubmit = async () => {
    try {
      const error = validateForm()

      if (error) {
        setModalMessage(
          createModalMessage('Form Incomplete', error)
        )
        setIsVisible(true)
        return
      }

      const data = {
        projectId: id,
        name: fullName,
        email: email,
        phone: phone,
        message: message,
      }
      const response = await createInterest(data).unwrap()

      if (!response?.success) {
        throw new Error(response?.message || "")
      }


      toast.success(response?.message)
      setModalMessage(
        createModalMessage(
          'Thank you for your interest!',
          'Please allow 24 - 48 hours for your report to be prepared. You’ll be redirected to your profile shortly.',
          'Back to Projects'
        )
      )
      setEmail("")
      setFullName("")
      setPhone("")
      setMessage("")

      setIsVisible(true)
    } catch (error: any) {
      const errorMessage = error?.data?.message || error?.message || "Something went wrong while submit interest"
      toast.error(errorMessage)
    }
  }
  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]}>
      <BackHeaderButton
        title="Express Interest"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() => {
          router.canGoBack() ? router.back() : router.replace('/')
        }}
      />

      <KeyboardAvoider>
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <InsightsDownSection
            titleColor='#A855F7'
            icon={IMAGE.express_icon}
            title="Dubai Property Market Shows Strong"
            description="Abu Dhabi, Al Hudayriat Island"
          />

          <View style={styles.form}>
            <CustomInput
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
            />

            <CustomInput
              label="Email Address"
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Phone / WhatsApp"
              placeholder="Enter your contact number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Message"
              placeholder="Enter your short message if you have "
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
            />

            <Button
              title="Submit Interest"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
        <MessageModal
          visible={isVisible}
          onClose={() => setIsVisible(false)}
          onConfirm={() => setIsVisible(false)}
          actionType="success"
          message={{
            // icon: modalMessage?.icon || <Image source={modalIcon.success} style={{ width: 60, height: 60 }} />,
            title: modalMessage?.title || '',
            message: modalMessage?.message || '',
            confirmText: modalMessage?.confirmText || '',
          }}
        />
      </KeyboardAvoider>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING,
    paddingBottom: SPACING * 2,
  },
  form: {
    marginTop: SPACING,
    gap: SPACING,
  },
  messageInput: {
    height: 110,
  },
  submitButton: {
    marginTop: SPACING,
    borderRadius: 12,
  },
})