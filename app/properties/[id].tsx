import { propertyDetailsIcon } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

const { width, height } = Dimensions.get('window')
const IMAGE_HEIGHT = Math.min(height * 0.3, 250)
export default function PropertyByID({ id }: { id: string }) {
  const router = useRouter()
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const propertyData = {
    name: 'The Wilds Project',
    size: '1000 sqft',
    rooms: 3,
    type_of_use: 'Residential',
    property_type: 'Villa',
    total_units: 5,
    payment_plan: '10 Years',
    location: 'Abu Dhabi, Yas Island',
    image: [
      'https://www.dp.ae/pictures/a0c427ee-528d-4611-818a-9c12b76d5e45Image07_Banner_1920x800-min.jpg',
      'https://dubaiproperties.org.in/wp-content/uploads/2023/01/luxury-property-in-dubai-scaled.jpg',
    ],
    lat: 24.4941,
    lng: 54.6077,
  }

  const DETAILS = [
    { icon: propertyDetailsIcon.size, label: 'Size', value: propertyData.size },
    { icon: propertyDetailsIcon.rooms, label: 'Rooms', value: propertyData.rooms },
    { icon: propertyDetailsIcon.type_of_use, label: 'Type of Use', value: propertyData.type_of_use },
    { icon: propertyDetailsIcon.property_type, label: 'Property Type', value: propertyData.property_type },
    { icon: propertyDetailsIcon.units, label: 'Total Units', value: propertyData.total_units },
    { icon: propertyDetailsIcon.payment_plan, label: 'Payment Plan', value: propertyData.payment_plan },
  ]

  const PROPERTY_INFO = [
    { icon: propertyDetailsIcon.property_files, label: 'Property Files', styles: { color: '#3b82f680', backgroundColor: "rgba(59, 130, 246, 0.2)" }, route: "/properties/files" },
    { icon: propertyDetailsIcon.payment_status, label: 'Payment Status', styles: { color: '#22C55E80', backgroundColor: "rgba(34, 197, 94, 0.2)" }, route: "/properties/payment-status" },
    { icon: propertyDetailsIcon.construction, label: 'Construction Progress', styles: { color: '#B08D5980', backgroundColor: "rgba(176, 141, 89, 0.2)" }, route: "/properties/construction" },
    { icon: propertyDetailsIcon.assigned_agent, label: 'Assigned Agent', styles: { color: '#A855F780', backgroundColor: "rgba(168, 85, 247, 0.2)" }, route: "/properties/assigned-agent" },
  ]

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
          title="Property Details"
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

          {/* Image Counter */}
          {/* {propertyData.image.length > 1 && (
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {activeImageIndex + 1} / {propertyData.image.length}
              </Text>
            </View>
          )} */}
        </View>

        {/* Title */}
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>{propertyData.name}</Text>
        </View>

        {/* Details Card */}
        <Card style={[styles.card, { width: width - 20 }]}>
          {DETAILS.map((item, index) => (
            <DetailRow
              key={item.label}
              item={item}
              isLast={index === DETAILS.length - 1}
            />
          ))}
        </Card>

        {/* Location Card */}
        <Card style={[styles.card, { width: width - 20 }]}>
          <DetailRow
            item={{
              icon: propertyDetailsIcon.location,
              label: 'Location',
              value: propertyData.location,
            }}
            isLast
          />

          {/* Map View */}
          <View style={styles.mapContainer}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              initialRegion={{
                latitude: propertyData.lat,
                longitude: propertyData.lng,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
              }}
              scrollEnabled={false}
              zoomEnabled={false}
              pitchEnabled={false}
              rotateEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: propertyData.lat,
                  longitude: propertyData.lng,
                }}
                title={propertyData.name}
                description={propertyData.location}
              />
            </MapView>
          </View>
        </Card>
        <View style={styles.titleWrapper}>
          <Text numberOfLines={2} style={styles.propertyName}>Property Info</Text>
        </View>
        <View style={styles.propertyInfoGrid}>
          {PROPERTY_INFO.map((item) => (
            <Pressable
              key={item.label}
              style={styles.propertyInfoPressable}
              onPress={() => router.push(item?.route as any)}
            >
              <Card style={[
                styles.propertyInfoCard,
                {
                  backgroundColor: item?.styles?.backgroundColor,
                  borderColor: item?.styles?.color,
                },
              ]}
              >
                <Image source={item?.icon} style={styles.propertyInfoIcon} />
                <Text numberOfLines={1} style={[styles.propertyInfoLabel, { color: item?.styles?.color }]}>{item.label}</Text>
              </Card>
            </Pressable>
          ))}
        </View>
        <HelpSection />
        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaViewWithSpacing >
  )
}

const DetailRow = ({ item, isLast }: any) => (
  <View style={[styles.row, !isLast && styles.rowDivider]}>
    <Image source={item.icon} style={styles.rowIcon} />
    <View style={styles.rowText}>
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Text style={styles.rowValue}>{item.value}</Text>
    </View>
  </View>
)

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

  propertyName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    fontFamily: 'Montserrat-SemiBoldItalic',
    fontStyle: 'italic',
  },

  card: {
    marginTop: 16,
    marginHorizontal: "auto",
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },

  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  rowIcon: {
    width: 44,
    height: 44,
  },

  rowText: {
    flex: 1,
  },

  rowLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    color: '#B0B0B0',
    fontWeight: '500',
  },

  rowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginTop: 2,
  },

  mapContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
    height: 180,
  },

  map: {
    width: '100%',
    height: '100%',
  },

  propertyInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 16,
  },

  propertyInfoPressable: {
    width: '48%',
    marginBottom: 12,
  },

  propertyInfoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    gap: 12,
  },

  propertyInfoIcon: {
    width: 40,
    height: 40,
  },

  propertyInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 24,
  },
})