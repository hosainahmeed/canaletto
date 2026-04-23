import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import ChatInterface from '@/components/screens/chat_interface'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { useChatContext } from '../context/ChatContext'

export default function Chat() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { joinTicketRoom } = useChatContext()
  useEffect(() => {
    if (id) {
      joinTicketRoom(id as string)
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
      <ChatInterface />
    </SafeAreaViewWithSpacing>
  )
}