import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'
import Button, { ButtonType } from '../ui/button'

const { width } = Dimensions.get('window')

interface WeatherErrorProps {
  error: string
  onRetry: () => void
}

export default React.memo(function WeatherError({ 
  error, 
  onRetry 
}: WeatherErrorProps) {
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
      <View style={styles.errorScreenContainer}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={styles.iconContainer}>
            <Ionicons name="cloud-offline-outline" size={16} color="#FFF" />
          </View>
          <View>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorDescription}>
              {error}
            </Text>
          </View>
        </View>
        <Button 
          type={ButtonType.SECONDARY} 
          style={styles.retryButton}
          icon={<Ionicons name="refresh" size={20} color="#fff" style={styles.buttonIcon} />} 
          title='Try Again' 
          onPress={onRetry} 
        />
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
  errorScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
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
  },
  retryButton: {
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
})
