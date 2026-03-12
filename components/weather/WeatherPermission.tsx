import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Button, { ButtonType } from '../ui/button'

const { width } = Dimensions.get('window')

interface WeatherPermissionProps {
  onRequestLocation: () => void
  error?: string | null
}

export default React.memo(function WeatherPermission({
  onRequestLocation,
  error
}: WeatherPermissionProps) {
  return (
    <LinearGradient
      colors={['#D4B785', '#B08D59']}
      style={[styles.container, {
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#dadada",
        overflow: "hidden",
        width: width - 24,
        marginHorizontal: "auto"
      }]}
    >
      <View style={styles.permissionContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <View style={styles.iconContainer}>
            <Ionicons name="location-outline" size={16} color="#FFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.permissionTitle}>Location Permission Required</Text>
            <Text style={styles.permissionDescription}>
              We need access to your location to show you accurate weather information for your area.
            </Text>
          </View>
        </View>
        <Button
          type={ButtonType.SECONDARY}
          style={styles.permissionButton}
          icon={<Ionicons name="locate" size={20} color="#fff" style={styles.buttonIcon} />}
          title='Grant Location Access'
          onPress={onRequestLocation}
        />
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#FFF" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'left',
  },
  permissionDescription: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'left',
    lineHeight: 17,
    opacity: 0.9,
    marginVertical: 12,
  },
  permissionButton: {
    flex: 1,
    width: width - 48,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backgroundBlendMode: "darken",
    borderWidth: 0.5,
    borderColor: "#E5E7EB"
  },
  buttonIcon: {
    marginRight: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  errorText: {
    color: '#FFF',
    marginLeft: 10,
    fontSize: 14,
  },
})
