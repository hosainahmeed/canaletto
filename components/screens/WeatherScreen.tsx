import useLocation from '@/hooks/useLocation'
import useWeather from '@/hooks/useWeather'
import { useFocusEffect } from '@react-navigation/native'
import React, { useCallback, useEffect } from 'react'
import { Animated } from 'react-native'
import { preloadWeatherIcons } from '../../utils/weatherIcons'
import { WeatherCard, WeatherError, WeatherLoading, WeatherPermission } from '../weather'

export default React.memo(
  function WeatherScreen() {
    const { location, loading: locationLoading, error: locationError, refetch, hasPermission, requestPermission } = useLocation({ autoFetch: true })
    const { weather, loading: weatherLoading, error: weatherError, fetchWeather } = useWeather()

    const fadeAnim = React.useRef(new Animated.Value(0)).current
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current

    useEffect(() => {
      if (location) {
        fetchWeather(location.latitude, location.longitude)
      }
    }, [location, fetchWeather])

    // Preload weather icons for better performance
    useEffect(() => {
      preloadWeatherIcons()
    }, [])

    // Refresh location when screen comes into focus
    useFocusEffect(
      useCallback(() => {
        if (hasPermission && !location) {
          refetch()
        }
      }, [hasPermission, location, refetch])
    )

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
        <WeatherPermission
          onRequestLocation={handleRequestLocation}
          error={locationError}
        />
      )
    }

    // Loading Screen
    if (locationLoading || (weatherLoading && !weather)) {
      return (
        <WeatherLoading
          isLocationLoading={locationLoading}
        />
      )
    }

    // Error Screen
    if (locationError || weatherError) {
      return (
        <WeatherError
          error={locationError || weatherError || 'Unknown error occurred'}
          onRetry={refetch}
        />
      )
    }

    // Weather Display
    return (
      <WeatherCard
        weather={weather}
        location={location}
        fadeAnim={fadeAnim}
        scaleAnim={scaleAnim}
      />
    )
  }
)