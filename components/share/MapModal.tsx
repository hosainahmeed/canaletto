import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
export default function MapModal({ propertyData, setShowLargerMap }: any) {
  return (
    <View>
      {propertyData?.lat && propertyData?.lng && <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: propertyData?.lat,
            longitude: propertyData?.lng,
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
              latitude: propertyData?.lat,
              longitude: propertyData?.lng,
            }}
            title={propertyData?.name}
            description={propertyData?.location}
          />
        </MapView>
        <TouchableOpacity
          style={styles.viewLargerMapButton}
          onPress={() => setShowLargerMap(true)}
        >
          <Text style={styles.viewLargerMapText}>View Larger Map</Text>
        </TouchableOpacity>
      </View>}
    </View>
  )
}

const styles = StyleSheet.create({
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

  viewLargerMapButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },

  viewLargerMapText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
})