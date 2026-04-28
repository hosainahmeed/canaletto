import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterHeader from '@/components/share/FilterHeader'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { useGetLegalUpdateQuery } from '../redux/services/legalUpdateApis'

export default function LegalUpdates() {
  const router = useRouter()
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const [searchText, setSearchText] = useState('')
  const { data: legalUpdates, isLoading: isLegalUpdatesLoading, refetch } = useGetLegalUpdateQuery({ frame: filter, searchTerm: searchText })

  const legalUpdatesData = useMemo(() => legalUpdates?.data || [], [legalUpdates])

  const renderItem = ({ item }: any) => (
    <GradientCard
      iconType='green'
      // color={['#4ADE8080', '#FAFAFA', '#FAFAFA']}
      title={item?.title}
      subTitle={t('page_title.legal_updates')}
      onPress={() => router.push({
        pathname: '/legal-updates/legal-update-detail/[id]',
        params: {
          id: item?.id,
        },
      } as any)}
    />
  )

  const renderHeader = () => (
    <FilterHeader
      onSearch={(text) => setSearchText(text)}
      setSelected={(value) => setFilter(value)}
      filterOptions={[
        { label: t('filter.last_24_hours'), value: 'LAST_24_HOURS' },
        { label: t('filter.last_3_days'), value: 'LAST_3_DAYS' },
        { label: t('filter.last_week'), value: 'LAST_WEEK' },
        { label: t('filter.last_month'), value: 'LAST_MONTH' },
        { label: t('filter.all'), value: '' },
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
        data={legalUpdatesData}
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
        refreshControl={<RefreshControl refreshing={isLegalUpdatesLoading} onRefresh={refetch} />}
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