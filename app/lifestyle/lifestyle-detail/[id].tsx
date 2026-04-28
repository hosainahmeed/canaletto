import { useGetLifestyleByIdQuery } from '@/app/redux/services/lifestyleApis'
import { IMAGE } from '@/assets/images/image.index'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import InsightsDownSection from '@/components/share/InsightsDownSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { lifestyleTypes } from '@/types/lifestyleTypes'
import { formatDate } from '@/utils/dateUtils'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Dimensions, FlatList, Linking, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native'
import RenderHTML from 'react-native-render-html'

const { width, height } = Dimensions.get('window')
const IMAGE_HEIGHT = Math.min(height * 0.3, 250)
export default function LifestyleDetail() {
  const router = useRouter()
  const { id } = useLocalSearchParams() as { id: string }
  const { data: lifestyleData } = useGetLifestyleByIdQuery(id, { skip: !id })
  const lifestyleDetails: lifestyleTypes = useMemo(() => lifestyleData?.data, [])
  const { t } = useTranslation()

  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)


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
          title={t('page_title.lifestyle')}
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
            data={lifestyleDetails?.images || []}
            renderItem={renderImageItem}
            keyExtractor={(item, index) => `image-${index}`}
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
          {lifestyleDetails?.images?.length > 1 && (
            <View style={styles.paginationContainer}>
              {lifestyleDetails?.images?.map((_, index) => (
                <View
                  key={`dot-${index}`}
                  style={[
                    styles.paginationDot,
                    index === activeImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>
        <View style={{ paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ backgroundColor: "rgba(212, 183, 133, 0.4)", padding: 8, borderRadius: 8, marginBottom: 16, width: "30%", justifyContent: "center", alignContent: "center", marginTop: 12 }}>
            <Text style={{ fontSize: 12, fontFamily: "Montserrat-SemiBoldItalic", fontWeight: '600', color: "#d4b785ff", textAlign: "center" }}>{lifestyleDetails?.type}</Text>
          </View>
          {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Ionicons name='star' size={20} color="#FE9A00" />
            <Text style={{ fontSize: 16, fontFamily: "Montserrat-SemiBold", fontWeight: '600', color: "#FE9A00" }}>{lifestyleDetails?.id}</Text>
          </View> */}
        </View>

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>{lifestyleDetails?.title}</Text>
          <Text numberOfLines={2} style={styles.rowValue}>{lifestyleDetails?.location}</Text>
        </View>

        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>About</Text>
        </View>
        <View style={styles.titleWrapper}>
          <RenderHTML source={{ html: lifestyleDetails?.description || '' }} />
        </View>
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>Good to Know</Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {
            lifestyleDetails?.goodToKnow?.map((item: string, index: number) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Image source={IMAGE.check} style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={styles.propertyDescription}>{item}</Text>
              </View>
            ))
          }
        </View>
        <HelpSection title="Interested in visiting or booking?" description="Visit their official Site for more details." icon={IMAGE.share_icon} onPress={() => Linking.openURL(lifestyleDetails?.website || '')} />
        <InsightsDownSection titleColor='#B08D59' icon={IMAGE.lifestyle_icon} title={t('page_title.lifestyle')} description={`Posted on ${formatDate(lifestyleDetails?.createdAt)}`} onPress={() => { }} />
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

    </SafeAreaViewWithSpacing >
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
  titleWrapper: {
    paddingHorizontal: 12,
    marginVertical: 4
  },

  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontStyle: 'italic',
  },
  propertyDescription: {
    fontSize: 12,
    color: '#111',
    fontFamily: 'Montserrat-Regular',
  },

  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#B0B0B0',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 24,
  },
}) 