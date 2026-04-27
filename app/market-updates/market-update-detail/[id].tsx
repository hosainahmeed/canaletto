import { useGetMarketUpdateByIdQuery } from '@/app/redux/services/marketUpdateApis'
import { IMAGE } from '@/assets/images/image.index'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import InsightsDownSection from '@/components/share/InsightsDownSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { MarketUpdateType } from '@/types/marketUpdateType'
import { formatDate } from '@/utils/dateUtils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native'
import RenderHTML from 'react-native-render-html'

const { width, height } = Dimensions.get('window')
const IMAGE_HEIGHT = Math.min(height * 0.3, 250)
export default function MarketUpdateDetail() {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const { id } = useLocalSearchParams<{ id: string }>()
  const flatListRef = useRef<FlatList>(null)
  const { t } = useTranslation()
  const { data: marketUpdate } = useGetMarketUpdateByIdQuery(id, { skip: !id })
  const propertyData: MarketUpdateType = useMemo(() => marketUpdate?.data, [marketUpdate])




  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x
    const currentIndex = Math.round(contentOffsetX / width)
    setActiveImageIndex(currentIndex)
  }

  const renderImageItem = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: item }}
        style={styles.heroImage}
        contentFit="cover"
        transition={300}
      />
    </View>
  )

  return (
    <SafeAreaViewWithSpacing>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BackHeaderButton
          title={t('page_title.market_updates')}
          titleFontWeight={800}
          titleFontFamily="Montserrat-Italic"
          titleStyle={{ fontStyle: 'italic' }}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace('/')
          }
        />

        {/* Image Carousel */}
        <View style={styles.carouselWrapper}>
          <FlatList
            ref={flatListRef}
            data={propertyData?.images}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `${item}-${propertyData?.id}-image-${index}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            snapToInterval={width}
            decelerationRate="fast"
            bounces={false}
          />

          {/* Pagination Dots */}
          {propertyData?.images?.length > 1 && (
            <View style={styles?.paginationContainer}>
              {propertyData?.images.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles?.paginationDot,
                    index === activeImageIndex && styles?.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.title}>{propertyData?.title}</Text>
        </View>
        <View style={styles.descriptionWrapper}>
          <RenderHTML source={{ html: propertyData?.description }} />
        </View>
        <InsightsDownSection icon={IMAGE?.market_icon} title={t('page_title.market_updates')} description={`Posted on ${formatDate(propertyData?.createdAt)}`} />
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaViewWithSpacing>
  )
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
  },

  carouselWrapper: {
    width,
    height: IMAGE_HEIGHT,
    position: 'relative',
  },

  imageContainer: {
    width,
    height: IMAGE_HEIGHT,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  paginationDotActive: {
    backgroundColor: '#fff',
    width: 24,
  },

  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },

  titleWrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
  },
  descriptionWrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontStyle: 'italic',
  },
  descriptionStyle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    fontFamily: 'Nunito-Regular',
  },

  bottomSpacing: {
    height: 24,
  },
})