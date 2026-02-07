import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import EmptyCard from '@/components/share/EmptyCard'
import FilterHeader from '@/components/share/FilterHeader'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

const DATA: any[] = [
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
]

export default function Lifestyle() {
  const router = useRouter()

  const renderItem = ({ item }: any) => (
    <GradientCard
      iconType='brand'
      color={['#B08D5980', '#FAFAFA', '#FAFAFA']}
      title={item.title}
      subTitle={item.subTitle}
      onPress={() => router.push(`/lifestyle/lifestyle-detail/${item.id}` as any)}
    />
  )

  const renderHeader = () => (
    <FilterHeader filterOptions={[
      { label: 'Hotels', value: 'hotels' },
      { label: 'Resorts', value: 'resorts' },
      { label: 'Beach & Waterfront', value: 'beach' },
      { label: 'Dining & Cafés', value: 'dining' },
      { label: 'Shopping & Entertainment', value: 'shopping' },
      { label: 'City Guides', value: 'guides' },
    ]} />
  )

  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP, SafeAreaEdge.LEFT, SafeAreaEdge.RIGHT]}>
      <BackHeaderButton
        title="Lifestyle"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
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
        ListEmptyComponent={<EmptyCard color='#B08D5980' title="No item's Found" />}
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
