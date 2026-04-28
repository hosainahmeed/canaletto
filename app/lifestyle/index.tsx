import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import FilterHeader from '@/components/share/FilterHeader'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { lifestyleTypes } from '@/types/lifestyleTypes'
import { useRouter } from 'expo-router'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native'
import { useGetLifestyleQuery } from '../redux/services/lifestyleApis'


export default function Lifestyle() {
  const router = useRouter()
  const { t } = useTranslation()
  const [selectedFilter, setSelectedFilter] = React.useState<string>('')
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const { data: lifestyleData, isLoading, refetch } = useGetLifestyleQuery({ type: selectedFilter, searchTerm })
  const lifestyleItems: lifestyleTypes[] = useMemo(() => lifestyleData?.data || [], [lifestyleData])

  const renderItem = ({ item }: { item: lifestyleTypes }) => (
    <GradientCard
      iconType='brand'
      color={['#B08D5980', '#FAFAFA', '#FAFAFA']}
      title={item?.title}
      subTitle={t('page_title.lifestyle')}
      onPress={() => router.push(
        {
          pathname: '/lifestyle/lifestyle-detail/[id]',
          params: { id: item?.id } as { id: string }
        }
      )}
    />
  )

  const renderHeader = () => (
    <FilterHeader
      setSelected={(value) => setSelectedFilter(value)}
      onSearch={(v) => setSearchTerm(v)}
      filterOptions={[
        { label: t('filter.hotels'), value: 'HOTELS' },
        { label: t('filter.resorts'), value: 'RESORTS' },
        { label: t('filter.beach_waterfront'), value: 'BEACH_AND_WATERFRONT' },
        { label: t('filter.dining_cafes'), value: 'DINING_AND_CAFES' },
        { label: t('filter.shopping_entertainment'), value: 'SHOPPING_AND_ENTERTAINMENT' },
        { label: t('filter.city_guides'), value: 'CITY_GUIDES' },
        { label: t('filter.all'), value: '' },
      ]} />
  )

  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP, SafeAreaEdge.LEFT, SafeAreaEdge.RIGHT]}>
      <BackHeaderButton
        title={t('page_title.lifestyle')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />
      <FlatList
        data={lifestyleItems}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={<EmptyCard color='#B08D5980' title={t('message.no_data_found')} />}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={7}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => refetch()} />}
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
