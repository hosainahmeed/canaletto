import { weatherIcon } from '@/assets/images/wether/image.wether'

export type WeatherIconKey = keyof typeof weatherIcon

interface WeatherIconMapping {
  keywords: string[]
  icon: WeatherIconKey
  priority: number // Higher number = higher priority
}

// Optimized weather icon mappings with priority system
const WEATHER_MAPPINGS: WeatherIconMapping[] = [
  // High priority specific conditions
  { keywords: ['blizzard'], icon: 'blizzerd', priority: 10 },
  { keywords: ['blowing snow'], icon: 'blowingSnow', priority: 9 },
  { keywords: ['heavy rain'], icon: 'heavyRain', priority: 9 },
  { keywords: ['severe thunderstorm'], icon: 'severThunderstorm', priority: 9 },
  { keywords: ['hail'], icon: 'hail', priority: 8 },
  { keywords: ['sleet'], icon: 'sleet', priority: 8 },
  
  // Thunderstorm conditions
  { keywords: ['thunderstorm'], icon: 'scatterdThunderstorm', priority: 7 },
  { keywords: ['rain', 'thunder'], icon: 'rainThunderstorm', priority: 7 },
  
  // Rain conditions (day/night variants)
  { keywords: ['rain', 'night'], icon: 'rainNight', priority: 6 },
  { keywords: ['rain', 'sun'], icon: 'rainSun', priority: 6 },
  { keywords: ['rain'], icon: 'rain', priority: 5 },
  { keywords: ['shower', 'night'], icon: 'scatteradShowersNight', priority: 6 },
  { keywords: ['shower'], icon: 'scatterdShowers', priority: 5 },
  
  // Snow conditions
  { keywords: ['snow'], icon: 'snow', priority: 6 },
  
  // Drizzle conditions (day/night variants)
  { keywords: ['drizzle', 'night'], icon: 'drizzleNight', priority: 5 },
  { keywords: ['drizzle', 'sun'], icon: 'drizzleSun', priority: 5 },
  { keywords: ['drizzle'], icon: 'drizzle', priority: 4 },
  
  // Cloud conditions (day/night variants)
  { keywords: ['cloud', 'clear', 'night'], icon: 'cloudyClearNight', priority: 4 },
  { keywords: ['partly', 'cloud', 'night'], icon: 'partlyCloudyNight', priority: 4 },
  { keywords: ['cloud', 'clear'], icon: 'cloudyClear', priority: 3 },
  { keywords: ['partly', 'cloud'], icon: 'partlyCloudy', priority: 3 },
  { keywords: ['cloud'], icon: 'cloudy', priority: 2 },
  
  // Special conditions
  { keywords: ['fog', 'mist'], icon: 'fog', priority: 4 },
  { keywords: ['wind'], icon: 'wind', priority: 3 },
  
  // Clear conditions (day/night variants)
  { keywords: ['clear', 'night'], icon: 'clearNight', priority: 3 },
  { keywords: ['clear', 'sunny'], icon: 'sunny', priority: 2 },
  { keywords: ['clear'], icon: 'sunny', priority: 1 },
  { keywords: ['sunny'], icon: 'sunny', priority: 1 },
]

// Cache for performance
const iconCache = new Map<string, WeatherIconKey>()

/**
 * Gets the appropriate weather icon based on weather condition and time
 * @param condition - Weather condition string
 * @param isNight - Whether it's nighttime (optional)
 * @returns Weather icon key
 */
export function getWeatherIcon(condition: string, isNight?: boolean): WeatherIconKey {
  if (!condition) return 'sunny'
  
  const cacheKey = `${condition.toLowerCase()}_${isNight ? 'night' : 'day'}`
  
  // Check cache first
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey)!
  }
  
  const normalizedCondition = condition.toLowerCase()
  
  // Find matching mappings
  const matches = WEATHER_MAPPINGS.filter(mapping => {
    const hasAllKeywords = mapping.keywords.every(keyword => 
      normalizedCondition.includes(keyword)
    )
    
    // For time-specific conditions, check if time matches
    if (isNight !== undefined) {
      const isNightCondition = mapping.keywords.includes('night')
      const isDayCondition = mapping.keywords.includes('sun') || mapping.keywords.includes('day')
      
      if (isNight && isDayCondition) return false
      if (!isNight && isNightCondition) return false
    }
    
    return hasAllKeywords
  })
  
  // Sort by priority and get the best match
  const bestMatch = matches.sort((a, b) => b.priority - a.priority)[0]
  const selectedIcon = bestMatch?.icon || 'sunny'
  
  // Cache the result
  iconCache.set(cacheKey, selectedIcon)
  
  return selectedIcon
}

/**
 * Determines if it's currently nighttime based on current time
 * @returns Whether it's nighttime
 */
export function isNightTime(): boolean {
  const hour = new Date().getHours()
  return hour >= 18 || hour < 6 // 6 PM - 6 AM
}

/**
 * Gets weather icon with automatic day/night detection
 * @param condition - Weather condition string
 * @returns Weather icon key
 */
export function getWeatherIconAuto(condition: string): WeatherIconKey {
  return getWeatherIcon(condition, isNightTime())
}

/**
 * Preloads weather icons for better performance
 */
export function preloadWeatherIcons(): void {
  // Preload common conditions
  const commonConditions = [
    'clear', 'cloudy', 'rain', 'snow', 'sunny', 'partly cloudy',
    'clear night', 'cloudy night', 'rain night'
  ]
  
  commonConditions.forEach(condition => {
    getWeatherIconAuto(condition)
  })
}

/**
 * Clears the icon cache (useful for testing)
 */
export function clearIconCache(): void {
  iconCache.clear()
}
