import KeyboardAvoider from '@/components/safe-area/KeyboardAvoider'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import ChatInterface from '@/components/screens/chat_interface'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Platform, StyleSheet } from 'react-native'
import { useChatContext } from '../context/ChatContext'

export default function Chat() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { joinTicketRoom, markSeen } = useChatContext()
  useEffect(() => {
    if (id) {
      joinTicketRoom(id as string)
      markSeen(id as string)
    }
  }, [id])

  if (!id) {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
    return null
  }
  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.TOP]}>

      <BackHeaderButton
        onPress={() => {
          if (router.canGoBack()) {
            router.back()
          } else {
            router.replace('/')
          }
        }}
        titleFontWeight={800}
        titleFontFamily='Montserrat-Italic'
        titleStyle={{ fontStyle: 'italic', fontFamily: 'Montserrat-Italic' }}
        title="CSW Support"
      />
      <KeyboardAvoider
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 32 : 0}
        style={styles.keyboardView}
      >
        <ChatInterface />
      </KeyboardAvoider>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    position: 'relative',
  },
})

