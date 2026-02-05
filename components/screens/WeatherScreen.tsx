import { icon, weatherIcon } from '@/assets/images/wether/image.wether'
import useLocation from '@/hooks/useLocation'
import useWeather from '@/hooks/useWeather'
import { Ionicons } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect } from 'react'
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Card from '../cards/Card'
import Button, { ButtonType } from '../ui/button'

const { width } = Dimensions.get('window')

export default function WeatherScreen() {
  const { location, loading: locationLoading, error: locationError, refetch, hasPermission, requestPermission } = useLocation()
  const { weather, loading: weatherLoading, error: weatherError, fetchWeather } = useWeather()

  const fadeAnim = React.useRef(new Animated.Value(0)).current
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current

  useEffect(() => {
    if (location) {
      fetchWeather(location.latitude, location.longitude)
    }
  }, [location, fetchWeather])

  useEffect(() => {
    if (weather) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [weather, fadeAnim, scaleAnim])

  const handleRequestLocation = async () => {
    const granted = await requestPermission()
    if (granted) {
      refetch()
    }
  }
  // Permission Request Screen
  if (!hasPermission) {
    return (
      <LinearGradient
        colors={['#D4B785', '#B08D59']}
        style={[{
          padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#dadada", overflow: "hidden", width: width - 24, marginHorizontal: "auto"
        }]}
      >
        <View style={styles.container}>
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
            <Button type={ButtonType.SECONDARY} style={{
              flex: 1, width: width - 48, borderRadius: 12, backgroundColor: "rgba(255, 255, 255, 0.2)", backgroundBlendMode: "darken", borderWidth: 0.5, borderColor: "#E5E7EB"
            }} icon={<Ionicons name="locate" size={20} color="#fff" style={styles.buttonIcon} />} title='Grant Location Access' onPress={handleRequestLocation} />
            {locationError && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#FFF" />
                <Text style={styles.errorText}>{locationError}</Text>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    )
  }

  // Loading Screen
  if (locationLoading || (weatherLoading && !weather)) {
    return (
      <LinearGradient
        colors={['#D4B785', '#B08D59']}
        style={[{
          padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#dadada", overflow: "hidden", width: width - 24, marginHorizontal: "auto"
        }]}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFF" />
              <Text style={styles.loadingText}>
                {locationLoading ? 'Getting your location...' : 'Fetching weather data...'}
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </LinearGradient>
    )
  }

  // Error Screen
  if (locationError || weatherError) {
    return (
      <LinearGradient
        colors={['#D4B785', '#B08D59']}
        style={[{
          padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#dadada", overflow: "hidden", width: width - 24, marginHorizontal: "auto"
        }]}
      >
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <View style={styles.errorScreenContainer}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.iconContainer}>
                <Ionicons name="cloud-offline-outline" size={16} color="#FFF" />
              </View>
              <View>
                <Text style={styles.errorTitle}>Oops!</Text>
                <Text style={styles.errorDescription}>
                  {locationError || weatherError}
                </Text>
              </View>
            </View>
            <Button type={ButtonType.SECONDARY} style={{
              flex: 1, width: width - 48, borderRadius: 12, backgroundColor: "rgba(255, 255, 255, 0.2)", backgroundBlendMode: "darken", borderWidth: 0.5, borderColor: "#E5E7EB"
            }} icon={<Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />} title='Try Again' onPress={refetch} />
          </View>
        </View>
      </LinearGradient>
    )
  }


  const getWeatherIconKey = (condition: string): keyof typeof weatherIcon => {
    const cond = condition.toLowerCase()
    const includesAny = (...phrases: string[]) => phrases.some((phrase) => cond.includes(phrase))

    if (includesAny('blizzard')) return 'blizzerd'
    if (includesAny('blowing snow')) return 'blowingSnow'

    if (includesAny('clear') && includesAny('night')) return 'clearNight'
    if (includesAny('cloud') && includesAny('clear') && includesAny('night')) return 'cloudyClearNight'
    if (includesAny('cloud') && includesAny('clear')) return 'cloudyClear'

    if (includesAny('partly') && includesAny('cloud') && includesAny('night')) return 'partlyCloudyNight'
    if (includesAny('partly') && includesAny('cloud')) return 'partlyCloudy'
    if (includesAny('cloud')) return 'cloudy'

    if (includesAny('drizzle') && includesAny('night')) return 'drizzleNight'
    if (includesAny('drizzle') && includesAny('sun', 'day')) return 'drizzleSun'
    if (includesAny('drizzle')) return 'drizzle'

    if (includesAny('heavy rain')) return 'heavyRain'
    if (includesAny('rain') && includesAny('night')) return 'rainNight'
    if (includesAny('rain') && includesAny('sun', 'day')) return 'rainSun'
    if (includesAny('rain') && includesAny('thunder')) return 'rainThunderstorm'
    if (includesAny('shower') && includesAny('night')) return 'scatteradShowersNight'
    if (includesAny('shower')) return 'scatterdShowers'
    if (includesAny('thunderstorm') && includesAny('severe')) return 'severThunderstorm'
    if (includesAny('thunderstorm')) return 'scatterdThunderstorm'
    if (includesAny('rain')) return 'rain'

    if (includesAny('sleet')) return 'sleet'
    if (includesAny('hail')) return 'hail'
    if (includesAny('snow')) return 'snow'
    if (includesAny('fog', 'mist')) return 'fog'
    if (includesAny('wind')) return 'wind'

    return includesAny('clear') ? 'sunny' : 'sunny'
  }
  return (
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
      }}>

      <LinearGradient colors={['#D4B785', '#B08D59']}
        style={{
          flexDirection: 'row',
          padding: 16,
          justifyContent: "space-between",
          paddingVertical: 32
        }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
            <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff' }}>
              {weather?.temperature || '--'}°
            </Text>
            <Text style={{ fontSize: 14, fontWeight: 'regular', color: '#fff', marginBottom: 4 }}>
              {weather?.condition || 'Loading...'}
            </Text>
          </View>
          <Text style={{ fontSize: 12, fontWeight: 'regular', color: '#fff', marginTop: 4 }}>
            {new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </Text>
        </View>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 4,
          alignItems: "center",
          justifyContent: "center",
          borderColor: "#ffffff77",
          borderWidth: 2,
          backgroundColor: "white"
        }}>
          <Image
            source={
              weather?.condition
                ? weatherIcon[getWeatherIconKey(weather.condition)]
                : weatherIcon.sunny
            }
            style={{ width: 40, height: 40 }}
          />
        </View>
      </LinearGradient>
      <View
        style={{
          flexDirection: 'row',
          padding: 16,
          justifyContent: 'space-between',
          backgroundColor: '#fff'
        }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image
            source={icon.location}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ fontSize: 12, fontWeight: 'regular', color: '#666666' }}>
            {location?.address?.city || weather?.city || 'Unknown Location'}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Image
            source={icon.date}
            style={{ width: 20, height: 20 }}
          />
          <Text style={{ fontSize: 12, fontWeight: 'regular', color: '#666666' }}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric'
            })}
          </Text>
        </View>
      </View>
    </Card>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },

  // Permission Screen
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
    lineHeight: 24,
    opacity: 0.9,
    marginBottom: 40,
  },
  permissionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 30,
    shadowColor: '#111',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  permissionButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#667EEA',
  },

  // Loading Screen
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

  // Error Screen
  errorScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 12,
    color: '#FFF',
    textAlign: 'left',
    opacity: 0.9,
    marginBottom: 30,
    // lineHeight: 24,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    borderWidth: 0.5,
    borderColor: '#FFF',
  },
  retryButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
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

  // Weather Display
  weatherContainer: {
    flex: 1,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cityName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
  mainWeatherContainer: {
    alignItems: 'center',
    marginVertical: 30,
  },
  weatherIcon: {
    marginBottom: 10,
  },
  temperature: {
    fontSize: 80,
    fontWeight: '200',
    color: '#FFF',
    letterSpacing: -2,
  },
  description: {
    fontSize: 22,
    color: '#FFF',
    opacity: 0.9,
    marginTop: 10,
  },
  feelsLike: {
    fontSize: 16,
    color: '#FFF',
    opacity: 0.7,
    marginTop: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  detailCard: {
    width: (width - 60) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
    backdropFilter: 'blur(10px)',
  },
  detailValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
    marginTop: 5,
  },
  coordinatesContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.8,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginLeft: 8,
  },
})