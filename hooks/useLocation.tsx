import * as Location from 'expo-location'
import { useCallback, useEffect, useRef, useState } from 'react'

interface LocationData {
  latitude: number
  longitude: number
  altitude: number | null
  accuracy: number | null
  address: Location.LocationGeocodedAddress | null
  timestamp: number
}

interface UseLocationOptions {
  autoFetch?: boolean
  accuracy?: Location.Accuracy
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
  } = options

  const [location, setLocation] = useState<LocationData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  
  const isFetchingRef = useRef<boolean>(false)

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
        address: addressData || null,
        timestamp: Date.now(),
      }

      setLocation(locationData)
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
      return locationData
    }
  }, [])

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
  }, [accuracy, processLocation, hasPermission, requestPermission])

  // Check permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      const { status } = await Location.getForegroundPermissionsAsync()
      setHasPermission(status === 'granted')
    }
    checkPermission()
  }, [])

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