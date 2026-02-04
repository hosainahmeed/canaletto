// import { useCallback, useState } from 'react'

// interface WeatherData {
//   temperature: number
//   feelsLike: number
//   humidity: number
//   windSpeed: number
//   description: string
//   icon: string
//   condition: string
//   pressure: number
//   visibility: number
//   city: string
//   country: string
// }

// interface UseWeatherReturn {
//   weather: WeatherData | null
//   loading: boolean
//   error: string | null
//   fetchWeather: (latitude: number, longitude: number) => Promise<void>
// }

// const API_KEY = 'YOUR_OPENWEATHER_API_KEY' // Get free key from openweathermap.org

// export default function useWeather(): UseWeatherReturn {
//   const [weather, setWeather] = useState<WeatherData | null>(null)
//   const [loading, setLoading] = useState<boolean>(false)
//   const [error, setError] = useState<string | null>(null)

//   const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
//     setLoading(true)
//     setError(null)

//     try {
//       const response = await fetch(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
//       )

//       if (!response.ok) {
//         throw new Error('Failed to fetch weather data')
//       }

//       const data = await response.json()

//       const weatherData: WeatherData = {
//         temperature: Math.round(data.main.temp),
//         feelsLike: Math.round(data.main.feels_like),
//         humidity: data.main.humidity,
//         windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
//         description: data.weather[0].description,
//         icon: data.weather[0].icon,
//         condition: data.weather[0].main,
//         pressure: data.main.pressure,
//         visibility: Math.round(data.visibility / 1000), // Convert to km
//         city: data.name,
//         country: data.sys.country,
//       }

//       setWeather(weatherData)
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather'
//       setError(errorMessage)
//       console.error('Weather error:', err)
//     } finally {
//       setLoading(false)
//     }
//   }, [])

//   return {
//     weather,
//     loading,
//     error,
//     fetchWeather,
//   }
// }

import { useCallback, useState } from 'react'

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  description: string
  icon: string
  condition: string
  pressure: number
  visibility: number
  city: string
  country: string
}

interface UseWeatherReturn {
  weather: WeatherData | null
  loading: boolean
  error: string | null
  fetchWeather: (latitude: number, longitude: number) => Promise<void>
}

// Weather code to condition mapping for Open-Meteo API
const getWeatherCondition = (weatherCode: number): { condition: string; description: string } => {
  const weatherMap: { [key: number]: { condition: string; description: string } } = {
    0: { condition: 'Clear', description: 'clear sky' },
    1: { condition: 'Clear', description: 'mainly clear' },
    2: { condition: 'Clouds', description: 'partly cloudy' },
    3: { condition: 'Clouds', description: 'overcast' },
    45: { condition: 'Mist', description: 'foggy' },
    48: { condition: 'Mist', description: 'depositing rime fog' },
    51: { condition: 'Drizzle', description: 'light drizzle' },
    53: { condition: 'Drizzle', description: 'moderate drizzle' },
    55: { condition: 'Drizzle', description: 'dense drizzle' },
    56: { condition: 'Drizzle', description: 'light freezing drizzle' },
    57: { condition: 'Drizzle', description: 'dense freezing drizzle' },
    61: { condition: 'Rain', description: 'slight rain' },
    63: { condition: 'Rain', description: 'moderate rain' },
    65: { condition: 'Rain', description: 'heavy rain' },
    66: { condition: 'Rain', description: 'light freezing rain' },
    67: { condition: 'Rain', description: 'heavy freezing rain' },
    71: { condition: 'Snow', description: 'slight snow fall' },
    73: { condition: 'Snow', description: 'moderate snow fall' },
    75: { condition: 'Snow', description: 'heavy snow fall' },
    77: { condition: 'Snow', description: 'snow grains' },
    80: { condition: 'Rain', description: 'slight rain showers' },
    81: { condition: 'Rain', description: 'moderate rain showers' },
    82: { condition: 'Rain', description: 'violent rain showers' },
    85: { condition: 'Snow', description: 'slight snow showers' },
    86: { condition: 'Snow', description: 'heavy snow showers' },
    95: { condition: 'Thunderstorm', description: 'thunderstorm' },
    96: { condition: 'Thunderstorm', description: 'thunderstorm with slight hail' },
    99: { condition: 'Thunderstorm', description: 'thunderstorm with heavy hail' },
  }
  
  return weatherMap[weatherCode] || { condition: 'Clear', description: 'unknown' }
}

export default function useWeather(): UseWeatherReturn {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(async (latitude: number, longitude: number) => {
    setLoading(true)
    setError(null)

    try {
      // Fetch weather data from Open-Meteo (FREE, no API key required)
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&timezone=auto`
      )

      if (!weatherResponse.ok) {
        throw new Error('Failed to fetch weather data')
      }

      const weatherData = await weatherResponse.json()

      // Fetch location name from Open-Meteo Geocoding API (also free)
      let city = 'Unknown Location'
      let country = ''
      
      try {
        const geocodeResponse = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1`
        )
        
        if (geocodeResponse.ok) {
          const geocodeData = await geocodeResponse.json()
          if (geocodeData.results && geocodeData.results.length > 0) {
            city = geocodeData.results[0].name || 'Unknown'
            country = geocodeData.results[0].country || ''
          }
        }
      } catch (geoErr) {
        console.log('Geocoding failed, using coordinates')
      }

      const current = weatherData.current
      const weatherCondition = getWeatherCondition(current.weather_code)

      const finalWeatherData: WeatherData = {
        temperature: Math.round(current.temperature_2m),
        feelsLike: Math.round(current.apparent_temperature),
        humidity: current.relative_humidity_2m,
        windSpeed: Math.round(current.wind_speed_10m),
        description: weatherCondition.description,
        icon: '01d', // Not used with Open-Meteo, but kept for compatibility
        condition: weatherCondition.condition,
        pressure: Math.round(current.surface_pressure),
        visibility: 10, // Open-Meteo doesn't provide visibility in free tier
        city,
        country,
      }

      setWeather(finalWeatherData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weather'
      setError(errorMessage)
      console.error('Weather error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    weather,
    loading,
    error,
    fetchWeather,
  }
}