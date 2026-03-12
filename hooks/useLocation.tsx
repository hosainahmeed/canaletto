import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'
import { LocationData } from '../types/location'

interface UseLocationOptions {
  autoFetch?: boolean
  accuracy?: Location.Accuracy
  cacheTime?: number // Cache duration in milliseconds (default: 5 minutes)
}

interface UseLocationReturn {
  location: LocationData | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
  hasPermission: boolean
  requestPermission: () => Promise<boolean>
}

export default function useLocation(options: UseLocationOptions = {}): UseLocationReturn {
  const {
    autoFetch = false,
    accuracy = Location.Accuracy.Balanced,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
  } = options

  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(false)

  const isFetchingRef = useRef<boolean>(false)

  // AsyncStorage keys
  const LOCATION_CACHE_KEY = '@cached_location_data'
  const LOCATION_TIMESTAMP_KEY = '@cached_location_timestamp'

  // In-memory fallback cache
  const memoryCacheRef = useRef<{
    location: LocationData | null
    timestamp: number | null
  }>({ location: null, timestamp: null })

  // AsyncStorage availability flag
  const isAsyncStorageAvailableRef = useRef<boolean>(true)

  // Check AsyncStorage availability
  const checkAsyncStorageAvailability = useCallback(async (): Promise<boolean> => {
    try {
      await AsyncStorage.getItem('test_key')
      return true
    } catch (error) {
      console.warn('AsyncStorage not available, using memory cache:', error)
      isAsyncStorageAvailableRef.current = false
      return false
    }
  }, [])

  // Save location to cache with fallback
  const saveLocationToCache = useCallback(async (locationData: LocationData) => {
    try {
      // Always save to memory cache first
      memoryCacheRef.current = {
        location: locationData,
        timestamp: Date.now()
      }
      
      // Try AsyncStorage if available
      if (isAsyncStorageAvailableRef.current) {
        await AsyncStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify(locationData))
        await AsyncStorage.setItem(LOCATION_TIMESTAMP_KEY, Date.now().toString())
      }
    } catch (error) {
      console.warn('Failed to save location to AsyncStorage, using memory cache:', error)
      // Fallback to memory cache is already handled above
      isAsyncStorageAvailableRef.current = false
    }
  }, [])

  // Load location from cache with fallback
  const loadLocationFromCache = useCallback(async (): Promise<LocationData | null> => {
    // First check memory cache (fastest)
    const memoryCache = memoryCacheRef.current
    if (memoryCache.location && memoryCache.timestamp) {
      const now = Date.now()
      if (now - memoryCache.timestamp <= cacheTime) {
        return memoryCache.location
      }
    }
    
    // Try AsyncStorage if available
    if (isAsyncStorageAvailableRef.current) {
      try {
        const cachedData = await AsyncStorage.getItem(LOCATION_CACHE_KEY)
        const cachedTimestamp = await AsyncStorage.getItem(LOCATION_TIMESTAMP_KEY)
        
        if (cachedData && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10)
          const now = Date.now()
          
          // Check if cache is still valid
          if (now - timestamp <= cacheTime) {
            const locationData: LocationData = JSON.parse(cachedData)
            // Update memory cache
            memoryCacheRef.current = { location: locationData, timestamp }
            return locationData
          } else {
            // Cache expired, clear it
            await clearLocationCache()
          }
        }
      } catch (error) {
        console.warn('Failed to load from AsyncStorage, using memory cache:', error)
        isAsyncStorageAvailableRef.current = false
      }
    }
    
    return null
  }, [cacheTime])

  // Clear location cache with fallback
  const clearLocationCache = useCallback(async () => {
    try {
      // Clear memory cache
      memoryCacheRef.current = { location: null, timestamp: null }
      
      // Clear AsyncStorage if available
      if (isAsyncStorageAvailableRef.current) {
        await AsyncStorage.removeItem(LOCATION_CACHE_KEY)
        await AsyncStorage.removeItem(LOCATION_TIMESTAMP_KEY)
      }
    } catch (error) {
      console.warn('Failed to clear AsyncStorage cache:', error)
      isAsyncStorageAvailableRef.current = false
    }
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      const granted = status === 'granted'
      setHasPermission(granted)

      if (!granted) {
        setError('Permission to access location was denied')
      }

      return granted
    } catch (err) {
      console.error('Permission error:', err)
      setError('Failed to request location permission')
      return false
    }
  }, [])

  const processLocation = useCallback(async (coords: Location.LocationObjectCoords) => {
    try {
      const [addressData] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      })

      const locationData: LocationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        address: addressData ? {
          city: addressData.city,
          country: addressData.country,
          street: addressData.street,
          region: addressData.region,
          postalCode: addressData.postalCode,
        } : null,
        timestamp: Date.now(),
      }

      setLocation(locationData)
      await saveLocationToCache(locationData)
      return locationData
    } catch (err) {
      console.error('Geocoding error:', err)
      const locationData: LocationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        altitude: coords.altitude,
        accuracy: coords.accuracy,
        address: null,
        timestamp: Date.now(),
      }
      setLocation(locationData)
      await saveLocationToCache(locationData)
      return locationData
    }
  }, [saveLocationToCache])

  const getUserLocation = useCallback(async () => {
    if (isFetchingRef.current) return
    
    isFetchingRef.current = true
    setLoading(true)
    setError(null)

    try {
      // Check if we already have permission
      let permissionGranted = hasPermission
      
      if (!permissionGranted) {
        permissionGranted = await requestPermission()
      }

      if (!permissionGranted) {
        return
      }

      // First, try to load from cache
      const cachedLocation = await loadLocationFromCache()
      if (cachedLocation) {
        setLocation(cachedLocation)
        setLoading(false)
        isFetchingRef.current = false
        return
      }

      // If no valid cache, fetch new location
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy,
      })

      await processLocation(coords)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location'
      setError(errorMessage)
      console.error('Location error:', err)
    } finally {
      setLoading(false)
      isFetchingRef.current = false
    }
  }, [accuracy, processLocation, hasPermission, requestPermission, loadLocationFromCache])

  // Check permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    checkPermission()
  }, [])

  // Load cached location on mount
  useEffect(() => {
    const loadCachedLocation = async () => {
      const cachedLocation = await loadLocationFromCache()
      if (cachedLocation) {
        setLocation(cachedLocation)
      }
    }
    loadCachedLocation()
  }, [loadLocationFromCache])

  // Auto-fetch on mount if enabled and has permission
  useEffect(() => {
    if (autoFetch && hasPermission) {
      getUserLocation()
    }
  }, [autoFetch, hasPermission, getUserLocation])

  return {
    location,
    loading,
    error,
    refetch: getUserLocation,
    hasPermission,
    requestPermission,
  }
}
