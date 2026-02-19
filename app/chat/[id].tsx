import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import ChatInterface from '@/components/screens/chat_interface'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'expo-router'
import React from 'react'

export default function Chat({ id }: { id: string }) {
  const { loginUser } = useAuth()
  const router = useRouter()

  // if (!loginUser) {
  //   return <Redirect href="/(auth)/login" />
  // }

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
      <ChatInterface />
    </SafeAreaViewWithSpacing>
  )
}