import { Image } from 'expo-image'
import { useRouter } from 'expo-router'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import Card from '../cards/Card'

export default function InsightsDownSection({ icon, title, description, onPress, titleColor }: { icon: any, title: string, description: string, onPress?: () => void, titleColor?: string }) {
  const { width: screenWidth } = useWindowDimensions()
  const router = useRouter()
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress || (() => router.push('/(tabs)/Support'))}>
      <Card style={[styles.card, { width: screenWidth - 20 }]}>
        <View style={styles.iconWrapper} >
          <Image style={styles.icon} source={icon} />
        </View>
        <View>
          <Text numberOfLines={1} style={[styles.title, { color: titleColor || '#000' }]}>{title}</Text>
          <Text numberOfLines={1} style={styles.description}>{description}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    marginVertical: 12,
    backgroundColor: '#fff',
    marginHorizontal: 'auto',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    fontFamily: 'Nunito-SemiBold',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    fontFamily: 'Nunito-Regular',
    color: '#666666',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  icon: {
    width: "100%",
    height: "100%",
  },
})