import { Image } from 'expo-image'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { getAvatarInitials } from '../../utils/avatarHelpers'

interface AvatarProps {
  source?: { uri: string } | null
  name: string
  size?: number
  fontSize?: number
  style?: any
}

export default function Avatar({
  source,
  name,
  size = 80,
  fontSize = 32,
  style
}: AvatarProps) {
  const avatarSource = source && source.uri ? source : null
  const initials = getAvatarInitials(name)

  if (avatarSource) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Image
          source={avatarSource}
          style={[styles.image, { width: size, height: size }]}
          contentFit="cover"
          transition={200}
        />
      </View>
    )
  }

  return (
    <View
      style={[
        styles.container,
        styles.fallbackContainer,
        {
          width: size,
          height: size
        },
        style
      ]}
    >
      <Text style={[styles.initials, { fontSize }]}>
        {initials}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 28,
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
})
