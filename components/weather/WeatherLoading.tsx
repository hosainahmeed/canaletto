import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { ActivityIndicator, Dimensions, StatusBar, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const { width } = Dimensions.get('window')

interface WeatherLoadingProps {
  isLocationLoading?: boolean
}

export default React.memo(function WeatherLoading({
  isLocationLoading = false
}: WeatherLoadingProps) {
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
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFF" />
          <Text style={styles.loadingText}>
            {isLocationLoading ? 'Getting your location...' : 'Fetching weather data...'}
          </Text>
        </View>
      </SafeAreaView>
    </LinearGradient>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 12,
    color: '#FFF',
    opacity: 0.9,
  },
})
