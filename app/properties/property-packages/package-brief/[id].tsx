import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

const { width } = Dimensions.get('window')

const fontSize = {
  small: 12,
  medium: 14,
  base: 16,
  large: 18,
  xl: 20,
}

const color = {
  text: "#B0B0B0",
  textSecondary: "#666666",
}

export default function PackageBrief() {
  const router = useRouter()
  const { t } = useTranslation()
  const data = {
    packageName: 'Essential Support',
    registeredOfficeAddress: `We find the right people so you don't have to. From professional listings to deep-dive tenant screening, this package focuses exclusively on securing a qualified lease. It’s the perfect solution for owners who want a professional start but prefer to handle day-to-day management themselves.`,

  }
  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title={t('page_title.package_brief')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() => {
          if (router.canGoBack()) router.back()
          else router.replace('/')
        }}
      />
      <View style={{ width: width - 20, marginHorizontal: 'auto' }}>
        <Card>
          <Text style={{ fontWeight: 'bold', fontSize: fontSize.small, color: color.text, fontFamily: "Nunito-MediumItalic" }}>Package Name</Text>
          <Text style={{ fontSize: fontSize.medium, color: color.textSecondary, fontFamily: "Nunito-MediumItalic" }}>{data.packageName}</Text>

        </Card>
        <Card style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: 'bold', fontSize: fontSize.small, color: color.text, fontFamily: "Nunito-MediumItalic" }}>Registered Office Address</Text>
          <Text style={{ fontSize: fontSize.medium, color: color.textSecondary, fontFamily: "Nunito-MediumItalic" }}>{data.registeredOfficeAddress}</Text>
        </Card>
      </View>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({})