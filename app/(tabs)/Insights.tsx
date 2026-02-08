import { InsightsIcons } from '@/assets/images/image.index'
import InsightsCard from '@/components/cards/InsightsCard'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, StyleSheet } from 'react-native'
const { width: screenWidth } = Dimensions.get('window')
export default function Insights() {
  const router = useRouter()
  const { t } = useTranslation()
  const insights = [
    {
      title: t('page_title.market_updates'),
      icon: InsightsIcons.market_updates,
      color: '#3B82F6',
      bgColor: 'rgba(59, 130, 246, 0.2)',
      onPress: () => router.push('/market-updates')
    },
    {
      title: t('insights.legal_updates'),
      icon: InsightsIcons.legal_updates,
      color: '#22C55E',
      bgColor: 'rgba(34, 197, 94, 0.2)',
      onPress: () => router.push('/legal-updates')
    },
    {
      title: t('insights.lifestyle'),
      icon: InsightsIcons.lifestyle,
      color: '#B08D5980',
      bgColor: 'rgba(176, 141, 89, 0.2)',
      onPress: () => router.push('/lifestyle')
    },
    {
      title: t('insights.new_projects'),
      icon: InsightsIcons.new_projects,
      color: '#a955f7ff',
      bgColor: 'rgba(168, 85, 247, 0.2)',
      onPress: () => router.push('/new-projects')
    },

  ]
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
        title={t('page_title.insights')}
      />
      <FlatList
        data={insights}
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 8,
          marginVertical: 8,
        }}
        renderItem={({ item }) => (
          <InsightsCard onPress={item.onPress} title={item.title} icon={item.icon} color={item.color} bgColor={item.bgColor} />
        )}
        contentContainerStyle={{ width: screenWidth - 20, marginHorizontal: "auto" }}
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({})