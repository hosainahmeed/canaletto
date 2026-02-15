import { propertyDetailsIcon } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import ImageCarousel from '@/components/share/ImageCarousel'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native'

// Conditional import for MapView to avoid crash
let MapView: any, Marker: any
try {
  const maps = require('react-native-maps')
  MapView = maps.default
  Marker = maps.Marker
} catch (e) {
  console.warn('react-native-maps not available', e)
}

const { width } = Dimensions.get('window')

/* ---------------- Error Boundary ---------------- */

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any) {
    console.log('Property Screen Error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Something went wrong loading the property details.
          </Text>
        </View>
      )
    }

    return this.props.children
  }
}

/* ---------------- Detail Row ---------------- */

const DetailRow = memo(({ item, isLast }: any) => {
  if (!item) return null

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <Image
        source={item.icon}
        style={styles.rowIcon}
      />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{item.label}</Text>
        <Text style={styles.rowValue}>{item.value}</Text>
      </View>
    </View>
  )
})

/* ---------------- Safe Map Component ---------------- */

const MapComponent = ({
  lat,
  lng,
  name,
  location,
  style,
  scrollEnabled = false,
  zoomEnabled = false,
}: any) => {
  const isValidCoordinates =
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180

  if (!MapView || !isValidCoordinates) {
    return (
      <View style={[style, styles.mapFallback]}>
        <Text style={styles.mapFallbackText}>Location unavailable</Text>
      </View>
    )
  }

  return (
    <MapView
      style={style}
      provider={Platform.OS === 'android' ? MapView.PROVIDER_GOOGLE : undefined}
      initialRegion={{
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      scrollEnabled={scrollEnabled}
      zoomEnabled={zoomEnabled}
    >
      <Marker
        coordinate={{ latitude: lat, longitude: lng }}
        title={name}
        description={location}
      />
    </MapView>
  )
}

/* ---------------- Main Screen ---------------- */

export default function PropertyByID({ id }: { id: string }) {
  const router = useRouter()
  const { t } = useTranslation()
  const [showLargerMap, setShowLargerMap] = useState(false)
  const [loading] = useState(false)

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
    { icon: propertyDetailsIcon.size, label: t('property_details.size'), value: propertyData.size },
    { icon: propertyDetailsIcon.rooms, label: t('property_details.rooms'), value: propertyData.rooms },
    { icon: propertyDetailsIcon.type_of_use, label: t('property_details.type_of_use'), value: propertyData.type_of_use },
    { icon: propertyDetailsIcon.property_type, label: t('property_details.property_type'), value: propertyData.property_type },
    { icon: propertyDetailsIcon.units, label: t('property_details.total_units'), value: propertyData.total_units },
    { icon: propertyDetailsIcon.payment_plan, label: t('property_details.payment_plan'), value: propertyData.payment_plan },
  ]

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) router.back()
    else router.replace('/')
  }, [router])

  if (loading) {
    return (
      <SafeAreaViewWithSpacing>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaViewWithSpacing>
    )
  }

  return (
    <ErrorBoundary>
      <SafeAreaViewWithSpacing>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <BackHeaderButton
            title={t('page_title.property_details')}
            onPress={handleBackPress}
          />

          {/* Only render carousel if images exist */}
          {Array.isArray(propertyData.image) && propertyData.image.length > 0 && (
            <ImageCarousel images={propertyData.image} />
          )}

          <View style={styles.titleWrapper}>
            <Text style={styles.propertyName}>{propertyData.name}</Text>
          </View>

          <Card style={[styles.card, { width: width - 20 }]}>
            {DETAILS.map((item, index) => (
              <DetailRow
                key={`${item.label}-${index}`}
                item={item}
                isLast={index === DETAILS.length - 1}
              />
            ))}
          </Card>

          <Card style={[styles.card, { width: width - 20 }]}>
            <DetailRow
              item={{
                icon: propertyDetailsIcon.location,
                label: t('property_details.location'),
                value: propertyData.location,
              }}
              isLast
            />

            {/* <View style={styles.mapContainer}>
              <MapComponent
                lat={propertyData.lat}
                lng={propertyData.lng}
                name={propertyData.name}
                location={propertyData.location}
                style={styles.map}
              />

              <TouchableOpacity
                style={styles.viewLargerMapButton}
                onPress={() => setShowLargerMap(true)}
              >
                <Text style={styles.viewLargerMapText}>
                  {t('property_details.view_larger_map')}
                </Text>
              </TouchableOpacity>
            </View> */}
          </Card>

          <HelpSection />
          <View style={{ height: 30 }} />
        </ScrollView>

        {/* Full Screen Map */}
        {/* <Modal visible={showLargerMap} animationType="slide">
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowLargerMap(false)}
            >
              <Text style={{ fontSize: 18 }}>✕</Text>
            </TouchableOpacity>

            <MapComponent
              lat={propertyData.lat}
              lng={propertyData.lng}
              name={propertyData.name}
              location={propertyData.location}
              style={{ flex: 1 }}
              scrollEnabled
              zoomEnabled
            />
          </View>
        </Modal> */}
      </SafeAreaViewWithSpacing>
    </ErrorBoundary>
  )
}

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1 },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorText: {
    fontSize: 16,
    color: 'red',
  },

  titleWrapper: {
    paddingHorizontal: 12,
    marginTop: 16,
  },

  propertyName: {
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
  },

  card: {
    marginTop: 16,
    alignSelf: 'center',
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

  rowText: { flex: 1 },

  rowLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#B0B0B0',
  },

  rowValue: {
    fontSize: 14,
    fontWeight: '600',
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

  mapFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mapFallbackText: {
    color: '#666',
  },

  viewLargerMapButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  viewLargerMapText: {
    color: '#fff',
    fontSize: 12,
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
})