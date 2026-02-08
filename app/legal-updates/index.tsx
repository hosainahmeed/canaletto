import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterHeader from '@/components/share/FilterHeader'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, StyleSheet, Text, View } from 'react-native'
const DATA = [
  {
    id: '1',
    title: 'Dubai Housing Market Rebounds to Q1 Growth',
    subTitle: 'Latest Insights',
  },
  {
    id: '2',
    title: 'UAE Property Market Expects Strong Q2 Growth',
    subTitle: 'Latest Insights',
  },
  {
    id: '3',
    title: 'Dubai Property Market Sees Strong Q3 Performance',
    subTitle: 'Latest Insights',
  },
  {
    id: '4',
    title: 'Dubai Property Prices Slip in June',
    subTitle: 'Latest Insights',
  },
  {
    id: '5',
    title: 'Dubai Property Market to Rebound in Q4',
    subTitle: 'Latest Insights',
  },
  {
    id: '6',
    title: 'UAE Property Market Remains Resilient in Q1',
    subTitle: 'Latest Insights',
  },
  {
    id: '7',
    title: 'Dubai Property Market Gains Momentum in Q2',
    subTitle: 'Latest Insights',
  },
  {
    id: '8',
    title: 'Dubai Property Market Hits Record Highs in Q3',
    subTitle: 'Latest Insights',
  },
  {
    id: '9',
    title: 'Dubai Property Prices Slip in Q4',
    subTitle: 'Latest Insights',
  },
  {
    id: '10',
    title: 'UAE Property Market Remains Strong in Q1 2023',
    subTitle: 'Latest Insights',
  },
]

export default function LegalUpdates() {
  const router = useRouter()
  const { t } = useTranslation()

  const renderItem = ({ item }: any) => (
    <GradientCard
      iconType='green'
      // color={['#4ADE8080', '#FAFAFA', '#FAFAFA']}
      title={item.title}
      subTitle={item.subTitle}
      onPress={() => router.push(`/legal-updates/legal-update-detail/${item.id}` as any)}
    />
  )

  const renderHeader = () => (
    <FilterHeader filterOptions={[
      { label: t('filter.last_24_hours'), value: '1d' },
      { label: t('filter.last_3_days'), value: '3d' },
      { label: t('filter.last_week'), value: '1w' },
      { label: t('filter.last_month'), value: '1m' },
    ]} />
  )

  const renderEmpty = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{t('message.no_data_found')}</Text>
    </View>
  )

  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP, SafeAreaEdge.LEFT, SafeAreaEdge.RIGHT]}>
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
        title={t('page_title.legal_updates')}
      />
      <FlatList
        data={DATA}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
      />
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  listContent: {
    marginTop: 12,
    paddingBottom: 24,
  },
  separator: {
    height: 12,
  },
})