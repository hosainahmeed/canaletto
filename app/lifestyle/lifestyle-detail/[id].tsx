import { IMAGE } from '@/assets/images/image.index'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import InsightsDownSection from '@/components/share/InsightsDownSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, Text, View } from 'react-native'

const { width, height } = Dimensions.get('window')
const IMAGE_HEIGHT = Math.min(height * 0.3, 250)
export default function LifestyleDetail({ id }: { id: string }) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const propertyData = {
    id: '1',
    name: 'Azure Beach Club & Resort',
    size: '1000 sqft',
    rooms: 3,
    type_of_use: 'Residential',
    property_type: 'Villa',
    total_units: 5,
    status: 'Resorts',
    payment_plan: '10 Years',
    location: 'Abu Dhabi, Yas Island',
    rating: 4.5,
    to_know: [
      'Best Time to Visit',
      'Smart casual / Beachwear at pool area',
      'Yes, advance booking recommended',
    ],
    about: `
    Experience the epitome of luxury at Azure Beach Club & Resort, where pristine white sands meet crystal-clear waters. This exclusive beachfront destination offers world-class amenities, from infinity pools overlooking the Arabian Gulf to private cabanas with personalized service.

    Indulge in Mediterranean-inspired cuisine at our award-winning restaurant, unwind at the spa, or simply relax on our sun-drenched terraces. Whether you're seeking a romantic escape or a day of ultimate relaxation, Azure provides an unforgettable experience.
    `,
    image: [
      'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg',
      'https://dubaiproperties.org.in/wp-content/uploads/2023/01/luxury-property-in-dubai-scaled.jpg',
    ],
    lat: 24.4941,
    lng: 54.6077,
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
          title="New Projects"
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
        <View style={{ paddingHorizontal: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <View style={{ backgroundColor: "rgba(212, 183, 133, 0.4)", padding: 8, borderRadius: 8, marginBottom: 16, width: "30%", justifyContent: "center", alignContent: "center", marginTop: 12 }}>
            <Text style={{ fontSize: 12, fontFamily: "Montserrat-SemiBoldItalic", fontWeight: '600', color: "#d4b785ff", textAlign: "center" }}>{propertyData.status}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Ionicons name='star' size={20} color="#FE9A00" />
            <Text style={{ fontSize: 16, fontFamily: "Montserrat-SemiBold", fontWeight: '600', color: "#FE9A00" }}>{propertyData.rating}</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>{propertyData.name}</Text>
          <Text numberOfLines={2} style={styles.rowValue}>{propertyData.location}</Text>
        </View>

        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>About</Text>
        </View>
        <View style={styles.titleWrapper}>
          <Text style={styles.propertyDescription}>{propertyData?.about}</Text>
        </View>
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>Good to Know</Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          {
            propertyData?.to_know?.map((item: string, index: number) => (
              <View key={index} style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
                <Image source={IMAGE.check} style={{ width: 20, height: 20, marginRight: 8 }} />
                <Text style={styles.propertyDescription}>{item}</Text>
              </View>
            ))
          }
        </View>
        <HelpSection title="Interested in visiting or booking?" description="Visit their official Site for more details." icon={IMAGE.share_icon} onPress={() => router.push("/")} />
        <InsightsDownSection titleColor='#B08D59' icon={IMAGE.lifestyle_icon} title="Lifestyle" description="Posted on 14 January 2026" />
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