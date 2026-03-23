import SafeAreaViewWithSpacing from '@/components/safe-area/SafeAreaViewWithSpacing'
import Button, { ButtonSize } from '@/components/ui/button'
import { Rotate01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react-native'
import { useRouter } from 'expo-router'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'

const { width, height } = Dimensions.get('window')

export default function ServerDown() {
  const router = useRouter()

  const handleRetry = () => {
    router.replace('/')
  }

  return (
    <SafeAreaViewWithSpacing>
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require('@/assets/images/construction-icon.png')}
            style={styles.icon}
            resizeMode="contain"
          />

          <Text style={styles.title}>Server Under Maintenance</Text>

          <Text style={styles.subtitle}>
            Our servers are currently down for maintenance. We're working hard to get things back to normal.
          </Text>

          <Text style={styles.description}>
            Please try again in a few minutes. We apologize for any inconvenience.
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Retry"
              onPress={handleRetry}
              size={ButtonSize.LARGE}
              icon={<HugeiconsIcon color={"white"} icon={Rotate01Icon} />}
            />
          </View>

          <Text style={styles.estimatedTime}>
            Estimated recovery time: 15-30 minutes
          </Text>
        </View>
      </View>
    </SafeAreaViewWithSpacing>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FAFAFA',
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  icon: {
    width: 120,
    height: 120,
    marginBottom: 32,
    tintColor: '#B08D59',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Montserrat',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
    fontFamily: 'Montserrat',
  },
  description: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 24,
  },
  estimatedTime: {
    fontSize: 12,
    color: '#B08D59',
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontStyle: 'italic',
  },
})