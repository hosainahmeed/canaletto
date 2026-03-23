import GradientCard from '@/components/cards/GradientCard'
import SafeAreaViewWithSpacing, { SafeAreaEdge } from '@/components/safe-area/SafeAreaViewWithSpacing'
import FilterHeader from '@/components/share/FilterHeader'
import ShimmerEffect from '@/components/shimmer/ShimmerEffect'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { useRouter } from 'expo-router'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import { useGetAlProjectQuery } from '../redux/services/projectApis'
const { width } = Dimensions.get('window')

export default function NewProjects() {
  const router = useRouter()
  const { t } = useTranslation()
  const { data, isLoading } = useGetAlProjectQuery(undefined)

  const renderLoading = () => (
    <ShimmerEffect style={styles.cardShimmer}>
      <View style={styles.shimmerIcon} />
      <View style={styles.shimmerTextContainer}>
        <View style={styles.shimmerTitle} />
        <View style={styles.shimmerSubtitle} />
      </View>
    </ShimmerEffect>
  )

  const renderItem = (isLoading: boolean) => ({ item }: any) => (
    isLoading ? renderLoading() : <GradientCard
      iconType='pink'
      color={['#A855F780', '#FAFAFA', '#FAFAFA']}
      title={item.title}
      subTitle="Latest Insights"
      onPress={() => router.push(`/new-projects/new-project-detail/${item.id}`)}
    />
  )

  const renderHeader = (isLoading: boolean) => (
    isLoading ? (
      <ShimmerEffect style={styles.headerShimmer}>
        <View style={styles.headerShimmerContent}>
          <View style={styles.filterButtonShimmer} />
          <View style={styles.filterButtonShimmer} />
          <View style={[styles.filterButtonShimmer, { width: 100 }]} />
        </View>
      </ShimmerEffect>
    ) : (
      <FilterHeader filterOptions={[
        { label: 'New Launch', value: 'newLaunch' },
        { label: 'Upcoming Launch', value: 'upcomingLaunch' },
        { label: 'Available to Reserve', value: 'availableToReserve' },
      ]} />
    )
  )

  const renderEmpty = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>No data found</Text>
    </View>
  )


  return (
    <SafeAreaViewWithSpacing edges={[SafeAreaEdge.BOTTOM, SafeAreaEdge.TOP, SafeAreaEdge.LEFT, SafeAreaEdge.RIGHT]}>
      <BackHeaderButton
        title={t('page_title.new_projects')}
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() =>
          router.canGoBack() ? router.back() : router.replace('/')
        }
      />
      <FlatList
        data={data?.data || []}
        renderItem={renderItem(isLoading)}
        ListHeaderComponent={renderHeader(isLoading)}
        ListHeaderComponentStyle={{ marginBottom: 12 }}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        bounces
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={isLoading} />
        }
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
  // Enhanced shimmer styles
  cardShimmer: {
    width: width - 20,
    marginHorizontal: "auto",
    height: 120,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shimmerIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  shimmerTextContainer: {
    position: 'absolute',
    left: 72,
    top: 20,
    right: 16,
  },
  shimmerTitle: {
    height: 20,
    width: '70%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  shimmerSubtitle: {
    height: 14,
    width: '50%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  headerShimmer: {
    width: width - 20,
    marginHorizontal: "auto",
    height: 50,
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerShimmerContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButtonShimmer: {
    height: 26,
    width: 80,
    backgroundColor: '#e0e0e0',
    borderRadius: 13,
    marginRight: 8,
  },
})
