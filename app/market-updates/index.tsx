import { IMAGE } from '@/assets/images/image.index'
import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import FilterHeader from '@/components/share/FilterHeader'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { MarketUpdateType } from '@/types/marketUpdateType'
import { useRouter } from 'expo-router'
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { useGetMarketUpdateQuery } from '../redux/services/marketUpdateApis'

export default function MarketUpdates() {
  const router = useRouter()
  const { t } = useTranslation()
  const [searchText, setSearchText] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('')
  const [limit, setLimit] = useState(8);
  const { data: marketUpdate, isLoading, refetch } = useGetMarketUpdateQuery({ searchTerm: searchText, type: selectedFilter, limit })

  const marketUpdateData: MarketUpdateType[] = useMemo(() => marketUpdate?.data || [], [marketUpdate])


  const renderItem = ({ item }: { item: MarketUpdateType }) => (
    <GradientCard
      iconType='blue'
      color={['#3B82F680', '#FAFAFA', '#FAFAFA']}
      title={item?.title}
      subTitle={t('page_title.latest_insights')}
      onPress={() => router.push({
        pathname: '/market-updates/market-update-detail/[id]',
        params: { id: item?.id }
      })}
    />
  )

  const renderHeader = () => (
    <FilterHeader
      onSearch={(text) => setSearchText(text)}
      setSelected={(value) => setSelectedFilter(value)}
      filterOptions={[
        { label: t('filter.market_news'), value: 'MARKET_NEWS' },
        { label: t('filter.property_price_updates'), value: 'PROPERTY_PRICE_UPDATES' },
        { label: t('filter.regulatory_legal_changes'), value: 'REGULATORY_AND_LEGAL_CHANGES' },
        { label: t('filter.investment_trends_data'), value: 'INVESTMENT_TRENDS_AND_DATA' },
        { label: t('filter.economic_updates'), value: 'ECONOMIC_UPDATES' },
        { label: t('filter.all'), value: '' },
      ]} />
  )

  const renderEmpty = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <EmptyCard
        title={t('message.no_data_found')}
        icon={IMAGE.empty}
        color='#B0B0B0'
      />
    </View>
  )


  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP, SafeAreaEdge.LEFT, SafeAreaEdge.RIGHT]}>
      <BackHeaderButton
        title={t('page_title.market_updates')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />
      <FlatList
        data={marketUpdateData}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        keyExtractor={(item) => item?.id || ''}
        showsVerticalScrollIndicator={false}
        bounces
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        onEndReached={() => setLimit(limit + 8)}
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
