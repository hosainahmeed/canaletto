export interface LocationData {
  latitude: number
  longitude: number
  altitude: number | null
  accuracy: number | null
  address: {
    city?: string | null
    country?: string | null
    street?: string | null
    region?: string | null
    postalCode?: string | null
  } | null
  timestamp: number
}
