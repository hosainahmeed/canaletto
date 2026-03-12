import { icon, weatherIcon } from '@/assets/images/wether/image.wether'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'
import { LocationData } from '../../types/location'
import { getWeatherIconAuto } from '../../utils/weatherIcons'
import Card from '../cards/Card'

const { width } = Dimensions.get('window')

interface WeatherData {
  temperature?: number
  condition?: string
  city?: string
}

interface WeatherCardProps {
  weather: WeatherData | null
  location: LocationData | null
  fadeAnim: Animated.Value
  scaleAnim: Animated.Value
}

export default React.memo(function WeatherCard({
  weather,
  location,
  fadeAnim,
  scaleAnim
}: WeatherCardProps) {
  // Get optimized weather icon with automatic day/night detection
  const weatherIconKey = weather?.condition ? getWeatherIconAuto(weather.condition) : 'sunny'

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
    >
      <Card
        style={{
          backgroundColor: '#ffffff77',
          padding: 0,
          overflow: "hidden",
          borderRadius: 16,
          borderColor: '#DDDDDD80',
          borderWidth: 1,
          width: width - 20,
          marginHorizontal: "auto"
        }}
      >
        <LinearGradient
          colors={['#D4B785', '#B08D59']}
          style={styles.weatherHeader}
        >
          <View>
            <View style={styles.temperatureContainer}>
              <Text style={styles.temperature}>
                {weather?.temperature || '--'}°
              </Text>
              <Text style={styles.condition}>
                {weather?.condition || 'Loading...'}
              </Text>
            </View>
            <Text style={styles.time}>
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              })}
            </Text>
          </View>
          <View style={styles.iconWrapper}>
            <Image
              source={weatherIcon[weatherIconKey]}
              style={styles.weatherIcon}
            />
          </View>
        </LinearGradient>

        <View style={styles.footer}>
          <View style={styles.locationInfo}>
            <Image
              source={icon.location}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>
              {location?.address?.city || weather?.city || 'Unknown Location'}
            </Text>
          </View>
          <View style={styles.dateInfo}>
            <Image
              source={icon.date}
              style={styles.footerIcon}
            />
            <Text style={styles.footerText}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  )
})

const styles = StyleSheet.create({
  weatherHeader: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: "space-between",
    paddingVertical: 32
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8
  },
  temperature: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff'
  },
  condition: {
    fontSize: 14,
    fontWeight: 'regular',
    color: '#fff',
    marginBottom: 4
  },
  time: {
    fontSize: 12,
    fontWeight: 'regular',
    color: '#fff',
    marginTop: 4
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#ffffff77",
    borderWidth: 2,
    backgroundColor: "white"
  },
  weatherIcon: {
    width: 40,
    height: 40
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  footerIcon: {
    width: 20,
    height: 20
  },
  footerText: {
    fontSize: 12,
    fontWeight: 'regular',
    color: '#666666'
  },
})
