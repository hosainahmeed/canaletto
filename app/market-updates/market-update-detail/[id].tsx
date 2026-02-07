import { IMAGE } from '@/assets/images/image.index'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import InsightsDownSection from '@/components/share/InsightsDownSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native'

const { width, height } = Dimensions.get('window')
const IMAGE_HEIGHT = Math.min(height * 0.3, 250)
export default function MarketUpdateDetail({ id }: { id: string }) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const propertyData = {
    name: 'Dubai Property Market Shows Strong Q1 Growth',
    image: [
      'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg',
      'https://dubaiproperties.org.in/wp-content/uploads/2023/01/luxury-property-in-dubai-scaled.jpg',
    ],
    description: "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum",
  }



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
          title="Market Update"
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
            data={propertyData.image}
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
          {propertyData.image.length > 1 && (
            <View style={styles.paginationContainer}>
              {propertyData.image.map((_, index) => (
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

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.title}>{propertyData.name}</Text>
        </View>
        <View style={styles.descriptionWrapper}>
          <Text numberOfLines={2} style={styles.descriptionStyle}>{propertyData.description}</Text>
        </View>
        <InsightsDownSection icon={IMAGE.market_icon} title="Market Updates" description="Posted on 14 January 2028" />
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