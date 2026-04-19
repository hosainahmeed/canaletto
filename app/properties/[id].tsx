import { propertyDetailsIcon } from '@/assets/images/image.index'
import Card from '@/components/cards/Card'
import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import HelpSection from '@/components/share/HelpSection'
import ImageCarousel from '@/components/share/ImageCarousel'
import BackHeaderButton from '@/components/ui/BackHeaderButton'
import { Image } from 'expo-image'
import { useLocalSearchParams, useRouter } from 'expo-router'
import React, { memo, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { useGetSinglePropertyQuery } from '../redux/services/propertyApis'

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
        latitude: lat || 23.8103,
        longitude: lng || 90.4125,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
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

export default function PropertyByID() {
  const { id } = useLocalSearchParams();
  const router = useRouter()
  const { t } = useTranslation()
  const [showLargerMap, setShowLargerMap] = useState(false)
  const [loading] = useState(false)
  const { data, isLoading } = useGetSinglePropertyQuery(id as string, { skip: !id })

  const propertyData = {
    id: data?.data?.id,
    name: data?.data?.name,
    size: data?.data?.size || '-',
    rooms: data?.data?.totalRooms || "-",
    type_of_use: data?.data?.type || '-',
    property_type: data?.data?.type || '-',
    total_units: data?.data?.units || "-",
    payment_plan: data?.data?.paymentPlan || '-',
    location: data?.data?.address || '-',
    image: data?.data?.images || [],
    lat: data?.data?.latitude,
    lng: data?.data?.longitude,
  }

  const DETAILS = [
    { icon: propertyDetailsIcon.size, label: t('property_details.size'), value: propertyData.size },
    { icon: propertyDetailsIcon.rooms, label: t('property_details.rooms'), value: propertyData.rooms },
    { icon: propertyDetailsIcon.type_of_use, label: t('property_details.type_of_use'), value: propertyData.type_of_use },
    { icon: propertyDetailsIcon.property_type, label: t('property_details.property_type'), value: propertyData.property_type },
    { icon: propertyDetailsIcon.units, label: t('property_details.total_units'), value: propertyData.total_units },
    { icon: propertyDetailsIcon.payment_plan, label: t('property_details.payment_plan'), value: propertyData.payment_plan },
  ]
  const PROPERTY_INFO = [
    { icon: propertyDetailsIcon.property_files, label: t('property_details.property_file'), styles: { color: '#3b82f680', backgroundColor: "rgba(59, 130, 246, 0.2)" }, route: "/properties/files" },
    { icon: propertyDetailsIcon.payment_status, label: t('property_details.payment_status'), styles: { color: '#22C55E80', backgroundColor: "rgba(34, 197, 94, 0.2)" }, route: "/properties/payment-status" },
    { icon: propertyDetailsIcon.construction, label: t('property_details.construction_progress'), styles: { color: '#B08D5980', backgroundColor: "rgba(176, 141, 89, 0.2)" }, route: "/properties/construction" },
    { icon: propertyDetailsIcon.assigned_agent, label: t('property_details.assigned_agent'), styles: { color: '#A855F780', backgroundColor: "rgba(168, 85, 247, 0.2)" }, route: "/properties/assigned-agent" },
    { icon: propertyDetailsIcon.site_updates, label: t('property_details.site_updates'), styles: { color: '#06B6D480', backgroundColor: "rgba(6, 182, 212, 0.2)" }, route: "/properties/site-updates" },
    { icon: propertyDetailsIcon.property_packages, label: t('property_details.property_packages'), styles: { color: '#ef4444b3', backgroundColor: "rgba(239, 68, 68, 0.2)" }, route: "/properties/property-packages" },
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
          {Array.isArray(data?.data?.images) && data?.data?.images.length > 0 && (
            <ImageCarousel images={data?.data?.images} />
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

            <View style={styles.mapContainer}>
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
            </View>
          </Card>
          <View style={styles.titleWrapper}>
            <Text numberOfLines={2} style={styles.propertyName}>{t('property_details.property_info')}</Text>
          </View>
          <View style={styles.propertyInfoGrid}>
            {PROPERTY_INFO.map((item) => (
              <Pressable
                key={item.label}
                style={styles.propertyInfoPressable}
                onPress={() => router.push({
                  pathname: item?.route as any,
                  params: {
                    id: propertyData.id,
                  }
                })}
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
          <View style={styles.bottomSpacing} />
        </ScrollView>

        {/* Full Screen Map */}
        <Modal visible={showLargerMap} animationType="slide">
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
        </Modal>
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
    objectFit: 'contain',
  },

  propertyInfoLabel: {
    fontSize: 14,
    fontWeight: '600',
  },

  bottomSpacing: {
    height: 24,
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