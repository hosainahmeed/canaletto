import { useGetConsructionStatusQuery } from '@/app/redux/services/constructionApis'
import { IMAGE } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useCallback, useEffect } from 'react'
import { Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native'
import Animated, {
  Easing,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const { width } = Dimensions.get('window')
const TARGET_PROGRESS = 68

export interface ConstructionData {
  id: string;
  propertyId: string;
  planning: string;
  foundation: string;
  structure: string;
  roofing: string;
  finishing: string;
  completed: string;
  progressPercentage: number;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
  computedProgress: number;
}

export default function Construction() {
  const router = useRouter()
  const { id } = useLocalSearchParams()

  const { data, isLoading, refetch } = useGetConsructionStatusQuery(id as string, { skip: !id })
  const constructionDatas: ConstructionData = React.useMemo(() => data?.data || {} as ConstructionData, [data?.data]);
  const constructionData = [
    { title: 'Planning', description: 'Architecture and approvals', status: constructionDatas?.planning || "N/A" },
    { title: 'Foundation', description: 'Piling and base structure', status: constructionDatas?.foundation || "N/A" },
    { title: 'Structure', description: 'Main building construction', status: constructionDatas?.structure || "N/A" },
    { title: 'Utilities', description: 'Electrical, plumbing, HVAC', status: constructionDatas?.roofing || "N/A" },
    { title: 'Finishing', description: 'Tiles, paint, fittings', status: constructionDatas?.finishing || "N/A" },
    { title: 'Handover', description: 'Final inspection & delivery', status: constructionDatas?.completed || "N/A" },
  ]

  /** Progress animation */
  const progress = useSharedValue(0)
  const progressText = useSharedValue(0)
  const actualProgress = React.useMemo(() => constructionDatas?.progressPercentage || 0, [constructionDatas?.progressPercentage])

  useEffect(() => {
    // Reset to 0 first, then animate to actual progress
    progress.value = 0
    progressText.value = 0

    // Animate to actual progress after a short delay
    setTimeout(() => {
      progress.value = withTiming(actualProgress, {
        duration: 1600,
        easing: Easing.out(Easing.cubic),
      })

      progressText.value = withTiming(actualProgress, {
        duration: 1600,
        easing: Easing.out(Easing.cubic),
      })
    }, 100)
  }, [actualProgress, data])

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }))

  const progressTextStyle = useAnimatedStyle(() => ({
    opacity: 1,
  }))

  const renderItem = useCallback(({ item, index }: any) => {
    const statusColor =
      item.status === 'COMPLETED'
        ? '#22C55E'
        : item.status === 'UPCOMING'
          ? '#A855F7'
          : '#3B82F6'

    return (
      <Animated.View entering={FadeInUp.delay(index * 60)}>
        <Card style={styles.stageCard}>
          <View>
            <Text style={styles.stageTitle}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.description}</Text>
          </View>

          <Text style={[styles.statusText, { color: statusColor }]}>
            {item.status}
          </Text>
        </Card>
      </Animated.View>
    )
  }, [data?.data])

  return (
    <SafeAreaViewWithSpacing>
      <BackHeaderButton
        title="Construction Progress"
        titleFontWeight={800}
        titleFontFamily="Montserrat-Italic"
        titleStyle={{ fontStyle: 'italic' }}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />

      <FlatList
        data={constructionData}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#D4B785"
            colors={["#D4B785"]}
          />
        }
        ListHeaderComponent={
          <Card style={styles.headerCard}>
            <View style={styles.constructionHeader}>
              <Image source={IMAGE.construction} style={styles.constructionImage} />
              <View>
                <Text style={styles.headerTitle}>Your Construction Progress</Text>
                <Text style={styles.subtitle}>
                  {constructionDatas?.endDate ? `Estimated Completion • ${new Date(constructionDatas.endDate).toLocaleDateString()}` : 'Estimated Completion • TBD'}
                </Text>
              </View>
            </View>

            <View style={styles.progressRow}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, progressStyle]} />
              </View>

              <Animated.Text style={[styles.metaValue, progressTextStyle]}>
                {Math.round(actualProgress)}%
              </Animated.Text>
            </View>
          </Card>
        }
        ListFooterComponent={
          <>
            <HelpSection />
            <View style={{ height: 32 }} />
          </>
        }
      />
    </SafeAreaViewWithSpacing>
  )
}
const styles = StyleSheet.create({
  headerCard: {
    width: width - 20,
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 12,
    padding: 20,
    gap: 16,
  },
  stageCard: {
    width: width - 20,
    alignSelf: 'center',
    borderRadius: 12,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  constructionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  constructionImage: {
    width: 48,
    height: 48,
  },
  headerTitle: {
    fontSize: 18,
    color: '#111827',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  stageTitle: {
    fontSize: 16,
    color: '#111827',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Montserrat-Italic',
    marginTop: 2,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressTrack: {
    flex: 1,
    height: 12,
    backgroundColor: 'rgba(212, 183, 133, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4B785',
    borderRadius: 12,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#B08D59',
    minWidth: 44,
    textAlign: 'right',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontFamily: 'Montserrat-SemiBoldItalic',
  },
})
