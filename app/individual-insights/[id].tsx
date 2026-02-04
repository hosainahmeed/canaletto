import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet } from 'react-native'

export default function IndividualInsights({ pageTitle = "New Projects" }: { pageTitle: string }) {
  const router = useRouter()
  return (
    <SafeAreaViewWithSpacing>
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
        title={pageTitle}
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({})