import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterHeader from '@/components/share/FilterHeader'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
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
  }
]

export default function NewProjects() {
  const router = useRouter()

  const renderItem = ({ item }: any) => (
    <GradientCard
      iconType='pink'
      color={['#A855F780', '#FAFAFA', '#FAFAFA']}
      title={item.title}
      subTitle={item.subTitle}
      onPress={() => router.push(`/new-projects/new-project-detail/${item.id}`)}
    />
  )

  const renderHeader = () => (
    <FilterHeader filterOptions={[
      { label: 'New Launch', value: 'newLaunch' },
      { label: 'Upcoming Launch', value: 'upcomingLaunch' },
      { label: 'Available to Reserve', value: 'availableToReserve' },
    ]} />
  )

  const renderEmpty = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No data found</Text>
    </View>
  )


  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP, SafeAreaEdge.LEFT, SafeAreaEdge.RIGHT]}>
      <BackHeaderButton
        title="New Projects"
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
