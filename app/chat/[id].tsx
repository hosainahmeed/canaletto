import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import ChatInterface from '@/components/screens/chat_interface'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React from 'react'

export default function Chat() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  if (!id) {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/')
    }
    return null
  }
  /*
  {
      "success": true,
      "statusCode": 200,
      "message": "Chat messages retrieved successfully",
      "meta": {
          "page": 1,
          "limit": 20,
          "total": 0,
          "totalPages": 0
      },
      "data": []
  }
  */
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